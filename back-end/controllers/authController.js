import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import util from 'util';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/email.js';

const signToken = id => jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
});

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: user
    });
};

const signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });
    console.log(req.body);
    createSendToken(user, 201, res);
})

const login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    console.log(req.body);
    // check email and password exists
    if(!email || !password) return next(new AppError('Please provide email and password', 400));
    // check if user exists and password is correct
    const user = await User.findOne({email}).select('+password');

    if(!user) return next(new AppError('Incorrect email', 400));

    const correct = await user.correctPassword(password, user.password);

    if(!correct) return next(new AppError('Incorrect password', 401));

    // if everything is ok, send token
    createSendToken(user, 200, res);
})

const logout = (req, res) => {
    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({status: 'success'});
}

const protect = async (req, res, next) => {
    // get token and check if it is exists
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
    else if(req.cookies.jwt) token = req.cookies.jwt
    if(!token) return next(new AppError('You are not logged in. Please log in to get access.', 400));
    
    // validate token
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) return next(new AppError('User is no longer available. Please sign in again!', 401));

    // Check if user change password after token issued
    if(currentUser.changePasswordAfter(decoded.iat)) return next(new AppError('User recently changed password. Please login again!', 401));

    // grant access to protected routes
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
}

const isLoggedIn = catchAsync(async (req, res, next) => {
    // Get token and check if exists
    if(!req.cookies || !req.cookies.jwt) return next();
    
    // validate token
    const decoded = await utils.promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) return next();

    // Check if user change password after token issued
    if(currentUser.changePasswordAfter(decoded.iat)) return next();

    // grant access to protected routes
    // Thers is a logged in user
    res.locals.user = currentUser;
    next();
});

const restrictTo = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)) return next(new AppError('You do not have permission to perform this action', 403));
    next();
}

const forgetPassword = catchAsync(async(req, res, next) => {
    // Get based on posted mail
    const user = await User.findOne({email: req.body.email});
    if(!user) return next(new AppError(`There is no user with this ${req.body.email} email address.`, 404));

    // Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    // Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/restPassword/${resetToken}`;
    const message = `Forget your password? Submit a PATCH request with your new password and password confirm to ${resetToken}.\nIf you didn't forget you password, please ignore this email`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (Only valid for 10 min)', 
            message
        })
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

const resetPassword = async(req, res, next) => {
    // Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });

    // If token has not expired, and there is user, set the new password
    if(!user) return next(new AppError('Token is invalid or has expired', 400));

    if(req.body.password.length < 8) return next(new AppError('Password must contain atleast 8 characters', 400));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Update changePasswordAt property for the user
    // Automatically done before save in userModel

    // Log the user in, send JWT
    createSendToken(user, 200, res);
}

const updatePassword = catchAsync(async (req, res, next) => {
    // Get the user from the collection
    const user = await User.findById(req.user.id).select('+password');

    // Check if password is correct
    if(!(await user.correctPassword(req.body.password, user.password))) return next(new AppError('Entered incorrect password', 401));

    // If everything is ok then update
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Login user and send JWT token
    createSendToken(user, 200, res);
})

const authController = {
    signup, login, logout, protect, isLoggedIn, restrictTo, forgetPassword, resetPassword, updatePassword
}

export default authController;
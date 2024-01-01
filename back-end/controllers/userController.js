import multer from 'multer';
import sharp from 'sharp';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import factory from './handlerFactory.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const uploadUserPhoto = upload.single('photo');

const resizeUserPhoto = (req, res, next) => {
    if(!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/users/${req.file.filename}`);
    next();
}

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

const getMe = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: req.user
    })
}

const updateMe = catchAsync(async (req, res, next) => {
    if(req.body.password || req.body.passwordConfirm)
        return next(new AppError(`This route is not for password update. Please use updateMyPassword.`, 400));
    // Filter unwanted fields to update
    const filteredBody = filterObj(req.body, 'name', 'email');
    if(req.file) filteredBody.photo = req.file.filename;
    // Update database
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: updatedUser
    })
})

const deleteMe = catchAsync(async(req, res, next) => {
    await User.findOneAndUpdate(req.user._id, {active: false});
    res.status(204).json({
        status: 'success',
        data: null
    })
});

const userController = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser, uploadUserPhoto, resizeUserPhoto, getMe, updateMe, deleteMe
}

export default userController;
import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword', authController.resetPassword);

// Protect all routers after this middleware
router.use(authController.protect);

router.get('/getme', userController.getMe);
router.patch('/updateMyPassword', authController.updatePassword);
router.post('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// Protect and Restrict all routes after this middleware
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);//.post(authController.createUser);

router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

export default router;
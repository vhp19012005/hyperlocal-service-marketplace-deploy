const express = require('express');
const authController = require('../controllers/auth.controller');
const { authCommonMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);
router.post('/sprovider/register', authController.registerProvider);
router.post('/sprovider/login',authController.loginProvider);
router.post('/logout', authCommonMiddleware, authController.logOut);
router.post('/forgotpassword', authController.handleForgotPassword);
router.post('/resetpassword',  authController.handleResetPassword);
router.post('/verifyotp',  authController.handleVerifyOtp);



module.exports = router;
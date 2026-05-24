const express = require('express');
const { uploadProviderProfile } = require('../controllers/upload.controller');
const upload = require('../middlewares/upload.middleware');
const { authSproviderMiddleware } = require('../middlewares/auth.middleware');
const providerController = require('../controllers/provider.controller');
const router = express.Router();

router.get('/me', authSproviderMiddleware, providerController.getMe);
router.patch('/me', authSproviderMiddleware, providerController.updateMe);
router.post('/availability', authSproviderMiddleware, providerController.setAvailability);

router.post(
    "/upload-profile",
    authSproviderMiddleware,
    upload.single("profileImage"),
    uploadProviderProfile
);

module.exports = router
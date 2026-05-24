const express = require('express');
const upload = require('../middlewares/upload.middleware');
const {  uploadUserProfile} = require('../controllers/upload.controller');
const { authUserMiddleware } = require('../middlewares/auth.middleware');
const {getAllProviders,getProviderById} = require('../controllers/user.controller')

const router = express.Router();


router.post(
  "/upload-profile",
  authUserMiddleware,
  upload.single("profileImage"),
  uploadUserProfile
);

router.get("/getallproviders",authUserMiddleware,getAllProviders);
router.get("/getprovider/:providerId",authUserMiddleware,getProviderById);

module.exports = router;

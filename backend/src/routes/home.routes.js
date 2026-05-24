const express = require('express');
const { authUserMiddleware,authSproviderMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/user/profile', authUserMiddleware,(req, res) => {
    res.status(200).json({message: 'Profile fetched successfully', user: req.user});
});
router.get('/sprovider/profile', authSproviderMiddleware,(req, res) => {
    res.status(200).json({message: 'Profile fetched successfully', serviceprovider: req.serviceprovider});
});


module.exports = router;
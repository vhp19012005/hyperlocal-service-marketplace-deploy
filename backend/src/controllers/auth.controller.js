const userModel = require('../models/user.model');
const providerModel = require('../models/sprovider.model');
const Otp = require('../models/otp.models')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../config/sendEmail');
const getModelByRole = require('../utils/getModelByRole');


async function registerUser(req, res) {
    const { firstName, lastName, email, password, phone, address, city, pincode, lat, long } = req.body;

    const isAlreadyExist = await userModel.findOne({ email });
    if (isAlreadyExist) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ firstName, lastName, email, password: hashedPassword, phone, address, city, pincode, lat, long });

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET);
    res.cookie('token', token);

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            lat: user.lat,
            long: user.long,
             phone: user.phone,
            address: user.address,
            city: user.city,
        }
    });
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET);
    res.cookie('token', token);

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            lat: user.lat,
            long: user.long,
            phone: user.phone,
            address: user.address,
            city: user.city,
            profileImage: user.profileImage
        }
    });
}



async function registerProvider(req, res) {
    const {
        firstName,
        lastName,
        serviceName,
        email,
        phone,
        password,
        serviceCategory,
        experience,
        address,
        city,
        pincode,
        lat,
        long,
        visitingCost
    } = req.body;

    // Check if already exists
    const exists = await providerModel.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: 'Provider already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create provider
    const provider = await providerModel.create({
        firstName,
        lastName,
        serviceName,
        email,
        phone,
        password: hashedPassword,
        serviceCategory,
        experience,
        address,
        city,
        pincode,
        lat,
        long,
        visitingCost
    });

    // JWT Token
    const token = jwt.sign({ id: provider._id, role: "provider" }, process.env.JWT_SECRET);
    res.cookie('token', token);

    // Response
    res.status(201).json({
        message: 'Service Provider registered successfully',
        provider: {
            _id: provider._id,
            firstName: provider.firstName,
            lastName: provider.lastName,
            serviceName: provider.serviceName,
            email: provider.email,
            lat: provider.lat,
            long: provider.long,
            visitingCost: provider.visitingCost
        }
    });
}

async function loginProvider(req, res) {
    const { email, password } = req.body;
    const provider = await providerModel.findOne({ email });
    if (!provider) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, provider.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: provider._id, role: "provider" }, process.env.JWT_SECRET);
    res.cookie('token', token);

    res.status(200).json({
        message: 'Service Provider logged in successfully',
        provider: {
            _id: provider._id,
            firstName: provider.firstName,
            lastName: provider.lastName,
            serviceName: provider.serviceName,
            email: provider.email,
            lat: provider.lat,
            long: provider.long
        }
    });
}

function logOut(req, res) {
    const token = req.cookies.token;
    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out successfully' });
}


async function handleForgotPassword(req, res) {
    const { email, role } = req.body;

    const Model = getModelByRole(role);
    if (!Model) {
        return res.status(400).json({ message: "Invalid role" });
    }

    const account = await Model.findOne({ email });
    if (!account) {
        return res.status(404).json({ message: "Account does not exist" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp)
    await Otp.create({ email, role, otp });

    await sendEmail(
        email,
        "Reset Password",
        `Your OTP for password reset is ${otp}`
    );

    res.status(200).json({ message: "OTP sent to email" });
}


async function handleVerifyOtp(req, res) {
    const { email, otp } = req.body;

    const otprecord = await Otp.findOne({ email, otp });
    if (!otprecord || Date.now() > otprecord.createdAt.getTime + 60 * 60 * 1000) {
        res.status(400).json({ message: "invalid or expired Otp" });
    }
    res.status(200).json({ message: "Otp Verification successful" });
}

async function handleResetPassword(req, res) {
    const { email, role, otp, newPassword } = req.body;

    console.log(email, role, otp, newPassword);
    const otprecord = await Otp.findOne({ email, role, otp });
    if (
        !otprecord ||
        Date.now() > otprecord.createdAt.getTime() + 60 * 60 * 1000
    ) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const Model = getModelByRole(role);
    if (!Model) {
        return res.status(400).json({ message: "Invalid role" });
    }

    const account = await Model.findOne({ email });
    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    account.password = await bcrypt.hash(newPassword, 10);
    await account.save();

    await Otp.deleteMany({ email, role });

    res.status(200).json({ message: "Password reset successful" });
}


module.exports = { registerUser, loginUser, registerProvider, loginProvider, logOut, handleForgotPassword, handleVerifyOtp, handleResetPassword };
const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    serviceName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    serviceCategory: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    pincode: {
        type: String,
    },
    lat: {
        type: Number,
    },
    long: {
        type: Number,
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    profileImage: {
        type: String,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    totalReviews: {
        type: Number,
        default: 0,
        min: 0
    },

    visitingCost: {
        type: Number,
    }

}, { timestamps: true });

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

module.exports = ServiceProvider;

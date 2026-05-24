const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    otp:{
        type:Number,
        required:true
    },
    role: {
      type: String,
      enum: ["user", "provider"],
      required: true,
    },
    email:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:"10m"
    }
})

const Otp = mongoose.model('otp',otpSchema);

module.exports = Otp;
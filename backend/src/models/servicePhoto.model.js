const mongoose = require("mongoose")

const servicePhotoSchema = new mongoose.Schema({
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"booking",
        required:true
    },
    photoUrl:{
        type:String,
        required:true
    }
})

const ServicePhoto = mongoose.model('servicePhoto',servicePhotoSchema);

module.exports = ServicePhoto;
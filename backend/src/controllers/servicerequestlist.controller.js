const Booking = require("../models/book.models");
const Review = require("../models/review.model");
const ServiceProvider = require("../models/sprovider.model");
const Otp = require("../models/otp.models");
const sendEmail = require('../config/sendEmail');
const sendSms = require('../config/sendSms');
const ExtraCharge = require("../models/extraCharge.model");
// GET bookings for provider dashboard
exports.getProviderBookings = async (req, res) => {
  try {
    const providerId = req.serviceprovider.id; // from auth middleware

    const bookings = await Booking.find({ provider: providerId })
      .populate("user", "firstName lastName address")
      .populate("provider", "visitingCost serviceName")
      .sort({ createdAt: -1 });

    const formattedBookings = await Promise.all(
      bookings.map(async (booking) => {

        // find review for this booking
        const review = await Review.findOne({
          provider: providerId,
          user: booking.user._id,
        });
        
      const extraCharge = await ExtraCharge.findOne({ bookingId: booking._id });
      console.log(booking._id, extraCharge)
        return {
          id: booking._id,
          customerName: `${booking.user.firstName} ${booking.user.lastName}`,
          serviceType: booking.issue,
          time: `${booking.serviceDate}, ${booking.serviceTime}`,
          status: booking.status,
          rating: review ? review.rating : 0,
          description: booking.issue,
          address: booking.address,
          price: booking.provider.visitingCost + (extraCharge ? extraCharge.amount : 0),
          extraCharges: extraCharge ? extraCharge.amount : 0,
          extraChargesReason: extraCharge ? extraCharge.reason : '',
        };
      })
    );

    res.status(200).json({
      success: true,
      bookings: formattedBookings,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


exports.getJobDetails = async (req, res) => {
  try {
    const providerId = req.serviceprovider.id; // from JWT middleware
    const bookingId = req.params.id;

    // Find booking & populate user + provider
    const booking = await Booking.findById(bookingId)
      .populate("user", "firstName lastName phone email address lat long")
      .populate("provider", "visitingCost serviceName");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Get provider review stats
    const reviews = await Review.find({ provider: providerId });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    // Count total completed jobs
    const totalJobs = await Booking.countDocuments({
      provider: providerId,
      status: "completed"
    });
   console.log(booking.user)
    // Format response
    const job = {
      id: booking._id,
      customerName: `${booking.user.firstName} ${booking.user.lastName}`,
      customerPhone: booking.user.phone,
      customerEmail: booking.user.email,
      serviceType: booking.provider.serviceName,
      description: booking.issue,
      address: booking.user.address,
      scheduledTime: `${booking.serviceDate}, ${booking.serviceTime}`,
      estimatedPrice: booking.provider.visitingCost || 0,
      rating: Number(averageRating.toFixed(1)),
      totalJobs,
      urgency: "Medium", // you can improve later with logic
      specialInstructions: "Please call before arriving.",
      paymentMethod: "Cash",
      status: booking.status,
      lat : booking.user.lat,
      long : booking.user.long,
    };

    res.status(200).json({
      success: true,
      job
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.sendOtp = async (req, res) => {

    const { id } = req.params;
    console.log("Booking ID for OTP:", id);
    const booking = await Booking.findById(id).populate("user", "email phone");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Generate OTP
     const otp = Math.floor(100000 + Math.random() * 900000);

     console.log(otp)
     const role = "user";
     const email = booking.user.email;
    await Otp.create({ email, role, otp });

     await sendEmail(
            email,
            "send otp",
            `Your OTP  is ${otp}`
        );

    // send SMS if phone exists
    try {
      const phone = booking.user.phone;
      if (phone) {
        const smsBody = `Your OTP  is ${otp}`;
        await sendSms(phone, smsBody);
      }
    } catch (smsErr) {
      console.error('Error sending SMS:', smsErr.message);
      // don't fail the request if SMS fails
    }

    res.status(200).json({
      success: true,
      message: `OTP sent to ${booking.user.email}`,
    });

};

exports.verifyOtp = async (req, res) => {
 const { otp ,jobId} = req.body;
 
const booking = await Booking.findById(jobId).populate("user", "email");

if (!booking) {
  return res.status(404).json({ success: false, message: "Booking not found" });
}

const email = booking.user.email;
    const otprecord = await Otp.findOne({ email, otp });
    if (!otprecord || Date.now() > otprecord.createdAt.getTime() + 60 * 60 * 1000) {
        return res.status(400).json({ success: false, message: "invalid or expired Otp" });
    }
    await Otp.deleteOne({ _id: otprecord._id });
    res.status(200).json({ success: true, message: "Otp Verification successful" });
};
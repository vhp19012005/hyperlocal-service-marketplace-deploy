const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const homeRoutes = require('./routes/home.routes');
const userRoutes = require('./routes/user.routes')
const providerRoutes = require('./routes/provider.routes')
const reviewRoutes = require('./routes/review.routes');
const bookingRoutes = require('./routes/booking.routes');
const serviceRequestListRoutes = require('./routes/serverrequestlist.route');
const servicePhotoRoutes = require('./routes/servicePhoto.routes');
const chatRoutes = require('./routes/chat.routes');
const adminRoutes = require('./routes/admin.routes');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL, // Adjust this to your frontend's origin
    credentials: true,
}));
console.log("Backend URL:", process.env.FRONTEND_URL);
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, "../uploads")));
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/user',userRoutes);
app.use('/api/provider',providerRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/servicerequests', serviceRequestListRoutes);
app.use('/api/servicephoto', servicePhotoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/extracharge', require('./routes/extraCharge.routes'));
app.get('/', (req, res) => {    
    res.send('Hello World!');
});

module.exports = app;
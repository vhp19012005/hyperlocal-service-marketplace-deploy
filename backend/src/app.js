const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. Trust proxy goes first for secure cookies on Render
app.set("trust proxy", 1);

// 2. Enable CORS with credentials
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Global parsers (Crucial: cookieParser must be ABOVE routes)
app.use(express.json());
app.use(cookieParser()); 

// 4. Static assets
app.use('/uploads', express.static(path.join(__dirname, "../uploads")));

// 5. Route Handlers (Now safe to process with cookies pre-parsed)
const authRoutes = require('./routes/auth.routes');
const homeRoutes = require('./routes/home.routes');
const userRoutes = require('./routes/user.routes');
const providerRoutes = require('./routes/provider.routes');
const reviewRoutes = require('./routes/review.routes');
const bookingRoutes = require('./routes/booking.routes');
const serviceRequestListRoutes = require('./routes/serverrequestlist.route');
const servicePhotoRoutes = require('./routes/servicePhoto.routes');
const chatRoutes = require('./routes/chat.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/provider', providerRoutes);
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
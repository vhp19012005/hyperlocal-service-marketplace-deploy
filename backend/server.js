// 1. ALWAYS LOAD ENVIRONMENT VARIABLES FIRST
require('dotenv').config();

// 2. NOW LOAD YOUR APP AND DATABASE
const app = require('./src/app');
const connectDB = require('./src/db');

// Connect to the database
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
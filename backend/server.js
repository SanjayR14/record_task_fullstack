// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // <--- IMPORT AUTH ROUTES
const profileRoutes = require('./routes/profileRoutes');
// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', authRoutes); // <--- USE AUTH ROUTES
app.use('/api/profiles', profileRoutes);
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`));
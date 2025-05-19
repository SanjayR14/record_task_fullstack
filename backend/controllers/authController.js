// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Though password matching is on the model, we might need it here if we weren't using model methods
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Validate input (basic)
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        // More specific email validation is on the model, but good to have basic checks
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // 2. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 3. Create new user (password will be hashed by the pre-save hook in User.js)
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            // 4. Generate token and send response
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                message: 'User registered successfully'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        // Handle Mongoose validation errors (e.g., if email format is wrong from model schema)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error during registration' });
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // 2. Check if user exists and retrieve password (since it's select: false by default)
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            // 3. Passwords match, generate token and send response
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                message: 'Login successful'
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' }); // 401 Unauthorized
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during login' });
    }
};

// @desc    Get user profile (Example of a protected route, not strictly needed for dashboard per task but good to have)
// @route   GET /api/auth/me
// @access  Private (requires token)
// We'll add middleware for this later if needed for other features
const getMe = async (req, res) => {
    // This assumes we'll have middleware that adds `req.user`
    // For now, let's just return a placeholder or skip implementing if not required.
    // For the current task, the dashboard is static, so a "getMe" endpoint isn't directly used by the frontend
    // to populate dynamic user data on the dashboard itself.
    // However, the login endpoint already returns user data.
    res.json({ message: "This would be a protected route to get user details." });
};


module.exports = {
    registerUser,
    loginUser,
    getMe, // Exporting it even if not fully used for now
};
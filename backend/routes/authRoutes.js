// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware'); // We'll add this later if we make /me a protected route

router.post('/register', registerUser);
router.post('/login', loginUser);
// router.get('/me', protect, getMe); // Example of how a protected route would look

module.exports = router;
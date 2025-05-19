// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { getProfiles, createProfile, getProfileById } = require('../controllers/profileController');
// const { protect } = require('../middleware/authMiddleware'); // You would add this if routes need to be protected

// For now, assuming these are accessible after login, but no explicit token check here yet
// If you want to protect these routes, uncomment and implement 'protect' middleware
router.route('/')
    .get(getProfiles)       // GET /api/profiles?role=developer&skills=React,Node&location=Remote
    .post(createProfile);   // POST /api/profiles (for seeding/admin)

router.route('/:id')
    .get(getProfileById);   // GET /api/profiles/someProfileId

module.exports = router;
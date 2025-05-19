// backend/controllers/profileController.js
const Profile = require('../models/Profile');

// @desc    Get all profiles with optional filtering/searching
// @route   GET /api/profiles
// @access  Private (or Public, depending on requirements for viewing profiles)
// For now, let's assume it's accessible after login, so technically private.
// No explicit auth middleware added here yet, but could be.
const getProfiles = async (req, res) => {
    try {
        const { role, skills, location } = req.query; // Get filter params from query string

        let query = {};

        if (role) {
            // Case-insensitive partial match for role
            query.role = { $regex: role, $options: 'i' };
        }
        if (location) {
            // Case-insensitive partial match for location
            query.location = { $regex: location, $options: 'i' };
        }
        if (skills) {
            // Skills might be a comma-separated string, e.g., "Google Ads,React"
            const skillsArray = skills.split(',').map(skill => skill.trim());
            // Find profiles that have ALL the specified skills
            // For partial match on skill names, you might need a more complex query or text index
            query['skills.name'] = { $all: skillsArray.map(skill => new RegExp(skill, 'i')) };
            // If you want to match ANY of the skills:
            // query['skills.name'] = { $in: skillsArray.map(skill => new RegExp(skill, 'i')) };
        }

        // Add more filters as needed (e.g., employmentType, isVerified)

        // console.log("Constructed Query:", query); // For debugging

        const profiles = await Profile.find(query).sort({ createdAt: -1 }); // Sort by newest first

        if (!profiles || profiles.length === 0) {
            // Return empty array if no profiles match, not an error
            return res.status(200).json([]);
        }

        res.status(200).json(profiles);

    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ message: 'Server Error fetching profiles' });
    }
};


// @desc    Create a new profile (for seeding/admin purposes for now)
// @route   POST /api/profiles
// @access  Private (should be admin only in a real app)
const createProfile = async (req, res) => {
    try {
        // Basic validation, can be expanded
        const { name, role, location, description, skills, avatarInitial, employmentType, isVerified } = req.body;
        if (!name || !role || !location || !description) {
            return res.status(400).json({ message: 'Name, role, location, and description are required' });
        }

        const newProfile = new Profile({
            name,
            role,
            location,
            description,
            skills: skills || [], // Ensure skills is an array
            avatarInitial,
            employmentType,
            isVerified
        });

        const savedProfile = await newProfile.save();
        res.status(201).json(savedProfile);

    } catch (error) {
        console.error('Error creating profile:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error creating profile' });
    }
};

// @desc    Get a single profile by ID (if needed for a detail view)
// @route   GET /api/profiles/:id
// @access  Private
const getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile by ID:', error);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    getProfiles,
    createProfile,
    getProfileById
};
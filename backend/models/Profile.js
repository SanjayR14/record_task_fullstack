// backend/models/Profile.js
const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    score: { // As seen in the design (e.g., Google Ads (4))
        type: Number,
        required: false, // Making it optional as not all systems might have scores
        default: 0
    }
}, {_id: false}); // _id: false for subdocuments if you don't need individual IDs for skills

const ProfileSchema = new mongoose.Schema({
    // From the card design:
    avatarInitial: { // Could also be an avatarUrl if you plan to use images
        type: String,
        default: 'P' // Default initial
    },
    name: {
        type: String,
        required: [true, 'Please add a name for the profile'],
    },
    role: {
        type: String,
        required: [true, 'Please add a role'],
    },
    location: { // Could be more structured (city, country) but string is simpler for now
        type: String,
        required: [true, 'Please add a location'],
    },
    employmentType: { // e.g., Full Time, Part Time, Contract
        type: String,
        default: 'Full Time'
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    skills: [SkillSchema], // Array of skills
    // Additional fields you might consider (optional for this task)
    // user: { // If profiles are linked to users who create/own them
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    // experienceLevel: String,
    // portfolioLink: String,
    // contactEmail: String, // If different from the account email
    isVerified: { // The "green check marks" mentioned in the design
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create indexes for fields you will search/filter by frequently
ProfileSchema.index({ role: 'text', name: 'text', description: 'text', location: 'text' }); // For text search
ProfileSchema.index({ location: 1 });
ProfileSchema.index({ 'skills.name': 1 });


module.exports = mongoose.model('Profile', ProfileSchema);
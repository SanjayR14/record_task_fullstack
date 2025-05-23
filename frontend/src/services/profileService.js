// frontend/src/services/profileService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const API_PROFILES_URL = `${API_BASE_URL}/api/profiles`;
const API_USERS_URL = `${API_BASE_URL}/api/users`; // For shortlist/hired user actions

// Helper to get token configuration
const getTokenConfig = (includeContentType = true) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: {} };

    if (userInfo && userInfo.token) {
        config.headers['Authorization'] = `Bearer ${userInfo.token}`;
    }
    if (includeContentType) {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
};


export const getProfiles = async (filters = {}) => {
    const config = getTokenConfig(false); // Get config with token, false for no Content-Type needed for GET
    config.params = filters; // Add filters as query parameters

    try {
        const { data } = await axios.get(API_PROFILES_URL, config);
        return data;
    } catch (error) {
        console.error('Error fetching profiles:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 401 && localStorage.getItem('userInfo')) {
            console.warn("Unauthorized fetching profiles. Token might be invalid. Clearing user info.");
            localStorage.removeItem('userInfo');
            // Consider a more robust way to redirect or notify user for re-login
            // Forcing a reload might work here to trigger redirect in App.jsx
            // window.location.reload();
        }
        throw error.response?.data || new Error('Failed to fetch profiles');
    }
};

export const toggleShortlist = async (profileId) => {
    try {
        const { data } = await axios.put(`${API_USERS_URL}/shortlist/${profileId}`, {}, getTokenConfig());
        return data;
    } catch (error) {
        console.error('Error toggling shortlist:', error.response ? error.response.data : error.message);
        throw error.response?.data || new Error('Failed to toggle shortlist');
    }
};

export const getShortlisted = async () => {
    try {
        const { data } = await axios.get(`${API_USERS_URL}/shortlist`, getTokenConfig(false));
        return data;
    } catch (error) {
        console.error('Error fetching shortlisted profiles:', error.response ? error.response.data : error.message);
        throw error.response?.data || new Error('Failed to fetch shortlisted profiles');
    }
};

export const markAsHiredAPI = async (profileId) => {
    try {
        const { data } = await axios.put(`${API_PROFILES_URL}/${profileId}/hire`, {}, getTokenConfig());
        return data;
    } catch (error) {
        console.error('Error marking as hired:', error.response ? error.response.data : error.message);
        throw error.response?.data || new Error('Failed to mark as hired');
    }
};

export const getHiredProfiles = async () => {
    // This uses the getProfiles function which now includes token sending
    return getProfiles({ isHired: 'true' });
};
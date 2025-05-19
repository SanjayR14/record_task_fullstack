// frontend/src/services/profileService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/profiles'; // Your backend profiles endpoint

export const getProfiles = async (filters = {}) => {
    const config = { params: filters };
    try {
        const { data } = await axios.get(API_BASE_URL, config);
        return data;
    } catch (error) {
        console.error('Error fetching profiles:', error.response ? error.response.data : error.message);
        throw error.response?.data || new Error('Failed to fetch profiles');
    }
};

export const getUniqueSkills = async () => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/skills`);
        return data.sort() || [];
    } catch (error) {
        console.error('Error fetching unique skills:', error.response ? error.response.data : error.message);
        throw error.response?.data || new Error('Failed to fetch unique skills');
    }
};

export const getUniqueLocations = async () => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/locations`);
        return data.sort() || [];
    } catch (error) {
        console.error('Error fetching unique locations:', error.response ? error.response.data : error.message);
        throw error.response?.data || new Error('Failed to fetch unique locations');
    }
};
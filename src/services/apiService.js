// src/services/apiService.js
import axiosInstance from './axiosInstance';

export const loginUser = async (credentials) => {
    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        return response.data; // Return user data
    } catch (error) {
        throw error.response?.data; // Throw the error response
    }
};

export const fetchHotels = async () => {
    try {
        const response = await axiosInstance.get('/hotels');
        return response.data; // Return hotel data
    } catch (error) {
        throw error.response?.data; // Throw the error response
    }
};

// Add more API calls as needed

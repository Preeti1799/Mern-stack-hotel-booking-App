// src/services/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8800/api", // Adjust the base URL as necessary
    withCredentials: true, // Allow sending cookies with requests
});

// Intercept requests to add the Authorization header if needed
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token"); // Adjust based on your token storage method
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;

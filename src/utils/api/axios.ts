// api/axios.ts
import axios from 'axios';
import { firebaseAuth } from '../../firebase/firebase'; // adjust path as needed

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const API = axios.create({
    baseURL: API_URL,
});

// 🔐 Request Interceptor: attach latest token from localStorage (fallback)
API.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 🔁 Response Interceptor: retry once if token is expired
API.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            firebaseAuth.currentUser
        ) {
            originalRequest._retry = true; // prevent infinite loop
            try {
                const newToken = await firebaseAuth.currentUser.getIdToken(true); // force refresh
                localStorage.setItem('token', newToken); // update token in storage

                // Set token for this retry + future requests
                API.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                return API(originalRequest); // retry original request
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
            }
        }

        return Promise.reject(error); // all other errors
    }
);

// api.ts
import axios from 'axios';
import { User, Patient, Appointment } from '../types';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from '../firebase/firebase';

const API_URL = 'https://dental-backend-y8kz.onrender.com/api'; // Replace with your actual API URL
const API = axios.create({
    baseURL: 'https://dental-backend-y8kz.onrender.com/api', // update if deployed
});

// Add an interceptor to set the token in the headers
API.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Set the token in the Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error); // Handle errors
    }
);

export const saveAppointmentsToAPI = async (appointments: Appointment[]) => {
    const response = await fetch(`${API_URL}/appointments`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointments),
    });
    if (!response.ok) throw new Error('Failed to save appointments');
};

export const loginUserFromAPI = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('token', token); // Store the token in local storage
        // Set the token in the Authorization header for the custom Axios instance
        const response = await API.post('/auth/login', {
            token
        });
        return response; // Returning the response for further use
    } catch (error: any) {
        throw error; // Pass the error to be handled by the caller
    }
};

// Register user function
export const registerUser = async (email: string, password: string, role: string) => {
    try {

        const response = await API.post('/auth/register', {
            email,
            password,
            role,
        });
        return response; // Returning the response for further use
    } catch (error: any) {
        throw error; // Pass the error to be handled by the caller
    }
};

// Patient operations - replace with API
export const getPatientsFromAPI = async () => {
    try {
        const response = await API.get('/patients');
        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        return []; // return empty array in case of an error
    }
};

export const updatePatientFromAPI = async (id: string, patientData: Partial<Patient>) => {
    try {
        const response = await API.put(`/patients/${id}`, patientData);
        debugger;
        return response.data; // Return the updated patient data
    } catch (error) {
        console.error('Error fetching patients:', error);
        return []; // return empty array in case of an error
    }
};

export const savePatient = async (patient: Patient) => {
    try {
        const response = await API.post('/patients', patient);
        return response;
    } catch (error) {
        throw error; // Pass the error to be handled by the caller
    }
};

export const deletePatientFromAPI = async (id: string) => {
    try {
        const response = await API.delete(`/patients/${id}`);
        const deletePatient = response.data; // Assuming the API returns the deleted patient data
        return deletePatient; // Return the response data
    } catch (error) {
        console.error('Error deleting patient:', error);
        throw error; // Pass the error to be handled by the caller
    }
};  

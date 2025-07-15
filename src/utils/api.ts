// api.ts
import axios, { AxiosResponse } from 'axios';
import { User, Patient, Appointment } from '../types';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from '../firebase/firebase';

// const API_URL = "https://dental-backend-1.onrender.com/api";

// const API_URL = "http://localhost:5001/api"; // Use your actual API URL here
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api'; // Use environment variable or fallback to local development

export const API = axios.create({
    baseURL: API_URL,
});

// Automatically attach the Firebase ID token from localStorage
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface RegisterPayload {
    firstName: string
    lastName: string
    role: string
}


// Auth endpoints

export const registerAPI = (data: RegisterPayload): Promise<AxiosResponse> => {
    return API.post('/auth/register', data)
}

// Fetch the “me” endpoint (your DB profile)
export const fetchMeAPI = (): Promise<AxiosResponse> => {
    return API.get('/users/me')
}

// Patient operations - replace with API
export const getPatientsFromAPI = async (startIdx: number, endIdx: number, searchTerm: string, sort: string) => {
    try {
        const response = await API.get('/patients', {
            params: {
                startIdx,
                endIdx,
                searchTerm,
                sort
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        return []; // return empty array in case of an error
    }
};

export const getPatientNamesFromAPI = async (): Promise<Patient[]> => {
    try {
        const response = await API.get('/patients/names');
        return response.data;
    } catch (error) {
        console.error('Error fetching patient names:', error);
        return []; // return empty array in case of an error
    }
};

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



export const updatePatientFromAPI = async (id: string, patientData: Partial<Patient>) => {
    try {
        const response = await API.put(`/patients/${id}`, patientData);
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

export const getAppointmentsFromApi = async (startIdx: number, endIdx: number, searchTerm: string, sort: string) => {
    try {
        const response = await API.get('/appointments', {
            params: {
                startIdx,
                endIdx,
                searchTerm,
                sort
            }
        });
        return response.data; // Return the appointments data
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error; // Pass the error to be handled by the caller  
    }
}

export const addAppointmentFromAPI = async (appointment: Appointment) => {
    try {
        console.log('Adding appointment:', appointment);
        const response = await API.post('/appointments', appointment);
        return response.data; // Return the added appointment data
    } catch (error) {
        console.error('Error adding appointment:', error);
        throw error; // Pass the error to be handled by the caller
    }
}

export const updateAppointmentFromAPI = async (id: string, appointmentData: Appointment) => {
    try {
        const response = await API.put(`/appointments/${id}`, appointmentData);
        return response.data; // Return the updated appointment data
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error; // Pass the error to be handled by the caller
    }
}


export const deleteAppointmentFromAPI = async (id: string) => {
    try {
        const response = await API.delete(`/appointments/${id}`);
        return response.data; // Return the deleted appointment data
    } catch (error) {
        console.error('Error deleting appointment:', error);
        throw error; // Pass the error to be handled by the caller
    }
};  
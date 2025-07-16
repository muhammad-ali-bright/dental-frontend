// api/auth.ts
import { AxiosResponse } from 'axios';
import { firebaseAuth } from '../../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { API } from './axios';
import { User, Role } from '../../types';

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    role: Role;
}

export const registerAPI = (data: RegisterPayload): Promise<AxiosResponse> =>
    API.post('/auth/register', data);

export const fetchMeAPI = (): Promise<AxiosResponse<User>> =>
    API.get('/users/me');

export const loginUserFromAPI = async (
    email: string,
    password: string
): Promise<AxiosResponse> => {
    const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const token = await userCred.user.getIdToken();
    localStorage.setItem('token', token);
    return API.post('/auth/login', { token });
};

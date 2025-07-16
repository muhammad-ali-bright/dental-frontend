// api/patients.ts
import { Patient } from '../../types';
import { API } from './axios';

interface GetPatientsResponse {
    patients: Patient[];
    totalCount: number;
}

export const getPatientsFromAPI = async (
    startIdx: number,
    endIdx: number,
    searchTerm: string,
    sort: string
): Promise<GetPatientsResponse> => {
    const { data } = await API.get<GetPatientsResponse>('/patients', {
        params: { startIdx, endIdx, searchTerm, sort },
    });
    return data;
};

export const getPatientNamesFromAPI = async (): Promise<Pick<Patient, 'id' | 'name'>[]> => {
    const { data } = await API.get<Pick<Patient, 'id' | 'name'>[]>('/patients/names');
    return data;
};

export const savePatient = async (
    patient: Omit<Patient, 'id'>
): Promise<Patient> => {
    const { data } = await API.post<Patient>('/patients', patient);
    return data;
};

export const updatePatientFromAPI = async (
    id: string,
    updates: Partial<Patient>
): Promise<Patient> => {
    const { data } = await API.put<Patient>(`/patients/${id}`, updates);
    return data;
};

export const deletePatientFromAPI = async (
    id: string
): Promise<{ message: string; result: any }> => {
    const { data } = await API.delete(`/patients/${id}`);
    return data;
};

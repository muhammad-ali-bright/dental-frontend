// api/appointments.ts
import { Appointment } from '../../types';
import { API } from './axios';

interface GetAppointmentsResponse {
    appointments: Appointment[];
    totalCount: number;
}


export const getAppointmentsFromAPI = async (
    startIdx: number,
    endIdx: number,
    searchTerm: string,
    sort: string
): Promise<GetAppointmentsResponse> => {
    const { data } = await API.get<GetAppointmentsResponse>('/appointments', {
        params: { startIdx, endIdx, searchTerm, sort },
    });
    return data;
};

export const getAppointmentsByDateFromAPI = async (
    startDate: Date,
    endDate: Date
): Promise<Appointment[]> => {
    const res = await API.get<Appointment[]>('/appointments/dateRange', {
        params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        },
    });
    return res.data;
};


export const addAppointmentFromAPI = async (
    appointment: Omit<Appointment, 'id'>
): Promise<Appointment> => {
    const { data } = await API.post<Appointment>('/appointments', appointment);
    return data;
};

export const updateAppointmentFromAPI = async (
    id: string,
    appointment: Partial<Appointment> & { date: string; time: string }
): Promise<Appointment> => {
    const { data } = await API.put<Appointment>(`/appointments/${id}`, appointment);
    return data;
};

export const deleteAppointmentFromAPI = async (
    id: string
): Promise<{ message: string }> => {
    const { data } = await API.delete<{ message: string }>(`/appointments/${id}`);
    return data;
};

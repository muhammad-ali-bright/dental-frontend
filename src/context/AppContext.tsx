// src/context/AppContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Patient, PatientName, Appointment, AppContextType } from '../types';
import { useAuth } from '../context/AuthContext';
import { generateId } from '../utils/storage';
import {
  getPatientsFromAPI,
  getPatientNamesFromAPI,
  savePatient,
  updatePatientFromAPI,
  deletePatientFromAPI,
  addAppointmentFromAPI,
  getAppointmentsByDateFromAPI,
  updateAppointmentFromAPI,
  getAppointmentsFromAPI,
  deleteAppointmentFromAPI,
} from '../utils/api';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientNames, setPatientNames] = useState<PatientName[]>([]);
  const [totalCountPatients, setTotalCountPatients] = useState<number>(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsForMonth, setAppointmentsForMonth] = useState<Appointment[]>([]);
  const [appointmentsForWeek, setAppointmentsForWeek] = useState<Appointment[]>([]);
  const [totalCountAppointments, setTotalCountAppointments] = useState<number>(0);

  const getPatientNames = async () => {
    const names = await getPatientNamesFromAPI();
    setPatientNames(names);
  };

  const getPatients = async (startIdx: number, endIdx: number, searchTerm: string, sort: string) => {
    const { patients, totalCount } = await getPatientsFromAPI(startIdx, endIdx, searchTerm, sort);
    setPatients(patients);
    setTotalCountPatients(totalCount);
  };

  const addPatient = async (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: generateId(),
    };
    await savePatient(newPatient);
    await getPatientNames();
  };

  const updatePatient = async (id: string, patientData: Partial<Patient>) => {
    await updatePatientFromAPI(id, patientData);
    await getPatientNames();
  };

  const deletePatient = async (id: string): Promise<boolean> => {
    try {
      await deletePatientFromAPI(id);
      await getPatientNames();
      return true;
    } catch (error) {
      return false;
    }
  };

  const getAppointments = async (startIdx: number, endIdx: number, searchTerm: string, sort: string) => {
    const { appointments, totalCount } = await getAppointmentsFromAPI(startIdx, endIdx, searchTerm, sort);
    setAppointments(appointments);
    setTotalCountAppointments(totalCount);
  };

  const getAppointmentsForMonth = async (startDate: Date, endDate: Date) => {
    const appointments = await getAppointmentsByDateFromAPI(startDate, endDate);
    setAppointmentsForMonth(appointments); // ✅ Now this matches Appointment[]
  };

  const getAppointmentsForWeek = async (start: Date, end: Date) => {
    const appointments = await getAppointmentsByDateFromAPI(start, end);
    setAppointmentsForWeek(appointments);
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    await addAppointmentFromAPI(appointmentData);
  };

  const updateAppointment = async (
    id: string,
    appointmentData: Partial<Appointment> & { date: string; time: string }
  ) => {
    await updateAppointmentFromAPI(id, appointmentData);
  };

  const deleteAppointment = async (id: string) => {
    await deleteAppointmentFromAPI(id);
  };

  const value: AppContextType = {
    patients,
    patientNames,
    totalCountPatients,
    getPatientNames,
    getPatients,
    appointments,
    appointmentsForMonth,
    appointmentsForWeek,
    getAppointmentsForMonth,
    getAppointmentsForWeek,
    addPatient,
    updatePatient,
    deletePatient,
    totalCountAppointments,
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
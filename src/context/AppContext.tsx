import React, { createContext, useContext, useEffect, useState } from 'react';
import { Patient, PatientName, Appointment, AppContextType } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  // getAppointments,
  saveAppointments,
  generateId,
  initializeStorage
} from '../utils/storage';

import { getPatientsFromAPI, getPatientNamesFromAPI, savePatient, updatePatientFromAPI, deletePatientFromAPI, addAppointmentFromAPI, updateAppointmentFromAPI, getAppointmentsFromApi, deleteAppointmentFromAPI } from "../utils/api";

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
  const [totalCountAppointments, setTotalCountAppointments] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const patientNames = await getPatientNamesFromAPI();
      setPatientNames(patientNames);

      // initializeStorage();
      // setAppointments(getAppointments());
    };
    fetchData();
  }, []);

  const getPatients = async (startIdx: number, endIdx: number, searchTerm: string, sort: string) => {
    const { patients, totalCount } = await getPatientsFromAPI(startIdx, endIdx, searchTerm, sort);
    setPatients(patients);
    setTotalCountPatients(totalCount);
  };

  const addPatient = async (patientData: Omit<Patient, 'id'>) => {
    let newPatient: Patient = {
      ...patientData,
      id: generateId()
    };

    await savePatient(newPatient);
  };

  const updatePatient = async (id: string, patientData: Partial<Patient>) => {
    await updatePatientFromAPI(id, patientData);
  };

  const deletePatient = async (id: string): Promise<Boolean> => {
    try {
      await deletePatientFromAPI(id);
      return true;
    } catch (error) {
      return false; // Handle error appropriately
    }
  };

  const getAppointments = async (startIdx: number, endIdx: number, searchTerm: string, sort: string) => {
    const { appointments, totalCount } = await getAppointmentsFromApi(startIdx, endIdx, searchTerm, sort);
    setAppointments(appointments);
    setTotalCountAppointments(totalCount);
  }

  const addAppointment = async (appointmentData: Appointment) => {
    const newAppointment = appointmentData;
    await addAppointmentFromAPI(newAppointment);
  };

  const updateAppointment = async (id: string, appointmentData: Appointment) => {
    await updateAppointmentFromAPI(id, appointmentData)
  };

  const deleteAppointment = async (id: string) => {
    await deleteAppointmentFromAPI(id);
  };

  const value: AppContextType = {
    patients,
    patientNames,
    totalCountPatients,
    getPatients,
    appointments,
    addPatient,
    updatePatient,
    deletePatient,
    totalCountAppointments,
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

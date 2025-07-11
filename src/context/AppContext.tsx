import React, { createContext, useContext, useEffect, useState } from 'react';
import { Patient, Appointment, AppContextType } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  getPatients,
  savePatients,
  getAppointments,
  saveAppointments,
  generateId,
  initializeStorage
} from '../utils/storage';

import { getPatientsFromAPI, savePatient, updatePatientFromAPI, deletePatientFromAPI } from "../utils/api";

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
      const fetchData = async () => {
        const patients = await getPatientsFromAPI();
        initializeStorage();
        setPatients(patients);
        setAppointments(getAppointments());
      };
      fetchData();
  }, []);


  const addPatient = async (patientData: Omit<Patient, 'id'>) => {
    let newPatient: Patient = {
      ...patientData,
      id: generateId()
    };

    const response = await savePatient(newPatient);
    const updatedPatients = [...patients, response.data];
    setPatients(updatedPatients);
  };

  const updatePatient = async (id: string, patientData: Partial<Patient>) => {
    const updatePatient = await updatePatientFromAPI(id, patientData);
    const updatedPatients = patients.map(patient =>
      patient.id === id ? { ...patient, ...updatePatient } : patient
    );
    setPatients(updatedPatients);
  };

  const deletePatient = async (id: string): Promise<Boolean> => {
    try {
      await deletePatientFromAPI(id);
      const updatedPatients = patients.filter(patient => patient.id !== id);
      setPatients(updatedPatients);
      return true;
    } catch (error) {
      return false; // Handle error appropriately
    }
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: generateId()
    };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
  };

  const updateAppointment = (id: string, appointmentData: Partial<Appointment>) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, ...appointmentData } : appointment
    );
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
  };

  const deleteAppointment = (id: string) => {
    const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
  };

  const value: AppContextType = {
    patients,
    appointments,
    addPatient,
    updatePatient,
    deletePatient,
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

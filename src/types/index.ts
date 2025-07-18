export type Role = 'Student' | 'Professor';

export interface User {
  id: string;
  role: Role;
  email: string;
  firstName?: string;
  lastName?: string;
  patientId?: string;
}

export interface Patient {
  id: string;
  name: string;
  contact: string;
  notes: string;
  email?: string;
}

export interface PatientName {
  id: string;
  name: string;
}

export interface FileAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  title: string;
  description: string;
  date: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: Role
  ) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface AppContextType {
  patients: Patient[];
  patientNames: PatientName[];
  totalCountPatients: number;
  getPatientNames: () => void;
  getPatients: (
    startIdx: number,
    endIdx: number,
    searchTerm: string,
    sort: string
  ) => void;

  appointments: Appointment[];
  appointmentsForMonth: Appointment[];
  appointmentsForWeek: Appointment[];
  totalCountAppointments: number;

  getAppointments: (
    startIdx: number,
    endIdx: number,
    searchTerm: string,
    sort: string
  ) => void;

  getAppointmentsForCalendarRange: (start: Date, end: Date) => Promise<Appointment[]>;
  getAppointmentsForMonth: (startDate: Date, endDate: Date) => void;
  getAppointmentsForWeek: (startDate: Date, endDate: Date) => void;

  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => boolean | Promise<boolean>;

  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (
    id: string,
    appointment: Partial<Appointment> & { date: string; time: string }
  ) => void;
  deleteAppointment: (id: string) => void;
}

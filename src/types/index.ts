export interface User {
  id: string;
  role: string;
  email: string;
  firstName?: string;
  lastName?: string;
  patientId?: string;
}

export interface Patient {
  id: string;
  name: string;
  // dob: string;
  contact: string;
  notes: string;
  email?: string;
}

export interface PatientName {
  id: string;
  name: string
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
  // comments: string;
  appointmentDate: string;
  // cost?: number;
  // treatment?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  // nextDate?: string;
  // files: FileAttachment[];
}

export interface AuthContextType {
  user: User | null

  // we don’t inspect the UserCredential on the front-end,
  // so just return void on success, throw on failure
  login: (email: string, password: string) => Promise<void>

  // we don’t need to await signOut, and it never fails in practice
  logout: () => void

  // true on success, false on any error
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string
  ) => Promise<{ success: boolean; error?: string }>

  isAuthenticated: boolean
  loading: boolean; // ← new
}

export interface AppContextType {
  patients: Patient[];
  patientNames: PatientName[];
  totalCountPatients: number;
  getPatients: (startIdx: number, endIdx: number, searchTerm: string, sort: string) => void;
  appointments: Appointment[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => Boolean | Promise<Boolean>;
  getAppointments: (startIdx: number, endIdx: number, searchTerm: string, sort: string) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  totalCountAppointments: number;
}

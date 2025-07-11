export interface User {
  id: string;
  role: string;
  email: string;
  password: string;
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
  comments: string;
  appointmentDate: string;
  cost?: number;
  treatment?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  nextDate?: string;
  files: FileAttachment[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<object>;
  logout: () => void;
  register: (email: string, password: string, role: string) => Promise<object>; // Change this to Promise<boolean>
  isAuthenticated: boolean;
}

export interface AppContextType {
  patients: Patient[];
  appointments: Appointment[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => Boolean | Promise<Boolean>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

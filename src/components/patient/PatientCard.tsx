// src/components/patient/PatientCard.tsx
import React from 'react';
import { Edit, Mail, Phone, Trash2, User, Heart } from 'lucide-react';
import { Patient, Appointment } from '../../types';

interface Props {
  patient: Patient;
  appointments: Appointment[];
  onEdit: (p: Patient) => void;
  onDelete: (id: string) => void;
}

const PatientCard: React.FC<Props> = ({ patient, appointments, onEdit, onDelete }) => {
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const completed = patientAppointments.filter(a => a.status === 'Completed').length;
  const upcoming = patientAppointments.filter(
    a => a.status === 'Scheduled' && new Date(a.date) > new Date()
  ).length;

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <User size={24} className="text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(patient)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(patient.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-2 text-sm text-gray-600">
        {patient.email && (
          <div className="flex items-center gap-2">
            <Mail size={14} />
            {patient.email}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Phone size={14} />
          {patient.contact}
        </div>
      </div>

      <div className="mb-2">
        <div className="flex gap-2 items-start">
          <Heart size={14} className="text-red-500 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{patient.notes}</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        {completed} completed · {upcoming} upcoming appointments
      </div>
    </div>
  );
};

export default PatientCard;

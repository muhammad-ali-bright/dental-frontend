// src/pages/Appointments.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Plus, Search, Edit, Trash2,
  Calendar as CalendarIcon,
  Clock as ClockIcon, User,
  Play, CheckCircle, XCircle, X as CloseIcon
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import Pagination from '../components/Pagination';
import { Appointment } from '../types';
import { statusColorClasses } from '../utils/status';
import AppointmentCard from '../components/appointment/AppointmentCard';
import AppointmentModal from '../components/appointment/AppointmentModal';

const statusOrder: Appointment['status'][] = [
  'Scheduled',
  'In Progress',
  'Completed',
  'Cancelled',
];

const Appointments: React.FC = () => {
  const {
    patientNames,
    appointments,
    totalCountAppointments,
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getPatientNames,
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();
  const { editId } = (location.state ?? {}) as { editId?: string };

  const appointmentsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    patientId: '',
    title: '',
    description: '',
    appointmentDate: '',
    status: 'Scheduled' as Appointment['status'],
  });

  const startIdx = (currentPage - 1) * appointmentsPerPage;
  const endIdx = startIdx + appointmentsPerPage;

  // ── Effects ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      await getAppointments(startIdx, endIdx, searchTerm, '');
      setLoading(false);
    };
    fetchAppointments();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    getPatientNames();
  }, []);

  useEffect(() => {
    if (editId) {
      const appt = appointments.find(a => a.id === editId);
      if (appt) handleEdit(appt);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [editId, appointments]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      time: new Date(formData.appointmentDate).toISOString(),
    };
    if (editingAppointment) {
      await updateAppointment(editingAppointment.id, payload);
    } else {
      await addAppointment(payload);
    }
    getAppointments(startIdx, endIdx, searchTerm, '');
    resetForm();
  };

  const handleEdit = (appt: Appointment) => {
    setEditingAppointment(appt);
    setFormData({
      id: appt.id,
      patientId: appt.patientId,
      title: appt.title,
      description: appt.description,
      appointmentDate: appt.appointmentDate.slice(0, 16),
      status: appt.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      await deleteAppointment(id);
      getAppointments(startIdx, endIdx, searchTerm, '');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      patientId: '',
      title: '',
      description: '',
      appointmentDate: '',
      status: 'Scheduled',
    });
    setEditingAppointment(null);
    setShowModal(false);
  };

  const handleStatusClick = (appt: Appointment) => {
    const idx = statusOrder.indexOf(appt.status);
    const next = statusOrder[(idx + 1) % statusOrder.length];
    const updated = { ...appt, status: next, time: new Date(appt.appointmentDate).toISOString() };
    updateAppointment(appt.id, updated);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage patient appointments and treatments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Appointment</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, title, or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="All">All Status</option>
            {statusOrder.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointment List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">Loading appointments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map(appt => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              patientName={patientNames.find(p => p.id === appt.patientId)?.name || 'Unknown'}
              onEdit={() => handleEdit(appt)}
              onDelete={() => handleDelete(appt.id)}
              onStatusClick={() => handleStatusClick(appt)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AppointmentModal
          formData={formData}
          setFormData={setFormData}
          patientNames={patientNames}
          statusOrder={statusOrder}
          editingAppointment={editingAppointment}
          onClose={resetForm}
          onSubmit={handleSubmit}
        />
      )}

      {/* Pagination */}
      {!loading && appointments.length > 0 && (
        <Pagination
          totalPages={Math.ceil(totalCountAppointments / appointmentsPerPage)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Appointments;

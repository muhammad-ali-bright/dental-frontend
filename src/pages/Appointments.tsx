// src/pages/Appointments.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Search,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Appointment } from '../types';
import Pagination from '../components/Pagination';
import AppointmentCard from '../components/appointment/AppointmentCard';
import AppointmentModal from '../components/appointment/AppointmentModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';

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

  // Pagination & filters
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Appointment['status']>('All');

  // Deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAppointmentId, setDeletingAppointmentId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Modal & form state
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    patientId: '',
    title: '',
    description: '',
    appointmentDate: '',
    status: 'Scheduled' as Appointment['status'],
  });

  const perPage = 6;
  const startIdx = useMemo(() => (currentPage - 1) * perPage, [currentPage]);
  const endIdx = useMemo(() => startIdx + perPage, [startIdx]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCountAppointments / perPage)),
    [totalCountAppointments]
  );

  // Fetch patient names once
  useEffect(() => {
    getPatientNames();
  }, []);

  // Fetch appointments on pagination, search
  useEffect(() => {
    (async () => {
      setLoading(true);
      await getAppointments(startIdx, endIdx, searchTerm, '');
      setLoading(false);
    })();
  }, [startIdx, endIdx, searchTerm]);

  // Open add modal
  const openAddModal = () => {
    setEditingAppointment(null);
    setFormData({ id: '', patientId: '', title: '', description: '', appointmentDate: '', status: 'Scheduled' });
    setShowModal(true);
  };

  // Handle edit click
  const handleEdit = (appt: Appointment) => {
    setEditingAppointment(appt);
    setFormData({
      id: appt.id,
      patientId: appt.patientId,
      title: appt.title,
      description: appt.description,
      appointmentDate: appt.appointmentDate,
      status: appt.status,
    });
    setShowModal(true);
  };

  // Handle deletion prompt
  const promptDelete = (id: string) => {
    setDeletingAppointmentId(id);
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingAppointmentId) return;
    setIsDeleting(true);
    try {
      await deleteAppointment(deletingAppointmentId);
      toast.success('Appointment deleted');
      // adjust pagination
      const remaining = totalCountAppointments - 1;
      const newTotal = Math.max(1, Math.ceil(remaining / perPage));
      setCurrentPage((p) => (p > newTotal ? newTotal : p));
      await getAppointments(startIdx, endIdx, searchTerm, '');
    } catch {
      toast.error('Failed to delete appointment');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeletingAppointmentId(null);
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingAppointmentId(null);
  };

  // Handle add/update submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      patientId: formData.patientId,
      title: formData.title,
      description: formData.description,
      appointmentDate: formData.appointmentDate,
      time: formData.appointmentDate,
      status: formData.status,
    };
    try {
      if (editingAppointment) {
        await updateAppointment(formData.id, payload);
        toast.success('Appointment updated');
      } else {
        await addAppointment(payload);
        toast.success('Appointment added');
      }
      await getAppointments(startIdx, endIdx, searchTerm, '');
      setShowModal(false);
    } catch {
      toast.error('Failed to save appointment');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage patient appointments and treatments</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus size={20} />
          <span>Add Appointment</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="All">All Status</option>
          {statusOrder.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading appointments…</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500">Create a new appointment to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments
            .filter((a) => statusFilter === 'All' || a.status === statusFilter)
            .map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                patientName={
                  patientNames.find((p) => p.id === appt.patientId)?.name || 'Unknown'
                }
                onEdit={() => handleEdit(appt)}
                onDelete={() => promptDelete(appt.id)}
                onStatusClick={() => {/* status change handler */ }}
              />
            ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && appointments.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Confirm Deletion */}
      {showDeleteConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this appointment? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isLoading={isDeleting}
        />
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <AppointmentModal
          formData={formData}
          setFormData={setFormData}
          patientNames={patientNames}
          statusOrder={statusOrder}
          editingAppointment={editingAppointment}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Appointments;

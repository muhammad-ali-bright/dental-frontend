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

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Appointment['status']>('All');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAppointmentId, setDeletingAppointmentId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const perPage = 6;
  const startIdx = useMemo(() => (currentPage - 1) * perPage, [currentPage]);
  const endIdx = useMemo(() => startIdx + perPage, [startIdx]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCountAppointments / perPage)),
    [totalCountAppointments]
  );

  // Show confirm dialog
  const promptDelete = (id: string) => {
    setDeletingAppointmentId(id);
    setShowDeleteConfirm(true);
  };

  // User confirms deletion
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

  // Initial load
  useEffect(() => {
    getPatientNames();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getAppointments(startIdx, endIdx, searchTerm, '');
      setLoading(false);
    })();
  }, [startIdx, endIdx, searchTerm]);

  // Placeholder: handlers for add/edit/status would go here
  const handleEdit = (appt: Appointment) => { /* … */ };
  const handleStatusClick = (appt: Appointment) => { /* … */ };

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
          onClick={() => {/* open add modal */}}
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
                onStatusClick={() => handleStatusClick(appt)}
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
    </div>
  );
};

export default Appointments;

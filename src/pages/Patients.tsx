// src/pages/Patients.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Patient } from '../types';
import Pagination from '../components/Pagination';
import PatientCard from '../components/patient/PatientCard';
import PatientModal from '../components/patient/PatientModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const Patients: React.FC = () => {
  const {
    patients,
    getPatients,
    totalCountPatients,
    appointments,
    addPatient,
    updatePatient,
    deletePatient,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({ name: '', contact: '', notes: '', email: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const patientsPerPage = 6;
  const sort = 'date';
  const startIdx = useMemo(() => (currentPage - 1) * patientsPerPage, [currentPage]);
  const endIdx = useMemo(() => startIdx + patientsPerPage, [startIdx]);
  const totalPages = Math.max(1, Math.ceil(totalCountPatients / patientsPerPage));

  // Stage deletion
  const promptDelete = (id: string) => {
    setDeletingPatientId(id);
    setShowDeleteConfirm(true);
  };

  // Confirm and perform deletion
  const handleConfirmDelete = async () => {
    if (!deletingPatientId) return;
    setIsDeleting(true);
    try {
      await deletePatient(deletingPatientId);
      toast.success('Patient deleted');
      // adjust pagination
      const remaining = totalCountPatients - 1;
      const newTotal = Math.max(1, Math.ceil(remaining / patientsPerPage));
      setCurrentPage(p => (p > newTotal ? newTotal : p));
      await getPatients(startIdx, endIdx, searchTerm, sort);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeletingPatientId(null);
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingPatientId(null);
  };

  // Load patients
  useEffect(() => {
    (async () => {
      setLoading(true);
      await getPatients(startIdx, endIdx, searchTerm, sort);
      setLoading(false);
    })();
  }, [startIdx, endIdx, searchTerm]);

  // Add / update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, formData);
        toast.success('Patient updated');
      } else {
        await addPatient(formData);
        toast.success('Patient added');
      }
      await getPatients(startIdx, endIdx, searchTerm, sort);
      resetForm();
    } catch {
      toast.error('Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (p: Patient) => {
    setEditingPatient(p);
    setFormData({
      name: p.name,
      contact: p.contact,
      notes: p.notes,
      email: p.email ?? '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', contact: '', notes: '', email: '' });
    setEditingPatient(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage your patient records</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus size={20} />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">Loading patients...</div>
      ) : patients.length === 0 ? (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'Add your first patient to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map(p => (
            <PatientCard
              key={p.id}
              patient={p}
              appointments={appointments}
              onEdit={handleEdit}
              onDelete={promptDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && patients.length > 0 && (
        <div className="mt-6">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <PatientModal
          formData={formData}
          setFormData={setFormData}
          editingPatient={editingPatient}
          onClose={resetForm}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this patient? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default Patients;

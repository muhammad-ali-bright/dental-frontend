// src/pages/Patients.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Patient } from '../types'; // make sure you have this import
import Pagination from '../components/Pagination';
import PatientCard from '../components/patient/PatientCard';
import PatientModal from '../components/patient/PatientModal';

const Patients: React.FC = () => {
  const {
    patients,
    getPatients,
    totalCountPatients,
    appointments,
    addPatient,
    updatePatient,
    deletePatient
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({ name: '', contact: '', notes: '', email: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const patientsPerPage = 6;
  const sort = 'date';
  const startIdx = useMemo(() => (currentPage - 1) * patientsPerPage, [currentPage]);
  const endIdx = useMemo(() => startIdx + patientsPerPage, [startIdx]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCountPatients / patientsPerPage)),
    [totalCountPatients]
  );

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      await getPatients(startIdx, endIdx, searchTerm, sort);
      setLoading(false);
    };
    fetchPatients();
  }, [startIdx, endIdx, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, formData);
        toast.success('Patient updated successfully');
      } else {
        await addPatient(formData);
        toast.success('Patient added successfully');
      }
      await getPatients(startIdx, endIdx, searchTerm, sort);
      resetForm();
    } catch (error) {
      toast.error('Failed to save patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (patient: any) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      contact: patient.contact,
      notes: patient.notes,
      email: patient.email ?? ''
    });
    setShowModal(true);
  };

  const handleDelete = async (patientId: string) => {
    const hasAppointments = appointments.some(appt => appt.patientId === patientId);
    const confirmMessage = hasAppointments
      ? 'This patient has appointments. Are you sure? All associated appointments will be deleted.'
      : 'Are you sure you want to delete this patient?';

    if (!window.confirm(confirmMessage)) return;

    try {
      const success = await deletePatient(patientId);
      const remainingPatients = totalCountPatients - 1;
      const newTotalPages = Math.max(1, Math.ceil(remainingPatients / patientsPerPage));
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      } else {
        await getPatients(startIdx, endIdx, searchTerm, sort);
      }
      toast.success(success
        ? hasAppointments ? 'Patient and appointments deleted' : 'Patient deleted'
        : 'Failed to delete patient');
    } catch {
      toast.error('Error deleting patient');
    }
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Patient Cards */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">Loading patients...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              appointments={appointments}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {!loading && patients.length === 0 && (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'Add your first patient to get started'}
          </p>
        </div>
      )}

      {!loading && (
        <div className="mt-6">
          <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <PatientModal
          formData={formData}
          setFormData={setFormData}
          editingPatient={editingPatient}
          isSubmitting={isSubmitting}
          onClose={resetForm}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Patients;

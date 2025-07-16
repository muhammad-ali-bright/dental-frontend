// Patients.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus, Search, Edit, Trash2, User, Phone, Mail, Heart, X
} from 'lucide-react';
import { Patient } from '../types';
import { Toaster, toast } from 'react-hot-toast';
import Pagination from '../components/Pagination';

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
  const patientsPerPage = 6;
  const sort = 'date';

  const startIdx = useMemo(() => (currentPage - 1) * patientsPerPage, [currentPage]);
  const endIdx = useMemo(() => startIdx + patientsPerPage, [startIdx]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCountPatients / patientsPerPage)),
    [totalCountPatients]
  );

  useEffect(() => {
    getPatients(startIdx, endIdx, searchTerm, sort);
  }, [startIdx, endIdx, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, formData);
      } else {
        await addPatient(formData);
      }
      await getPatients(startIdx, endIdx, searchTerm, sort);
      resetForm();
    } catch (error) {
      toast.error('Failed to save patient');
    }
  };

  const handleEdit = (patient: Patient) => {
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

      // Auto adjust pagination
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

  const getPatientStats = (patientId: string) => {
    const patientAppointments = appointments.filter(a => a.patientId === patientId);
    return {
      completed: patientAppointments.filter(a => a.status === 'Completed').length,
      upcoming: patientAppointments.filter(
        a => a.status === 'Scheduled' && new Date(a.appointmentDate) > new Date()
      ).length
    };
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => {
          const { completed, upcoming } = getPatientStats(patient.id);
          return (
            <div key={patient.id} className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <User size={24} className="text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(patient)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(patient.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-2 text-sm text-gray-600">
                {patient.email && <div className="flex items-center gap-2"><Mail size={14} />{patient.email}</div>}
                <div className="flex items-center gap-2"><Phone size={14} />{patient.contact}</div>
              </div>

              <div className="mb-2">
                <div className="flex gap-2 items-start">
                  <Heart size={14} className="text-red-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-sm text-gray-700">{patient.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {patients.length === 0 && (
        <div className="text-center py-12">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'Add your first patient to get started'}
          </p>
        </div>
      )}

      <div className="mt-6">
        <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {['name', 'contact', 'email', 'notes'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === 'name' ? 'Full Name *' :
                      field === 'contact' ? 'Contact Number *' :
                      field === 'email' ? 'Email' : 'Notes *'}
                  </label>
                  {field === 'notes' ? (
                    <textarea
                      required
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Any allergies, medications, health conditions..."
                    />
                  ) : (
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      required={field !== 'email'}
                      value={(formData as any)[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  )}
                </div>
              ))}

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  {editingPatient ? 'Update' : 'Add'} Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

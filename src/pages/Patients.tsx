import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  Heart,
  Calendar,
  X
} from 'lucide-react';
import { Patient } from '../types';
import { Toaster, toast } from 'react-hot-toast';

import Pagination from '../components/Pagination';

const Patients: React.FC = () => {
  const { patients, getPatients, totalCountPatients, appointments, addPatient, updatePatient, deletePatient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    // dob: '',
    contact: '',
    notes: '',
    email: ''
  });

  const [currentPage, setCurrentPage] = useState(1)
  const patientsPerPage = 6  // or whatever you like
  const sort = "date"

  const startIdx = (currentPage - 1) * patientsPerPage
  const endIdx = startIdx + patientsPerPage

  const totalPages = Math.ceil(totalCountPatients / patientsPerPage)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      await updatePatient(editingPatient.id, formData);
      getPatients(startIdx, endIdx, searchTerm, sort);
    } else {
      await addPatient(formData);
      getPatients(startIdx, endIdx, searchTerm, sort);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      // dob: '',
      contact: '',
      notes: '',
      email: ''
    });
    setEditingPatient(null);
    setShowModal(false);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      // dob: patient.dob,
      contact: patient.contact,
      notes: patient.notes,
      email: patient.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (patientId: string) => {
    const patientAppointments = appointments.filter(appointment => appointment.patientId === patientId);
    if (patientAppointments.length > 0) {
      if (window.confirm('This patient has appointments. Are you sure you want to delete this patient? All associated appointments will also be deleted.')) {
        const success = await deletePatient(patientId);
        await getPatients(startIdx, endIdx, searchTerm, sort);
        if (success) {
          toast.success('Patient and associated appointments deleted successfully');
        } else {
          toast.error('Failed to delete patient. Please try again.');
        }
      }
    } else {
      if (window.confirm('Are you sure you want to delete this patient?')) {
        const success = await deletePatient(patientId);
        await getPatients(startIdx, endIdx, searchTerm, sort);
        if (success) {
          toast.success('Patient deleted successfully');
        } else {
          toast.error('Failed to delete patient. Please try again.');
        }
      }
    }
  };

  const getPatientStats = (patientId: string) => {
    const patientAppointments = appointments.filter(appointment => appointment.patientId === patientId);
    const completed = patientAppointments.filter(appointment => appointment.status === 'Completed').length;
    const upcoming = patientAppointments.filter(appointment =>
      appointment.status === 'Scheduled' && new Date(appointment.appointmentDate) > new Date()
    ).length;

    return { completed, upcoming };
  };

  useEffect(() => {
    getPatients(startIdx, endIdx, searchTerm, sort);
  }, [currentPage, searchTerm]);

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
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => {
          const stats = getPatientStats(patient.id);
          return (
            <div key={patient.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    {/* <p className="text-sm text-gray-500">
                      Age: {new Date().getFullYear() - new Date(patient.dob).getFullYear()}
                    </p> */}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(patient)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-2">
                {patient.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail size={14} />
                    <span>{patient.email}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone size={14} />
                  <span>{patient.contact}</span>
                </div>
                {/* <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>DOB: {format(new Date(patient.dob), 'MMM d, yyyy')}</span>
                </div> */}
              </div>

              {/* Health Info */}
              <div className="mb-2">
                <div className="flex items-start space-x-2">
                  <Heart size={14} className="text-red-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Notes</p>
                    <p className="text-sm text-gray-700">{patient.notes}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              {/* <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{stats.completed}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{stats.upcoming}</p>
                    <p className="text-xs text-gray-500">Upcoming</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">${stats.totalSpent}</p>
                    <p className="text-xs text-gray-500">Total Spent</p>
                  </div>
                </div>
              </div> */}
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

      {/* Add/Edit Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any allergies, medications, health conditions..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingPatient ? 'Update' : 'Add'} Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>

  );
};

export default Patients;

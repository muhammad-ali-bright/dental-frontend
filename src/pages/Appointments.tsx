import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { statusColorClasses } from '../utils/status';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  User,
  Play,
  CheckCircle,
  XCircle,
  X as CloseIcon
} from 'lucide-react';
import { Appointment } from '../types';
import { format } from 'date-fns';

import Pagination from '../components/Pagination'; // Make sure this exists

const Appointments: React.FC = () => {
  const { patientNames, appointments, totalCountAppointments, getAppointments, addAppointment, updateAppointment, deleteAppointment, getPatientNames } = useApp();
  const location = useLocation();
  const { editId } = (location.state ?? {}) as { editId?: string };
  const navigate = useNavigate();

  const appointmentsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const sort = "" //temporary

  const startIdx = (currentPage - 1) * appointmentsPerPage;
  const endIdx = startIdx + appointmentsPerPage;


  // form + modal state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
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

  //  ── Cycle Order & Helpers ───────────────────────────────────────────────────

  const statusOrder: Appointment['status'][] = [
    'Scheduled',
    'In Progress',
    'Completed',
    'Cancelled',
  ];

  const getStatusIcon = (s: Appointment['status']) => {
    switch (s) {
      case 'Scheduled': return <CalendarIcon size={12} />;
      case 'In Progress': return <Play size={12} />;
      case 'Completed': return <CheckCircle size={12} />;
      case 'Cancelled': return <XCircle size={12} />;
      default: return null;
    }
  };

  const handleStatusClick = (appt: Appointment) => {
    const idx = statusOrder.indexOf(appt.status);
    const next = statusOrder[(idx + 1) % statusOrder.length];

    const updated = {
      id: appt.id,
      patientId: appt.patientId,
      title: appt.title,
      description: appt.description,
      appointmentDate: appt.appointmentDate,
      time: new Date(appt.appointmentDate).toISOString(), // add time
      status: next,
    };

    updateAppointment(appt.id, updated);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // ── Load editId from Dashboard if present ───────────────────────────────────
  useEffect(() => {
    if (editId) {
      const appt = appointments.find(a => a.id === editId);
      if (appt) {
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
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [editId, appointments]);

  useEffect(() => {
    getAppointments(startIdx, endIdx, searchTerm, sort);
  }, [currentPage, searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      getPatientNames();
    };
    fetchData();
  })


  // ── Filtering ───────────────────────────────────────────────────────────────
  // const filteredAppointments = appointments.filter(appt => {
  //   const patient = patientNames.find(p => p.id === appt.patientId);
  //   const matchesSearch =
  //     patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     appt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     appt.description.toLowerCase().includes(searchTerm.toLowerCase());

  //   const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
  //   return matchesSearch && matchesStatus;
  // });

  // ── Form handlers ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAppointment) {
      await updateAppointment(editingAppointment.id, {
        ...formData,
        time: new Date(formData.appointmentDate).toISOString(),
      });
      getAppointments(startIdx, endIdx, searchTerm, sort);
    } else {
      await addAppointment(formData);
      getAppointments(startIdx, endIdx, searchTerm, sort);
    }
    resetForm();
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

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment(id);
      getAppointments(startIdx, endIdx, searchTerm, sort);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map(appt => {
          const parentName = patientNames.find(p => p.id === appt.patientId);
          return (
            <div key={appt.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{appt.title}</h3>

                        {/* ← Cyclable status button */}

                        <button
                          onClick={() => handleStatusClick(appt)}
                          className={`
                            flex items-center space-x-1
                            px-3 py-1 rounded-full text-sm font-medium
                            ${statusColorClasses[appt.status]}
                            cursor-pointer hover:scale-105 transition-transform
                          `}
                        >
                          {getStatusIcon(appt.status)}
                          <span>{appt.status}</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User size={16} />
                          <span>{parentName?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon size={16} />
                          <span>{format(new Date(appt.appointmentDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon size={16} />
                          <span>{format(new Date(appt.appointmentDate), 'h:mm a')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(appt)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                  <p className="text-sm text-gray-600">{appt.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'All'
              ? 'Try adjusting your search criteria'
              : 'Add your first appointment to get started'}
          </p>
        </div>
      )} */}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <CloseIcon size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                  <select
                    required
                    value={formData.patientId}
                    onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select a patient</option>
                    {patientNames.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {statusOrder.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.appointmentDate}
                    onChange={e => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
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
                  {editingAppointment ? 'Update' : 'Add'} Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add inside the JSX */}
      {appointments.length > 0 && appointmentsPerPage && (
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

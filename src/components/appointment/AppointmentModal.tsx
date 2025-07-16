// src/components/AppointmentModal.tsx
import React, { useState } from 'react';
import { X as CloseIcon, Loader2 } from 'lucide-react';
import { parseISO, format } from 'date-fns'
import { Appointment, PatientName } from '../../types';


interface Props {
    formData: {
        id: string;
        patientId: string;
        title: string;
        description: string;
        appointmentDate: string;
        status: Appointment['status'];
    };
    setFormData: React.Dispatch<React.SetStateAction<Props['formData']>>;
    patientNames: PatientName[];
    statusOrder: Appointment['status'][];
    editingAppointment: Appointment | null;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
}


const AppointmentModal: React.FC<Props> = ({
    formData,
    setFormData,
    patientNames,
    statusOrder,
    editingAppointment,
    onClose,
    onSubmit,
}) => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent) => {
        setIsSubmitting(true);
        await onSubmit(e);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <CloseIcon size={24} />
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                            <select
                                required
                                value={formData.patientId}
                                onChange={e => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
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
                                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as Appointment['status'] }))}
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
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes *</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date & Time *</label>
                            <input
                                type="datetime-local"
                                required
                                value={
                                    formData.appointmentDate
                                        ? format(parseISO(formData.appointmentDate), "yyyy-MM-dd'T'HH:mm")
                                        : ""
                                }
                                onChange={e => setFormData(f => ({ ...f, appointmentDate: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={18} />
                                    Submitting...
                                </>
                            ) : (
                                editingAppointment ? 'Update' : 'Add Appointment'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentModal;

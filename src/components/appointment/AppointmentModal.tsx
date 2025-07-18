// src/components/AppointmentModal.tsx
import React, { useEffect, useState } from 'react';
import { X as CloseIcon, Loader2 } from 'lucide-react';
import { Appointment, PatientName } from '../../types';
import { format, addMinutes, setMinutes, setSeconds, parse } from 'date-fns';

interface Props {
    formData: {
        id: string;
        patientId: string;
        title: string;
        description: string;
        date: string;
        startTime: string;
        endTime: string;
        status: Appointment['status'];
    };
    setFormData: React.Dispatch<React.SetStateAction<Props['formData']>>;
    patientNames: PatientName[];
    statusOrder: Appointment['status'][];
    editingAppointment: Appointment | null;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const generateTimeOptions = () => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let min of [0, 30]) {
            const time = format(new Date(0, 0, 0, hour, min), 'hh:mm a');
            times.push(time);
        }
    }
    return times;
};

const roundToNext30 = (date: Date) => {
    const minutes = date.getMinutes();
    const rounded = minutes < 30 ? 30 : 0;
    const adjustedHour = minutes < 30 ? date.getHours() : date.getHours() + 1;
    return setSeconds(setMinutes(new Date(date.setHours(adjustedHour)), rounded), 0);
};

const timeOptions = generateTimeOptions();

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

    useEffect(() => {
        if (!editingAppointment) {
            const now = new Date();
            const start = roundToNext30(now);
            const end = addMinutes(start, 30);

            setFormData(prev => ({
                ...prev,
                date: format(start, 'yyyy-MM-dd'),
                startTime: format(start, 'hh:mm a'),
                endTime: format(end, 'hh:mm a'),
            }));
        }
    }, [editingAppointment, setFormData]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        setIsSubmitting(true);
        await onSubmit(e);
        setIsSubmitting(false);
    };

    const handleStartTimeChange = (newStartTime: string) => {
        const selectedDate = new Date(`${formData.date} ${newStartTime}`);
        const updatedEnd = addMinutes(selectedDate, 30);

        setFormData((f) => ({
            ...f,
            startTime: newStartTime,
            endTime: format(updatedEnd, 'hh:mm a'),
        }));
    };

    const handleEndTimeChange = (newEndTime: string) => {
        const startDate = parse(`${formData.date} ${formData.startTime}`, 'yyyy-MM-dd hh:mm a', new Date());
        const endDate = parse(`${formData.date} ${newEndTime}`, 'yyyy-MM-dd hh:mm a', new Date());

        if (endDate <= startDate) {
            alert('End time must be after start time.');
            return;
        }

        setFormData((f) => ({
            ...f,
            endTime: newEndTime
        }));
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                        <div className="flex gap-2 items-center">
                            <select
                                required
                                value={formData.startTime}
                                onChange={(e) => handleStartTimeChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">Start Time</option>
                                {timeOptions.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                            <span className="text-gray-500">–</span>
                            <select
                                required
                                value={formData.endTime}
                                onChange={(e) => handleEndTimeChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">End Time</option>
                                {timeOptions.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
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

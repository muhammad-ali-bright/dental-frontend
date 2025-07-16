// src/components/patient/PatientModal.tsx
import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Patient } from '../../types';

interface Props {
    formData: {
        name: string;
        contact: string;
        notes: string;
        email: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<Props['formData']>>;
    editingPatient: Patient | null;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const PatientModal: React.FC<Props> = ({
    formData,
    setFormData,
    editingPatient,
    isSubmitting,
    onClose,
    onSubmit,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {editingPatient ? 'Edit Patient' : 'Add New Patient'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    {['name', 'contact', 'email', 'notes'].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field === 'name' ? 'Full Name *'
                                    : field === 'contact' ? 'Contact Number *'
                                        : field === 'email' ? 'Email'
                                            : 'Notes *'}
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
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                editingPatient ? 'Update' : 'Add Patient'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientModal;
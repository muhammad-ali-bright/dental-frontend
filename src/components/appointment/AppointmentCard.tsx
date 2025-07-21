// src/components/appointment/AppointmentCard.tsx
import React from 'react';
import { Appointment } from '../../types';
import { format } from 'date-fns';
import {
    Calendar as CalendarIcon,
    Clock as ClockIcon,
    Edit,
    Trash2,
    User,
    Play,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { statusColorClasses } from '../../utils/status';
import { useAuth } from '../../context/AuthContext';

interface Props {
    appointment: Appointment;
    patientName: string;
    onEdit: () => void;
    onDelete: () => void;
    onStatusClick: () => void;
}

const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
        case 'Scheduled':
            return <CalendarIcon size={12} />;
        case 'InProgress':
            return <Play size={12} />;
        case 'Completed':
            return <CheckCircle size={12} />;
        case 'Cancelled':
            return <XCircle size={12} />;
        default:
            return null;
    }
};

const AppointmentCard: React.FC<Props> = ({
    appointment,
    patientName,
    onEdit,
    onDelete,
    onStatusClick,
}) => {
    const { user } = useAuth();
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{appointment.title}</h3>
                        {user?.role == "Student" && <button
                            onClick={onStatusClick}
                            className={`
                flex items-center space-x-1
                px-3 py-1 rounded-full text-sm font-medium
                ${statusColorClasses[appointment.status]}
                cursor-pointer hover:scale-105 transition-transform
              `}
                        >
                            {getStatusIcon(appointment.status)}
                            <span>{appointment.status}</span>
                        </button>}
                        {user?.role == "Professor" && <button
                            className={`
                flex items-center space-x-1
                px-3 py-1 rounded-full text-sm font-medium
                ${statusColorClasses[appointment.status]}
              `}
                        >
                            {getStatusIcon(appointment.status)}
                            <span>{appointment.status}</span>
                        </button>}

                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                            <User size={16} />
                            <span className="truncate max-w-[120px]">{patientName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <CalendarIcon size={16} />
                            <span>{format(new Date(appointment.date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <ClockIcon size={16} />
                            <span>{format(new Date(appointment.date), 'h:mm a')}</span>
                        </div>
                    </div>
                </div>
                {user?.role == "Student" && <div className="flex space-x-2">
                    <button
                        onClick={onEdit}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Edit appointment"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete appointment"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>}
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
            <p className="text-sm text-gray-600 whitespace-pre-line break-words">
                {appointment.description || 'No notes provided.'}
            </p>
        </div>
    );
};

export default AppointmentCard;

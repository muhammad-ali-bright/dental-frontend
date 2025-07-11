import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { format, isAfter, isBefore } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  FileText, 
  DollarSign,
  Download,
  AlertCircle
} from 'lucide-react';

const MyAppointments: React.FC = () => {
  const { user } = useAuth();
  const { patients, appointments } = useApp();

  const appointmentsData = useMemo(() => {
    if (!user?.patientId) return { upcoming: [], past: [], patient: null };

    const patient = patients.find(p => p.id === user.patientId);
    if (!patient) return { upcoming: [], past: [], patient: null };

    const patientAppointments = appointments.filter(appointment => appointment.patientId === user.patientId);
    
    const now = new Date();

    const upcoming = patientAppointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return isAfter(appointmentDate, now);
      })
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

    const past = patientAppointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return isBefore(appointmentDate, now);
      })
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

    return { upcoming, past, patient };
  }, [user, patients, appointments]);

  if (!appointmentsData.patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Patient data not found</p>
        </div>
      </div>
    );
  }

  const { upcoming, past } = appointmentsData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const downloadFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const AppointmentCard: React.FC<{ appointment: any; isPast?: boolean }> = ({ 
    appointment, 
    isPast = false 
  }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
      !isPast && appointment.status === 'Scheduled' ? 'border-l-4 border-l-blue-500' : ''
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{appointment.title}</h3>
          <p className="text-gray-600">{appointment.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>{format(new Date(appointment.appointmentDate), 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock size={16} className="mr-2" />
          <span>{format(new Date(appointment.appointmentDate), 'h:mm a')}</span>
        </div>
      </div>

      {appointment.comments && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{appointment.comments}</p>
        </div>
      )}

      {appointment.treatment && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Treatment:</p>
          <p className="text-sm text-gray-600">{appointment.treatment}</p>
        </div>
      )}

      {appointment.cost && (
        <div className="flex items-center text-green-600 mb-4">
          <DollarSign size={16} className="mr-1" />
          <span className="font-medium">${appointment.cost}</span>
        </div>
      )}

      {appointment.files && appointment.files.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
          <div className="flex flex-wrap gap-2">
            {appointment.files.map((file: any, index: number) => (
              <button
                key={index}
                onClick={() => downloadFile(file)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"
              >
                <FileText size={14} />
                <span>{file.name}</span>
                <Download size={12} />
              </button>
            ))}
          </div>
        </div>
      )}

      {appointment.nextDate && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center text-blue-600">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">
              <strong>Next appointment:</strong> {format(new Date(appointment.nextDate), 'MMMM d, yyyy h:mm a')}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600">View your appointment history and upcoming visits</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{upcoming.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Treatments</p>
              <p className="text-2xl font-bold text-gray-900">
                {past.filter(a => a.status === 'Completed').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ${past
                  .filter(a => a.cost && a.status === 'Completed')
                  .reduce((sum, a) => sum + (a.cost || 0), 0)
                }
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
        
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
            <p className="text-gray-500">You don't have any appointments scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment History</h2>
        
        {past.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointment history</h3>
            <p className="text-gray-500">Your appointment history will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {past.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} isPast={true} />
            ))}
          </div>
        )}
      </div>

      {/* Next Appointment Alert */}
      {upcoming.length > 0 && upcoming[0].status === 'Scheduled' && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="font-medium">Next Appointment</p>
              <p className="text-sm opacity-90">{upcoming[0].title}</p>
              <p className="text-sm opacity-90">
                {format(new Date(upcoming[0].appointmentDate), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;

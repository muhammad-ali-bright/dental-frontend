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
  User,
  Phone,
  Mail,
  Heart,
  Download
} from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { patients, appointments } = useApp();

  const patientData = useMemo(() => {
    if (!user?.patientId) return null;

    const patient = patients.find(p => p.id === user.patientId);
    if (!patient) return null;

    const patientAppointments = appointments.filter(appointment => appointment.patientId === user.patientId);
    
    const now = new Date();

    const upcomingAppointments = patientAppointments
      .filter(appointment => {
        const date = new Date(appointment.date);
        return isAfter(date, now);
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const pastAppointments = patientAppointments
      .filter(appointment => {
        const date = new Date(appointment.date);
        return isBefore(date, now);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const nextAppointment = upcomingAppointments[0];

    const completedTreatments = patientAppointments.filter(appointment => appointment.status === 'Completed').length;

    return {
      patient,
      patientAppointments,
      upcomingAppointments,
      pastAppointments,
      nextAppointment,
      completedTreatments
    };
  }, [user, patients, appointments]);

  if (!patientData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Patient data not found</p>
      </div>
    );
  }

  const { patient, upcomingAppointments, pastAppointments, nextAppointment, completedTreatments } = patientData;

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
  }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );

  const downloadFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={32} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {patient.name}</h1>
            <p className="text-gray-600">Here's your dental care overview</p>
          </div>
        </div>
      </div>

      {/* Patient Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">{format(new Date(patient.dob), 'MMM d, yyyy')}</p>
            </div>
          </div> */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium">{patient.contact}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{patient.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart size={16} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Health Info</p>
              <p className="font-medium text-sm">{patient.notes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          icon={Calendar}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed Treatments"
          value={completedTreatments}
          icon={CheckCircle}
          color="bg-green-500"
        />
      </div>

      {/* Next Appointment */}
      {nextAppointment && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="mr-2 text-blue-600" size={20} />
            Next Appointment
          </h3>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{nextAppointment.title}</h4>
                <p className="text-gray-600 mt-1">{nextAppointment.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {format(new Date(nextAppointment.date), 'EEEE, MMMM d, yyyy h:mm a')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                nextAppointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                nextAppointment.status === 'InProgress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {nextAppointment.status}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="mr-2" size={20} />
              Upcoming Appointments
            </h3>
          </div>
          <div className="p-6">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'InProgress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(appointment.date), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Treatment History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="mr-2" size={20} />
              Recent Treatment History
            </h3>
          </div>
          <div className="p-6">
            {pastAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No treatment history</p>
            ) : (
              <div className="space-y-4">
                {pastAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      {format(new Date(appointment.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

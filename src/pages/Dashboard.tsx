import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Activity,
  AlertCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { patients, appointments } = useApp();

  const dashboardData = useMemo(() => {
    const now = new Date();
    const nextWeek = addDays(now, 7);

    // Upcoming appointments (next 10)
    const upcomingAppointments = appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return isAfter(appointmentDate, now);
      })
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
      .slice(0, 10);

    // Today's appointments
    const todayAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const today = new Date();
      return appointmentDate.toDateString() === today.toDateString();
    });

    // This week's appointments
    const weeklyAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return isAfter(appointmentDate, now) && isBefore(appointmentDate, nextWeek);
    });

    // Status statistics
    const completedTreatments = appointments.filter(appointment => appointment.status === 'Completed').length;
    const pendingTreatments = appointments.filter(appointment => appointment.status === 'Scheduled').length;
    const inProgressTreatments = appointments.filter(appointment => appointment.status === 'In Progress').length;

    // Revenue calculation
    const totalRevenue = appointments
      .filter(appointment => appointment.cost && appointment.status === 'Completed')
      .reduce((sum, appointment) => sum + (appointment.cost || 0), 0);

    const monthlyRevenue = appointments
      .filter(appointment => {
        if (!appointment.cost || appointment.status !== 'Completed') return false;
        const appointmentDate = new Date(appointment.appointmentDate);
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        return appointmentDate.getMonth() === currentMonth && appointmentDate.getFullYear() === currentYear;
      })
      .reduce((sum, appointment) => sum + (appointment.cost || 0), 0);

    // Top patients (by number of appointments)
    const patientAppointmentCount = patients.map(patient => {
      const appointmentCount = appointments.filter(appointment => appointment.patientId === patient.id).length;
      return { ...patient, appointmentCount };
    })
    .sort((a, b) => b.appointmentCount - a.appointmentCount)
    .slice(0, 5);

    return {
      upcomingAppointments,
      todayAppointments,
      weeklyAppointments,
      completedTreatments,
      pendingTreatments,
      inProgressTreatments,
      totalRevenue,
      monthlyRevenue,
      patientAppointmentCount
    };
  }, [patients, appointments]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Today's Appointments"
          value={dashboardData.todayAppointments.length}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${dashboardData.monthlyRevenue}`}
          icon={DollarSign}
          color="bg-yellow-500"
        />
        <StatCard
          title="Completed Treatments"
          value={dashboardData.completedTreatments}
          icon={CheckCircle}
          color="bg-purple-500"
        />
      </div> */}

      {/* Treatment Status */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Pending Treatments"
          value={dashboardData.pendingTreatments}
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          title="In Progress"
          value={dashboardData.inProgressTreatments}
          icon={Activity}
          color="bg-indigo-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${dashboardData.totalRevenue}`}
          icon={TrendingUp}
          color="bg-emerald-500"
          subtitle="All time"
        />
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="mr-2" size={20} />
              Next 10 Appointments
            </h3>
          </div>
          <div className="p-6">
            {dashboardData.upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.upcomingAppointments.map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  return (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{patient?.name}</p>
                        <p className="text-sm text-gray-600">{appointment.title}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(appointment.appointmentDate), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div> */}

        {/* Top Patients */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="mr-2" size={20} />
              Top Patients
            </h3>
          </div>
          <div className="p-6">
            {dashboardData.patientAppointmentCount.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No patients found</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.patientAppointmentCount.map((patient, index) => (
                  <div key={patient.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {patient.appointmentCount} appointments
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div> */}
      </div>

      {/* This Week's Schedule */}
      {dashboardData.weeklyAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertCircle className="mr-2" size={20} />
              This Week's Schedule
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.weeklyAppointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{patient?.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{appointment.title}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(appointment.appointmentDate), 'EEE, MMM d - h:mm a')}
                    </p>
                    {/* {appointment.cost && (
                      <p className="text-sm font-medium text-green-600 mt-2">
                        ${appointment.cost}
                      </p>
                    )} */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

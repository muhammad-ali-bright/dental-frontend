import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import Calendar from 'react-calendar';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { 
  Calendar as CalendarIcon,
  ChevronLeft, 
  ChevronRight,
  Clock,
  User,
  DollarSign
} from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

const CalendarView: React.FC = () => {
  const { patients, appointments } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  // Get appointments for a specific date
  const getAppointmentsForDate = useCallback((date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.appointmentDate), date)
    );
  }, [appointments]);

  // Get appointments for the selected date
  const selectedDateAppointments = useMemo(() => {
    return getAppointmentsForDate(selectedDate);
  }, [getAppointmentsForDate, selectedDate]);

  // Get all appointments for the current month
  const monthlyAppointments = useMemo(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate >= start && appointmentDate <= end;
    });
  }, [appointments, selectedDate]);

  // Custom tile content for the calendar
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayAppointments = getAppointmentsForDate(date);
      if (dayAppointments.length > 0) {
        return (
          <div className="flex flex-col items-center mt-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-blue-600 font-medium">
              {dayAppointments.length}
            </span>
          </div>
        );
      }
    }
    return null;
  };

  // Custom tile class names
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayAppointments = getAppointmentsForDate(date);
      if (dayAppointments.length > 0) {
        return 'has-appointments';
      }
    }
    return '';
  };

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

  // Weekly view data
  const weeklyData = useMemo(() => {
    if (view !== 'week') return [];
    
    const startOfWeek = new Date(selectedDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    
    return eachDayOfInterval({
      start: startOfWeek,
      end: new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000)
    }).map(date => ({
      date,
      appointments: getAppointmentsForDate(date)
    }));
  }, [view, selectedDate, getAppointmentsForDate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">View and manage appointment schedules</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {view === 'month' ? (
              <div className="calendar-container">
                <Calendar
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date as Date)}
                  tileContent={tileContent}
                  tileClassName={tileClassName}
                  className="custom-calendar w-full"
                  prev2Label={null}
                  next2Label={null}
                  prevLabel={<ChevronLeft size={20} />}
                  nextLabel={<ChevronRight size={20} />}
                />
              </div>
            ) : (
              <div className="week-view">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Week of {format(weeklyData[0]?.date || selectedDate, 'MMM d, yyyy')}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() - 7);
                        setSelectedDate(newDate);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() + 7);
                        setSelectedDate(newDate);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 pb-2">
                      {day}
                    </div>
                  ))}
                  
                  {weeklyData.map(({ date, appointments }) => (
                    <div 
                      key={date.toISOString()} 
                      className={`border border-gray-200 rounded-lg p-2 min-h-[120px] cursor-pointer transition-colors ${
                        isSameDay(date, selectedDate) ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {format(date, 'd')}
                      </div>
                      <div className="space-y-1">
                        {appointments.slice(0, 3).map((appointment, index) => {
                          const patient = patients.find(p => p.id === appointment.patientId);
                          return (
                            <div 
                              key={index}
                              className={`text-xs p-1 rounded border ${getStatusColor(appointment.status)}`}
                            >
                              <div className="font-medium truncate">{appointment.title}</div>
                              <div className="truncate">{patient?.name}</div>
                              <div>{format(new Date(appointment.appointmentDate), 'HH:mm')}</div>
                            </div>
                          );
                        })}
                        {appointments.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{appointments.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          {/* Selected Date Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon size={20} className="mr-2" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            
            {selectedDateAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No appointments scheduled for this date
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDateAppointments
                  .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                  .map((appointment) => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    return (
                      <div 
                        key={appointment.id}
                        className={`p-4 rounded-lg border ${getStatusColor(appointment.status)}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{appointment.title}</h4>
                          <div className="flex items-center text-sm">
                            <Clock size={14} className="mr-1" />
                            {format(new Date(appointment.appointmentDate), 'HH:mm')}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm mb-2">
                          <User size={14} className="mr-1" />
                          <span>{patient?.name}</span>
                        </div>
                        
                        <p className="text-sm mb-2">{appointment.description}</p>
                        
                        {appointment.cost && (
                          <div className="flex items-center text-sm">
                            <DollarSign size={14} className="mr-1" />
                            <span>${appointment.cost}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Monthly Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {format(selectedDate, 'MMMM yyyy')} Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Appointments</span>
                <span className="font-semibold">{monthlyAppointments.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">
                  {monthlyAppointments.filter(a => a.status === 'Completed').length}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Scheduled</span>
                <span className="font-semibold text-blue-600">
                  {monthlyAppointments.filter(a => a.status === 'Scheduled').length}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="font-semibold text-yellow-600">
                  {monthlyAppointments.filter(a => a.status === 'In Progress').length}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                  <span className="font-semibold text-green-600">
                    ${monthlyAppointments
                      .filter(a => a.cost && a.status === 'Completed')
                      .reduce((sum, a) => sum + (a.cost || 0), 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-calendar {
          width: 100%;
          border: none;
        }
        
        .custom-calendar .react-calendar__tile {
          padding: 1rem 0.5rem;
          position: relative;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        }
        
        .custom-calendar .react-calendar__tile:enabled:hover {
          background-color: #f3f4f6;
        }
        
        .custom-calendar .react-calendar__tile--active {
          background-color: #3b82f6 !important;
          color: white;
        }
        
        .custom-calendar .react-calendar__tile.has-appointments {
          background-color: #eff6ff;
        }
        
        .custom-calendar .react-calendar__tile.has-appointments:hover {
          background-color: #dbeafe;
        }
        
        .custom-calendar .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 16px;
          margin-top: 8px;
        }
        
        .custom-calendar .react-calendar__navigation button:enabled:hover {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;

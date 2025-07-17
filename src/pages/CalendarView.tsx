// Senior-level CalendarView.tsx with separated MonthView and WeekView components
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { Calendar as BigCalendar, dateFnsLocalizer, Views, Formats } from 'react-big-calendar';
import parse from 'date-fns/parse';
import { format, getDay, startOfWeek, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { useApp } from '../context/AppContext';
import { statusColorClasses } from '../utils/status';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const formats: Formats = {
  eventTimeRangeFormat: ({ start }) => format(start, 'h:mm a')
};

type StatusType = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

const map: Record<StatusType, [string, string, string]> = {
  Scheduled: ['#DBEAFE', '#BFDBFE', '#1E3A8A'],
  'In Progress': ['#FEF3C7', '#FDE68A', '#92400E'],
  Completed: ['#DCFCE7', '#A7F3D0', '#166534'],
  Cancelled: ['#FEE2E2', '#FECACA', '#991B1B']
};

const eventStyleGetter = ({ status }: { status: StatusType }) => {
  const [bg, bd, fg] = map[status];
  return {
    style: {
      backgroundColor: bg,
      border: `1px solid ${bd}`,
      color: fg,
      borderRadius: '4px',
      padding: '2px'
    }
  };
};

const MonthView: React.FC<{
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  setVisibleMonth: (d: Date) => void;
  tileContent: any;
  tileClassName: any;
}> = ({ selectedDate, setSelectedDate, setVisibleMonth, tileContent, tileClassName }) => (
  <Calendar
    locale="en-US"
    value={selectedDate}
    onChange={d => setSelectedDate(d as Date)}
    tileContent={tileContent}
    tileClassName={tileClassName}
    className="custom-calendar w-full"
    prev2Label={null}
    next2Label={null}
    prevLabel={<ChevronLeft size={20} />}
    nextLabel={<ChevronRight size={20} />}
    onActiveStartDateChange={({ activeStartDate }) => {
      if (activeStartDate) setVisibleMonth(activeStartDate);
    }}
  />
);

const WeekView: React.FC<{
  events: any;
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
}> = ({ events, selectedDate, setSelectedDate }) => (
  <BigCalendar
    localizer={localizer}
    events={events}
    formats={formats}
    defaultView={Views.WEEK}
    views={['week']}
    step={30}
    timeslots={2}
    date={selectedDate}
    onNavigate={date => setSelectedDate(date)}
    selectable
    onSelectSlot={slotInfo => setSelectedDate(slotInfo.start)}
    dayPropGetter={date => isSameDay(date, selectedDate) ? { className: 'rbc-day-selected' } : {}}
    eventPropGetter={eventStyleGetter}
    style={{ height: 600 }}
  />
);

const CalendarView: React.FC = () => {
  const navigate = useNavigate();
  const {
    patients,
    appointmentsForMonth,
    appointmentsForWeek,
    getAppointmentsForMonth,
    getAppointmentsForWeek
  } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date());

  const getAppointmentsByDay = useCallback(
    (date: Date) => appointmentsForMonth.filter(app => isSameDay(new Date(app.date), date)),
    [appointmentsForMonth]
  );

  const selectedDateAppointments = useMemo(() => getAppointmentsByDay(selectedDate).sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()),
    [getAppointmentsByDay, selectedDate]
  );

  const monthlyAppointments = useMemo(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    return appointmentsForMonth.filter(app => {
      const d = new Date(app.date);
      return d >= start && d <= end;
    });
  }, [appointmentsForMonth, selectedDate]);

  const events = useMemo(() => {
    const source = view === 'week' ? appointmentsForWeek : appointmentsForMonth;
    return source.map(app => {
      const start = new Date(app.date);
      return { id: app.id, title: app.title, start, end: start, status: app.status };
    });
  }, [appointmentsForMonth, appointmentsForWeek, view]);

  useEffect(() => {
    if (view === 'month') {
      const start = startOfMonth(visibleMonth);
      const end = endOfMonth(visibleMonth);
      getAppointmentsForMonth(start, end);
    } else {
      const start = startOfWeek(selectedDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      getAppointmentsForWeek(start, end);
    }
  }, [visibleMonth, selectedDate, view]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">View and manage appointment schedules</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setView('month')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === 'month' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}>Month</button>
          <button onClick={() => { setView('week'); setSelectedDate(new Date()); }} className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === 'week' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}>Week</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {view === 'month' ? (
            <MonthView
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setVisibleMonth={setVisibleMonth}
              tileContent={({ date, view }: { date: Date; view: string }) => {
                if (view !== 'month') return null;
                const count = getAppointmentsByDay(date).length;
                return count > 0 ? (
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-xs text-blue-600 font-medium">{count}</span>
                  </div>
                ) : null;
              }}

              tileClassName={({ date, view }: { date: Date; view: string }) => {
                if (view !== 'month') return '';
                const classes: string[] = [];
                if (isSameDay(date, selectedDate)) classes.push('selected-date');
                if (getAppointmentsByDay(date).length > 0) classes.push('has-appointments');
                return classes.join(' ');
              }}
            />
          ) : (
            <WeekView
              events={events}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <CalendarIcon size={20} className="mr-2" />{format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            {selectedDateAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments scheduled for this date</p>
            ) : (
              <div className="space-y-4">
                {selectedDateAppointments.map(app => {
                  const patient = patients.find(p => p.id === app.patientId);
                  return (
                    <div key={app.id} className="cursor-pointer p-4 rounded-lg border hover:shadow" onClick={() => navigate('/appointments', { state: { editId: app.id } })}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-lg">{app.title}</h4>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock size={14} className="mr-1" />
                          <span>{format(new Date(app.date), 'h:mm a')}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColorClasses[app.status]}`}>{app.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm mb-2">
                        <User size={14} className="mr-1" />
                        <span>{patient?.name}</span>
                      </div>
                      <p className="text-sm text-gray-700">{app.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{format(selectedDate, 'MMMM yyyy')} Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span>Total Appointments</span><span className="font-semibold">{monthlyAppointments.length}</span></div>
              <div className="flex justify-between"><span>Completed</span><span className="font-semibold text-green-600">{monthlyAppointments.filter(a => a.status === 'Completed').length}</span></div>
              <div className="flex justify-between"><span>Scheduled</span><span className="font-semibold text-blue-600">{monthlyAppointments.filter(a => a.status === 'Scheduled').length}</span></div>
              <div className="flex justify-between"><span>In Progress</span><span className="font-semibold text-yellow-600">{monthlyAppointments.filter(a => a.status === 'In Progress').length}</span></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-calendar { width: 100%; border: none; }
        .custom-calendar .react-calendar__tile { padding: 1rem 0.5rem; height: 80px; }
        .custom-calendar .react-calendar__tile.has-appointments { background: #eff6ff; }
        .custom-calendar .react-calendar__tile.has-appointments:hover { background: #dbeafe; }
        .custom-calendar .react-calendar__tile.selected-date { background: #2563eb; color: #fff; border-radius: 0.5rem; }
        .custom-calendar .react-calendar__tile.selected-date:hover { background: #1e40af; }
        .custom-calendar .react-calendar__tile.selected-date .w-2 { background: #fff; }
        .custom-calendar .react-calendar__tile.selected-date span.text-xs { color: #fff; }
        .rbc-day-selected { background-color: rgba(59, 130, 246, 0.1); }
        .rbc-day-selected .rbc-header { background-color: rgba(59, 130, 246, 0.15); font-weight: 600; }
        .rbc-day-selected .rbc-header + .rbc-time-gutter { border-left: 2px solid rgb(59, 130, 246); }
      `}</style>
    </div>
  );
};

export default CalendarView;

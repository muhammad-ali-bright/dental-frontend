import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useApp } from "../context/AppContext";
import CalendarGrid from "../components/calendar/components/CalendarGrid";

const Calendar = () => {
  const {
    getAppointmentsForCalendarRange,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useApp();

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState("week");
  const [Appointments, setAppointments] = useState([]);

  const getRange = () => {
    switch (view) {
      case "week":
        return {
          start: currentDate.startOf("week").toDate(),
          end: currentDate.endOf("week").toDate(),
        };
      case "month":
        return {
          start: currentDate.startOf("month").toDate(),
          end: currentDate.endOf("month").toDate(),
        };
      default:
        return {
          start: currentDate.startOf("week").toDate(),
          end: currentDate.endOf("week").toDate(),
        };
    }
  };

  const fetchAppointments = async () => {
    const { start, end } = getRange();
    const fetched = await getAppointmentsForCalendarRange(start, end);
    setAppointments(fetched);
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentDate, view]);

  return (
    <div className="flex flex-col md:flex-row">
      <CalendarGrid
        appointments={Appointments}
        setAppointments={setAppointments}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
        addEvent={async (ev) => {
          await addAppointment(ev);
          fetchAppointments(); // refresh
        }}
        updateEvent={async (id, data) => {
          await updateAppointment(id, data);
          fetchAppointments(); // refresh
        }}
        deleteEvent={async (id) => {
          await deleteAppointment(id);
          fetchAppointments(); // refresh
        }}
      />
    </div>
  );
};

export default Calendar;

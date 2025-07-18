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
  const [events, setEvents] = useState([]);

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

  const fetchEvents = async () => {
    const { start, end } = getRange();
    const fetched = await getAppointmentsForCalendarRange(start, end);
    setEvents(fetched);
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate, view]);

  console.log(events);

  return (
    <div className="flex flex-col md:flex-row">
      <CalendarGrid
        appointments={events}
        setEvents={setEvents}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
        addEvent={async (ev) => {
          await addAppointment(ev);
          fetchEvents(); // refresh
        }}
        updateEvent={async (id, data) => {
          await updateAppointment(id, data);
          fetchEvents(); // refresh
        }}
        deleteEvent={async (id) => {
          await deleteAppointment(id);
          fetchEvents(); // refresh
        }}
      />
    </div>
  );
};

export default Calendar;

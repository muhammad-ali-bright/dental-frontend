import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import CalendarHeader from "./CalendarHeader";
import CalendarViewRenderer from "./CalendarViewRenderer";
import EventForm from "./EventForm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CalendarGrid = ({
  appointments,
  setAppointments,
  currentDate,
  setCurrentDate,
  view,
  setView,
  addEvent,
  updateEvent,
  deleteEvent,
}) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    patientId: "",
    status: "Scheduled",
  });

  const isFirstLoad = useRef(true);
  const prevDateRef = useRef(currentDate);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (!dayjs(currentDate).isSame(prevDateRef.current, "day")) {
      setView(view); // triggers re-render
    }
    prevDateRef.current = currentDate;
  }, [currentDate]);

  const handleRC = (e, day, hour) => {
    e.preventDefault();
    setEditingEvent(null);
    setModal({ position: "center" });

    const date = day.format("YYYY-MM-DD");

    setForm({
      title: "",
      date,
      startTime: `${hour.toString().padStart(2, "0")}:00`,
      endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
      description: "",
      patientId: "",
      status: "Scheduled",
    });
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description || "",
      patientId: event.patientId || "",
      status: event.status || "Scheduled",
      color: event.color || "#2196f3",
    });
    setModal({ position: "center", editMode: true });
    setSelectedEvent(null);
  };

  const handleDelete = async (event) => {
    await deleteEvent(event.id); // ✅ backend call
    setSelectedEvent(null);
  };

  const closeForm = () => {
    setModal(null);
    setEditingEvent(null);
    setSelectedEvent(null);
    setForm({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      patientId: "",
      status: "Scheduled",
    });
  };

  const saveEv = async () => {
    const newAppointment = {
      id: editingEvent?.id || undefined,
      title: form.title,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      description: form.description,
      patientId: form.patientId,
      status: form.status || "Scheduled",
      color: form.color || "#a855f7",
    };

    if (editingEvent) {
      await updateEvent(editingEvent.id, newAppointment); // ✅ backend update
    } else {
      await addEvent(newAppointment); // ✅ backend create
    }

    closeForm();
  };

  return (
    <div className="flex-1 bg-white relative p-4">
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
        setAppointments={setAppointments}
      />

      <CalendarViewRenderer
        view={view}
        currentDate={currentDate}
        appointments={appointments}
        handleRC={handleRC}
        handleEdit={handleEdit}
        onEventClick={setSelectedEvent}
      />

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <EventForm
            modal={modal}
            form={form}
            setForm={setForm}
            onSave={saveEv}
            onClose={closeForm}
          />
        </div>
      )}

      {selectedEvent && (
        <div className="fixed top-[20%] left-1/2 transform -translate-x-1/2 bg-white shadow-2xl border border-gray-200 rounded-xl p-5 w-72 z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{selectedEvent.title}</h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {selectedEvent.startTime} – {selectedEvent.endTime}
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => handleEdit(selectedEvent)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              <EditIcon fontSize="small" /> Edit
            </button>
            <button
              onClick={() => handleDelete(selectedEvent)}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium text-sm"
            >
              <DeleteIcon fontSize="small" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

CalendarGrid.propTypes = {
  appointments: PropTypes.array.isRequired,
  setAppointments: PropTypes.func.isRequired,
  currentDate: PropTypes.any.isRequired,
  setCurrentDate: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  addEvent: PropTypes.func.isRequired,
  updateEvent: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
};

export default CalendarGrid;

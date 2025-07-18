// EventForm.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { useApp } from "../../../context/AppContext";

const EventForm = ({ modal, form = {}, setForm, onSave, onClose }) => {
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min of [0, 30]) {
        const t = new Date();
        t.setHours(hour, min, 0, 0);
        // Match fmt(): “5 PM” if min===0, else “5:30 PM”
        options.push(
          t.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();
  const predefinedColors = ["#f87171", "#60a5fa", "#34d399", "#facc15"];
  const [customColor, setCustomColor] = useState(form.color || "#a855f7");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const { patientNames, getPatientNames } = useApp();

  useEffect(() => {
    const now = new Date();

    const hasStartTime = !!form.startTime;
    const hasEndTime = !!form.endTime;
    const hasDate = !!form.date;

    const minutes = now.getMinutes();
    const roundedMinutes = minutes < 30 ? 30 : 0;
    const adjustedHour = minutes >= 30 ? now.getHours() + 1 : now.getHours();

    const defaultStart = new Date();
    defaultStart.setHours(adjustedHour, roundedMinutes, 0, 0);
    const defaultEnd = new Date(defaultStart.getTime() + 30 * 60000);

    const formattedStart = defaultStart.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const formattedEnd = defaultEnd.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setForm((prevForm) => ({
      ...prevForm,
      date: hasDate ? prevForm.date : format(now, "yyyy-MM-dd"),
      startTime: hasStartTime ? prevForm.startTime : formattedStart,
      endTime: hasEndTime ? prevForm.endTime : formattedEnd,
      color: prevForm.color || customColor,
    }));

    getPatientNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValid =
    form.title &&
    form.date &&
    form.startTime &&
    form.endTime &&
    timeOptions.indexOf(form.endTime) > timeOptions.indexOf(form.startTime);

  return (
    <div
      className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-xl shadow-2xl p-6 w-[400px] max-w-[90vw]"
      onKeyDown={(e) => {
        if (e.key === "Enter" && isValid) {
          e.preventDefault();
          onSave();
        }
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 tracking-wide">
          {modal?.editMode ? "Edit Appointment" : "Create New Appointment"}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Title */}
      <label className="text-sm font-medium text-gray-700">Title</label>
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Appointment title"
        className="w-full border border-gray-300 px-3 py-2 mb-4 rounded-md text-sm focus:ring-2 focus:ring-blue-200"
      />

      {/* Appointment Date */}
      <label className="text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="w-full border border-gray-300 px-3 py-2 mb-4 rounded-md text-sm focus:ring-2 focus:ring-blue-200"
      />

      {/* Time Range */}
      <label className="text-sm font-medium text-gray-700">Time</label>
      <div className="flex gap-2 mb-4">
        <select
          value={form.startTime}
          onChange={(e) => {
            const selectedStart = e.target.value;
            const [h, m, modifier] = selectedStart.split(/:| /);
            const hour = parseInt(h, 10) % 12 + (modifier === "PM" ? 12 : 0);
            const minute = parseInt(m, 10);
            const start = new Date();
            start.setHours(hour, minute, 0, 0);
            const end = new Date(start.getTime() + 30 * 60000);

            const formattedEnd = end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            setForm({ ...form, startTime: selectedStart, endTime: formattedEnd });
          }}
          className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm"
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <span className="self-center">–</span>

        <select
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm"
        >
          {timeOptions
            .filter((t) => timeOptions.indexOf(t) > timeOptions.indexOf(form.startTime))
            .map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
        </select>
      </div>

      {/* Description */}
      <label className="text-sm font-medium text-gray-700">Description</label>
      <textarea
        value={form.description || ""}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Add details..."
        className="w-full border border-gray-300 px-3 py-2 mb-4 rounded-md text-sm focus:ring-2 focus:ring-blue-200 resize-none"
        rows={3}
      />

      {/* Patient */}
      <label className="text-sm font-medium text-gray-700">Patient</label>
      <select
        value={form.patientId || ""}
        onChange={(e) => setForm({ ...form, patientId: e.target.value })}
        className="w-full border border-gray-300 px-3 py-2 mb-4 rounded-md text-sm focus:ring-2 focus:ring-blue-200"
      >
        <option value="">Select a patient</option>
        {patientNames.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Status */}
      <label className="text-sm font-medium text-gray-700">Status</label>
      <select
        value={form.status || "Scheduled"}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
        className="w-full border border-gray-300 px-3 py-2 mb-4 rounded-md text-sm focus:ring-2 focus:ring-blue-200"
      >
        <option value="Scheduled">Scheduled</option>
        <option value="Completed">Completed</option>
        <option value="Canceled">Canceled</option>
      </select>

      {/* Color Picker */}
      <label className="text-sm font-medium text-gray-700">Color</label>
      <div className="flex items-center gap-3 mb-4 mt-1">
        {predefinedColors.map((c, i) => (
          <button
            key={i}
            onClick={() => {
              setForm({ ...form, color: c });
              setShowColorPicker(false);
            }}
            className={`w-6 h-6 rounded-full ring-2 ${form.color === c ? "ring-black ring-offset-2" : "ring-transparent"
              }`}
            style={{ backgroundColor: c }}
            title={`Color ${i + 1}`}
          />
        ))}

        <div className="relative">
          <button
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setForm({ ...form, color: customColor });
            }}
            className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center"
            style={{ backgroundColor: customColor }}
            title="Custom Color"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-white pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
            </svg>
          </button>
          {showColorPicker && (
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                setForm({ ...form, color: e.target.value });
              }}
              className="absolute top-8 left-0 w-24 h-8 p-0 border-none"
            />
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={!isValid}
        className={`w-full py-2 rounded-md font-semibold text-sm transition ${isValid
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        Save Appointment
      </button>
    </div>
  );
};

EventForm.propTypes = {
  modal: PropTypes.shape({
    editMode: PropTypes.bool,
  }),
  form: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    description: PropTypes.string,
    patient: PropTypes.string,
    status: PropTypes.string,
    color: PropTypes.string,
  }),
  setForm: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EventForm;

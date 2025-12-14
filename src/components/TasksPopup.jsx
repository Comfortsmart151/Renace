// src/components/TasksPopup.jsx
import React, { useState, useRef } from "react";
import "./TasksPopup.css";

export default function TasksPopup({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");

  // 👉 refs para abrir selectores
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd({
      title,
      description,
      category,
      deadlineDate,
      deadlineTime,
    });

    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h3 className="popup-title">Nueva tarea</h3>

        <button className="popup-close" onClick={onClose}>
          <i className="ri-close-line"></i>
        </button>

        {/* Título */}
        <input
          className="popup-input"
          placeholder="Título de la tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Descripción */}
        <textarea
          className="popup-textarea"
          placeholder="Descripción opcional"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Categoría */}
        <label className="popup-label">Categoría</label>
        <select
          className="popup-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Personal</option>
          <option>Trabajo</option>
          <option>Salud</option>
          <option>Estudio</option>
          <option>Renace</option>
        </select>

        {/* Fecha límite */}
        <label className="popup-label">Fecha límite</label>
        <div className="popup-input-icon-row">
          <input
            type="date"
            ref={dateRef}
            className="popup-input"
            value={deadlineDate}
            onChange={(e) => setDeadlineDate(e.target.value)}
          />
          <button
            className="popup-icon-btn"
            onClick={() => dateRef.current?.showPicker()}
          >
            <i className="ri-calendar-line"></i>
          </button>
        </div>

        {/* Hora límite */}
        <label className="popup-label">Hora límite</label>
        <div className="popup-input-icon-row">
          <input
            type="time"
            ref={timeRef}
            className="popup-input"
            value={deadlineTime}
            onChange={(e) => setDeadlineTime(e.target.value)}
          />

          <button
            className="popup-icon-btn"
            onClick={() => timeRef.current?.showPicker()}
          >
            <i className="ri-time-line"></i>
          </button>
        </div>

        {/* Botón agregar */}
        <button className="popup-primary" onClick={handleSubmit}>
          Añadir tarea
        </button>
      </div>
    </div>
  );
}

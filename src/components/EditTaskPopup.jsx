// src/components/EditTaskPopup.jsx
import React, { useState, useRef } from "react";
import "./EditTaskPopup.css";

export default function EditTaskPopup({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [category, setCategory] = useState(task.category || "Personal");
  const [deadlineDate, setDeadlineDate] = useState(task.deadlineDate || "");
  const [deadlineTime, setDeadlineTime] = useState(task.deadlineTime || "");

  // referencias ocultas para abrir inputs nativos
  const dateRef = useRef();
  const timeRef = useRef();

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      ...task,
      title,
      description,
      category,
      deadlineDate,
      deadlineTime,
    });

    onClose();
  };

  return (
    <div className="edit-overlay">

      <div className="edit-card">
        {/* BOTÓN CERRAR */}
        <button className="edit-close" onClick={onClose}>
          <i className="ri-close-line"></i>
        </button>

        <h2 className="edit-title">Editar tarea</h2>

        {/* TÍTULO */}
        <label className="edit-label">Título</label>
        <input
          type="text"
          className="edit-input"
          placeholder="Título de la tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* DESCRIPCIÓN */}
        <label className="edit-label">Descripción</label>
        <textarea
          className="edit-textarea"
          placeholder="Descripción opcional..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* CATEGORÍA */}
        <label className="edit-label">Categoría</label>
        <select
          className="edit-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Personal">Personal</option>
          <option value="Trabajo">Trabajo</option>
          <option value="Salud">Salud</option>
          <option value="Estudio">Estudio</option>
          <option value="Renace">Renace</option>
        </select>

        {/* FECHA LÍMITE */}
        <label className="edit-label">Fecha límite</label>
        <div className="edit-input-icon-row">
          <input
            type="date"
            ref={dateRef}
            className="edit-input"
            value={deadlineDate || ""}
            onChange={(e) => setDeadlineDate(e.target.value)}
          />
          <button className="edit-icon-btn" onClick={() => dateRef.current.showPicker()}>
            <i className="ri-calendar-line"></i>
          </button>
        </div>

        {/* HORA LÍMITE */}
        <label className="edit-label">Hora límite</label>
        <div className="edit-input-icon-row">
          <input
            type="time"
            ref={timeRef}
            className="edit-input"
            value={deadlineTime || ""}
            onChange={(e) => setDeadlineTime(e.target.value)}
          />
          <button className="edit-icon-btn" onClick={() => timeRef.current.showPicker()}>
            <i className="ri-time-line"></i>
          </button>
        </div>

        {/* BOTÓN GUARDAR */}
        <button className="edit-save-btn" onClick={handleSave}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

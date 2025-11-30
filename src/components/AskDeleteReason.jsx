// src/components/AskDeleteReason.jsx
import React, { useState } from "react";
import { playSound } from "../utils/playSound";

export default function AskDeleteReason({ task, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");

  const handleCancel = () => {
    playSound("popup-close", 0.28);
    onCancel();
  };

  const handleConfirm = () => {
    playSound("task-delete", 0.5);
    onConfirm(reason);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card glass">
        <h3 className="modal-title">¿Por qué quieres eliminar esta tarea?</h3>

        <textarea
          className="textarea"
          rows="4"
          placeholder="Escribe el motivo..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="modal-actions">
          <button className="ghost-button" onClick={handleCancel}>
            Cancelar
          </button>

          <button className="primary-button" onClick={handleConfirm}>
            Eliminar definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}

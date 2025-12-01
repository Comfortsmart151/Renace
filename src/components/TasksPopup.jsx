// src/components/TasksPopup.jsx
import React from "react";

export default function TasksPopup({ tasks, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título del modal */}
        <h3 className="modal-title">Tareas pendientes</h3>

        {/* Lista o estado vacío */}
        {tasks.length === 0 ? (
          <p className="modal-subtitle" style={{ marginTop: "6px" }}>
            No tienes tareas pendientes.
          </p>
        ) : (
          <ul
            style={{
              marginTop: "8px",
              paddingLeft: "16px",
              color: "var(--renace-text-main)",
              fontSize: "0.9rem",
              lineHeight: "1.4",
            }}
          >
            {tasks.map((t) => (
              <li key={t.id}>{t.title}</li>
            ))}
          </ul>
        )}

        {/* Botón para cerrar */}
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

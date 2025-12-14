// src/components/ModalEstadisticas.jsx
import React from "react";
import "./ModalPremium.css";

export default function ModalEstadisticas({ onClose, data }) {
  return (
    <div className="modal-premium-overlay">
      <div className="modal-premium-card">
        <h2 className="modal-title">Estadísticas detalladas</h2>
        <p className="modal-subtitle">Tu evolución en números.</p>

        <div className="modal-stats-grid">
          <div className="modal-stat-item">
            <span className="modal-stat-label">Intenciones totales</span>
            <span className="modal-stat-value">{data.intenciones}</span>
          </div>

          <div className="modal-stat-item">
            <span className="modal-stat-label">Tareas completadas</span>
            <span className="modal-stat-value">{data.tareas}</span>
          </div>

          <div className="modal-stat-item">
            <span className="modal-stat-label">Retos completados</span>
            <span className="modal-stat-value">{data.retos}</span>
          </div>

          <div className="modal-stat-item">
            <span className="modal-stat-label">Días activos</span>
            <span className="modal-stat-value">{data.diasActivos}</span>
          </div>
        </div>

        <button className="modal-btn-close" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

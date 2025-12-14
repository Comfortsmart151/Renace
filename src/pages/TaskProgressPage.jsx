// src/pages/TaskProgressPage.jsx
import React from "react";
import "./SubPages.css";

export default function TaskProgressPage({ onNavigate }) {
  return (
    <div className="subpage-wrapper">
      <header className="subpage-header">
        <button className="subpage-back" onClick={() => onNavigate("profile")}>
          ←
        </button>
        <h1>Progreso de tareas</h1>
      </header>

      <section className="subpage-card">
        <h2>Resumen de tareas</h2>
        <p className="subpage-text">
          Aquí verás estadísticas avanzadas, gráficos y desglose por día.
        </p>
      </section>
    </div>
  );
}

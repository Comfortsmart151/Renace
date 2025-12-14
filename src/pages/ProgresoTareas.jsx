// src/pages/ProgresoTareas.jsx
import React, { useEffect, useState } from "react";
import "./Profile.css";

import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function ProgresoTareas({ onNavigate }) {
  const [resumen, setResumen] = useState({
    total: 0,
    completadas: 0,
    pendientes: 0,
    hoyCompletadas: 0,
  });

  useEffect(() => {
    const col = collection(db, "tasks");

    const unsub = onSnapshot(col, (snapshot) => {
      const todayKey = new Date().toISOString().slice(0, 10);

      let total = 0;
      let completadas = 0;
      let pendientes = 0;
      let hoyCompletadas = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        total++;

        const isCompleted = !!data.completed;
        if (isCompleted) completadas++;
        else pendientes++;

        if (isCompleted && data.createdAt) {
          const d = data.createdAt.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt);
          const key = d.toISOString().slice(0, 10);
          if (key === todayKey) hoyCompletadas++;
        }
      });

      setResumen({ total, completadas, pendientes, hoyCompletadas });
    });

    return () => unsub();
  }, []);

  return (
    <div className="profile-page">
      <header className="profile-subheader">
        <button
          type="button"
          className="profile-back-chip"
          onClick={() => onNavigate && onNavigate("profile")}
        >
          <span className="profile-back-icon">←</span>
          <span>Volver a perfil</span>
        </button>

        <h1 className="profile-subtitle-main">Progreso de tareas</h1>
        <p className="profile-subtitle-helper">
          Mira cómo se está moviendo tu productividad en Renace.
        </p>
      </header>

      <section className="profile-section">
        <div className="profile-section-header">
          <h2>Resumen general</h2>
          <p>Un vistazo rápido a tus tareas.</p>
        </div>

        <div className="profile-progress-grid compact">
          <div className="profile-progress-card">
            <span className="profile-progress-icon">🧾</span>
            <div className="profile-progress-content">
              <p className="progress-title">Tareas creadas</p>
              <p className="progress-number">{resumen.total}</p>
              <p className="progress-sub">Todo el historial.</p>
            </div>
          </div>

          <div className="profile-progress-card">
            <span className="profile-progress-icon">✅</span>
            <div className="profile-progress-content">
              <p className="progress-title">Completadas</p>
              <p className="progress-number">{resumen.completadas}</p>
              <p className="progress-sub">
                Hoy completaste {resumen.hoyCompletadas}.
              </p>
            </div>
          </div>

          <div className="profile-progress-card">
            <span className="profile-progress-icon">⏳</span>
            <div className="profile-progress-content">
              <p className="progress-title">Pendientes</p>
              <p className="progress-number">{resumen.pendientes}</p>
              <p className="progress-sub">
                Ideal para priorizar tu siguiente movimiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-header">
          <h2>Próximos pasos sugeridos</h2>
          <p>Pequeñas ideas basadas en tu avance.</p>
        </div>

        <ul className="profile-suggestions-list">
          {resumen.pendientes > resumen.completadas && (
            <li>
              Prioriza 1–3 tareas clave para hoy en la pantalla de tareas.
            </li>
          )}
          {resumen.completadas > 0 && (
            <li>Reconoce lo que ya lograste. Tu progreso no es casualidad.</li>
          )}
          {resumen.total === 0 && (
            <li>
              Empieza creando una tarea sencilla. Lo importante es arrancar.
            </li>
          )}
          <li>
            Usa el modo enfoque (cuando esté disponible) para bloques de trabajo
            profundo.
          </li>
        </ul>
      </section>
    </div>
  );
}

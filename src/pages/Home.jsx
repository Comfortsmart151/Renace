// src/pages/Home.jsx
import React, { useState, useMemo } from "react";
import MotivationalBanner from "../components/MotivationalBanner";
import TasksPopup from "../components/TasksPopup";
import IntentionsPopup from "../components/IntentionsPopup";

const REFLECTIONS = [
  "Cada avance, por pequeño que sea, es progreso.",
  "Tu historia apenas está comenzando.",
  "Tu enfoque determina tu energía.",
  "Si escuchas el silencio, ahí vive tu verdad.",
];

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Buenos días";
  if (h >= 12 && h < 18) return "Buenas tardes";
  return "Buenas noches";
}

export function Home({
  tasks = [],
  intentions = [],
  today,
  deleteIntention,
  onQuickStart,
}) {
  const [openTasksPopup, setOpenTasksPopup] = useState(false);
  const [openIntentionsPopup, setOpenIntentionsPopup] = useState(false);

  const greeting = getGreeting();
  const reflection = useMemo(
    () => REFLECTIONS[Math.floor(Math.random() * REFLECTIONS.length)],
    []
  );

  const todaysTasks = tasks.filter((t) => t.date === today && !t.done);
  const todaysIntentions = intentions.filter((i) => i.date === today);

  return (
    <div className="home-grid">

      {/* SALUDO */}
      <p className="home-greeting animate-card">
        {greeting}, Alex
      </p>

      {/* BANNER */}
      <MotivationalBanner />

      {/* TARJETA — INTENCIÓN */}
      <div className="card premium-card animate-card">
        <p className="card-subtitle">Tómate 30 segundos</p>
        <p className="card-description">
          para declarar tu intención del día de hoy.
        </p>

        <button className="primary-button" onClick={onQuickStart}>
          Crear intención ahora
        </button>
      </div>

      {/* TARJETA — REFLEXIÓN */}
      <div className="card premium-card small animate-card">
        <p className="card-title">Reflexión del día</p>
        <p className="card-reflection">“ {reflection} ”</p>
      </div>

      {/* TARJETA — TAREAS */}
      <div
        className="card premium-card small clickable animate-card"
        onClick={() => setOpenTasksPopup(true)}
      >
        <p className="card-title">Tareas pendientes</p>
        {todaysTasks.length === 0 ? (
          <p className="card-description">No tienes tareas para hoy.</p>
        ) : (
          <p className="mini-item">Ver {todaysTasks.length} tarea(s)</p>
        )}
      </div>

      {/* TARJETA — INTENCIONES */}
      <div
        className="card premium-card small clickable animate-card"
        onClick={() => setOpenIntentionsPopup(true)}
      >
        <p className="card-title">Intenciones de hoy</p>
        {todaysIntentions.length === 0 ? (
          <p className="card-description">
            Cuando crees una intención aparecerá aquí.
          </p>
        ) : (
          <p className="mini-item">
            Ver {todaysIntentions.length} intención(es)
          </p>
        )}
      </div>

      {/* POPUP TAREAS */}
      {openTasksPopup && (
        <TasksPopup
          tasks={todaysTasks}
          onClose={() => setOpenTasksPopup(false)}
        />
      )}

      {/* POPUP INTENCIONES */}
      {openIntentionsPopup && (
        <IntentionsPopup
          intentions={todaysIntentions}
          onDelete={deleteIntention}
          onClose={() => setOpenIntentionsPopup(false)}
        />
      )}
    </div>
  );
}

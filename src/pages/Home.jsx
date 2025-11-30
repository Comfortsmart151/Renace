import React, { useMemo } from "react";
import MotivationalBanner from "../components/MotivationalBanner.jsx";
import DailyReflection from "../components/DailyReflection.jsx";

const emotionLabels = {
  calm: "Calma",
  focused: "Enfoque",
  grateful: "Gratitud",
  excited: "Emoción",
  anxious: "Ansiedad",
  tired: "Cansancio",
};

export function Home({
  tasks,
  today,
  intentions,
  onQuickStart,
  onDeleteTodayIntention,
}) {
  // Saludo según momento del día
  const greeting = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) return "Buenos días";
    if (hour >= 12 && hour < 18) return "Buenas tardes";
    return "Buenas noches";
  }, []);

  // Intenciones del día actual
  const intentionsToday = useMemo(() => {
    if (!Array.isArray(intentions)) return [];
    return intentions.filter((i) => i.date === today);
  }, [intentions, today]);

  return (
    <div className="home-grid">
      {/* Banner motivacional */}
      <MotivationalBanner />

      {/* Reflexión del día */}
      <DailyReflection />

      {/* Card principal */}
      <div className="glass card hero-card">
        <span className="hero-kicker">{greeting}</span>

        <h2>¿Cuál es mi intención para el día de hoy?</h2>

        <p className="hero-sub">
          Toma 30 segundos para conectar con lo que realmente importa.
        </p>

        <button className="primary-button" onClick={onQuickStart}>
          Crear intención ahora
        </button>
      </div>

      {/* Hoy — Tareas del día (igual que antes) */}
      <div className="glass card today">
        <h3>Hoy</h3>

        {tasks.length === 0 ? (
          <p className="muted">
            Aún no tienes tareas para hoy. Crea tu primera acción consciente y
            dale dirección real a tu día.
          </p>
        ) : (
          <ul className="mini-task-list">
            {tasks.slice(0, 3).map((t) => (
              <li key={t.id}>
                <div className={`status-dot ${t.done ? "is-done" : ""}`} />

                <div className="mini-task-text">
                  <p>{t.title}</p>
                  {t.reason && <small>{t.reason}</small>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Intenciones de hoy — Diario emocional */}
      <div className="glass card last-intention">
        <h3>Intenciones de hoy</h3>

        {intentionsToday.length === 0 ? (
          <p className="muted small">
            Cuando crees una intención, aparecerá aquí como parte de tu diario
            emocional de hoy.
          </p>
        ) : (
          intentionsToday.map((intent) => (
            <div key={intent.id} className="last-intention-body">
              <p className="last-intention-title">{intent.title}</p>

              {intent.reason && (
                <p className="last-intention-reason">{intent.reason}</p>
              )}

              <div className="chip-row">
                {intent.emotion && (
                  <span className="chip small">
                    {emotionLabels[intent.emotion] || intent.emotion}
                  </span>
                )}

                {intent.date && (
                  <span className="chip secondary small">
                    {new Date(intent.date).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                )}

                {intent.date === today && onDeleteTodayIntention && (
                  <button
                    type="button"
                    className="ghost-button small"
                    onClick={() => onDeleteTodayIntention(intent.id)}
                  >
                    Borrar de hoy
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// src/pages/Tasks.jsx
import React from "react";
import { TaskSuccessModal } from "../components/TaskSuccessModal";

export function Tasks({
  tasks,
  onToggleTask,
  onDeleteTask,
  onClearDone,
  onEditTask,
}) {
  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="tasks-grid">

      {/* PENDIENTES */}
      <div className="card animate-card">
        <div className="card-header">
          <h3 className="card-title">Pendientes</h3>
          <span className="card-tag">{pending.length}</span>
        </div>

        {pending.length === 0 ? (
          <p className="card-description">No tienes tareas pendientes.</p>
        ) : (
          pending.map((t) => (
            <div key={t.id} className="task-item">
              <div className="task-info">
                <p className="task-title">{t.title}</p>
                {t.reason && <p className="task-sub">{t.reason}</p>}
              </div>

              <div className="task-actions">
                <button onClick={() => onToggleTask(t.id)}>✔</button>
                <button onClick={() => onEditTask(t)}>✏️</button>
                <button onClick={() => onDeleteTask(t)}>🗑</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* COMPLETADAS */}
      {done.length > 0 && (
        <div className="card animate-card">
          <div className="card-header">
            <h3 className="card-title">Completadas</h3>
            <span className="card-tag">{done.length}</span>
          </div>

          {done.map((t) => (
            <div key={t.id} className="task-item done">
              <p className="task-title">{t.title}</p>
            </div>
          ))}

          <button className="secondary-button" onClick={onClearDone}>
            Limpiar completadas
          </button>
        </div>
      )}
    </div>
  );
}

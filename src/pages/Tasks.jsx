// src/pages/Tasks.jsx
import React, { useMemo, useState, useEffect } from "react";
import AskDeleteReason from "../components/AskDeleteReason";
import { TaskSuccessModal } from "../components/TaskSuccessModal";
import { playSound } from "../utils/playSound";

/* =======================================================
   ETIQUETAS DE EMOCIÓN
======================================================= */
const moodLabels = {
  all: "Todas",
  calm: "Calma",
  focused: "Enfoque",
  grateful: "Gratitud",
  excited: "Emoción",
  anxious: "Ansioso/a",
  tired: "Cansancio",
};

/* =======================================================
   ESTADO DE FECHAS
======================================================= */
function getDeadlineStatus(task) {
  const rawDeadline =
    task.deadline ||
    task.limitDate ||
    task.dueDate ||
    task.date ||
    null;

  if (!rawDeadline || rawDeadline.trim() === "") return "none";

  const deadline = new Date(rawDeadline);
  if (isNaN(deadline.getTime())) return "none";

  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const days = diff / (1000 * 60 * 60 * 24);

  if (diff < 0) return "overdue";
  if (days <= 1) return "urgent";
  if (days <= 3) return "warning";
  return "normal";
}

/* =======================================================
   TASKS PREMIUM
======================================================= */
export function Tasks({
  tasks,
  onToggleTask,
  onDeleteTask,
  onClearDone,
  onEditTask,
}) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMood, setFilterMood] = useState("all");

  const [openMenu, setOpenMenu] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [completedTask, setCompletedTask] = useState(null);

  /* FILTRADO */
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filterStatus === "open" && t.done) return false;
      if (filterStatus === "done" && !t.done) return false;
      if (filterMood !== "all" && t.emotion !== filterMood) return false;
      return true;
    });
  }, [tasks, filterStatus, filterMood]);

  /* CERRAR MENÚ AL HACER CLICK FUERA */
  useEffect(() => {
    function handleClickOutside(e) {
      if (!openMenu) return;

      if (
        !e.target.closest(".menu-button") &&
        !e.target.closest(".menu-dropdown")
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenu]);

  /* ELIMINAR TAREA (CON MOTIVO) */
  function startDelete(task) {
    setDeleteTarget(task);
    setOpenMenu(null);
  }

  function confirmDelete(reason) {
    playSound("task-delete", 0.5);
    onDeleteTask({
      ...deleteTarget,
      deletedReason: reason,
      deletedAt: new Date().toISOString(),
    });
    setDeleteTarget(null);
  }

  /* EDITAR TAREA */
  function startEdit(task) {
    setOpenMenu(null);
    onEditTask(task);
  }

  /* TOGGLE TAREA + POPUP MOTIVACIONAL */
  function handleToggle(task) {
    const wasDone = task.done;
    onToggleTask(task.id);

    if (!wasDone) {
      setCompletedTask(task);
      // el sonido se reproduce en TaskSuccessModal
    }
  }

  /* LIMPIAR COMPLETADAS (CON SONIDO) */
  function handleClearDoneClick() {
    if (!tasks.some((t) => t.done)) return;
    playSound("clear-done", 0.4);
    onClearDone();
  }

  return (
    <section className="tasks-page">
      {/* POPUP MOTIVACIONAL AL COMPLETAR */}
      <TaskSuccessModal
        task={completedTask}
        onClose={() => setCompletedTask(null)}
      />

      {/* MODAL MOTIVO DE ELIMINACIÓN */}
      {deleteTarget && (
        <AskDeleteReason
          task={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* FILTROS */}
      <div className="card glass filters">
        <div className="filters-row">
          <label className="field">
            <span>Estado</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="open">Pendientes</option>
              <option value="done">Completadas</option>
            </select>
          </label>

          <label className="field">
            <span>Emoción</span>
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
            >
              {Object.entries(moodLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          className="ghost-button small"
          onClick={handleClearDoneClick}
          disabled={!tasks.some((t) => t.done)}
        >
          Limpiar completadas
        </button>
      </div>

      {/* LISTA */}
      <div className="card glass task-list">
        {filtered.length === 0 ? (
          <p className="muted">No hay tareas. Crea tu primera acción.</p>
        ) : (
          <ul className="task-list-items">
            {filtered.map((task) => {
              const status = getDeadlineStatus(task);

              return (
                <li
                  key={task.id}
                  className={`task-item premium ${
                    task.done ? "is-done" : ""
                  } status-${status}`}
                >
                  {/* CHECK PREMIUM */}
                  <button
                    className={`task-check ${task.done ? "checked" : ""}`}
                    onClick={() => handleToggle(task)}
                  >
                    <span className="check-icon" />
                  </button>

                  {/* CONTENIDO */}
                  <div className="task-main">
                    <p className="task-title">{task.title}</p>

                    {task.reason && (
                      <p className="task-reason">{task.reason}</p>
                    )}

                    <div className="task-meta">
                      {task.date && (
                        <span className="chip small date-chip">
                          {new Date(task.date).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      )}

                      {task.emotion && (
                        <span
                          className={`chip small emotion-chip ${task.emotion}`}
                        >
                          {moodLabels[task.emotion] || task.emotion}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* MENÚ ⋮ PREMIUM */}
                  <div className="task-menu">
                    <button
                      className="menu-button"
                      onClick={() => {
                        playSound("menu-open", 0.25);
                        setOpenMenu(openMenu === task.id ? null : task.id);
                      }}
                    >
                      ⋮
                    </button>

                    {openMenu === task.id && (
                      <div className="menu-dropdown glass">
                        <button
                          className="menu-item"
                          onClick={() => startEdit(task)}
                        >
                          Editar
                        </button>

                          <button
                          className="menu-item danger"
                          onClick={() => startDelete(task)}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

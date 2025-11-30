// src/pages/Create.jsx
import React, { useState, useEffect } from "react";
import { playSound } from "../utils/playSound";

const EMOTIONS = [
  { id: "calm", label: "Calma", color: "#77C3FF" },
  { id: "focused", label: "Enfoque", color: "#6A8DFF" },
  { id: "grateful", label: "Gratitud", color: "#FFD88F" },
  { id: "excited", label: "Emoción", color: "#FF7AEA" },
  { id: "anxious", label: "Ansioso/a", color: "#8CA3B8" },
  { id: "tired", label: "Cansancio", color: "#C8A7FF" },
];

export function Create({
  addIntention,
  onAddTask,
  defaultDate,
  editingTask,
  onUpdateTask,
}) {
  /* INTENCIÓN DEL DÍA */
  const [intentionTitle, setIntentionTitle] = useState("");
  const [intentionReason, setIntentionReason] = useState("");
  const [intentionEmotion, setIntentionEmotion] = useState("calm");

  const handleIntentionSubmit = (e) => {
    e.preventDefault();
    if (!intentionTitle.trim()) return;

    playSound("intention-create", 0.45);

    addIntention({
      title: intentionTitle.trim(),
      reason: intentionReason.trim(),
      emotion: intentionEmotion,
    });

    setIntentionTitle("");
    setIntentionReason("");
    setIntentionEmotion("calm");
  };

  /* TAREA — MODO EDICIÓN */
  const isEditing = Boolean(editingTask);

  const [taskTitle, setTaskTitle] = useState(editingTask?.title || "");
  const [taskReason, setTaskReason] = useState(editingTask?.reason || "");
  const [taskEmotion, setTaskEmotion] = useState(
    editingTask?.emotion || "calm"
  );
  const [taskDate, setTaskDate] = useState(editingTask?.date || defaultDate);
  const [taskDeadline, setTaskDeadline] = useState(
    editingTask?.deadline || defaultDate
  );

  useEffect(() => {
    if (editingTask) {
      setTaskTitle(editingTask.title || "");
      setTaskReason(editingTask.reason || "");
      setTaskEmotion(editingTask.emotion || "calm");
      setTaskDate(editingTask.date || defaultDate);
      setTaskDeadline(editingTask.deadline || defaultDate);
    }
  }, [editingTask, defaultDate]);

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (isEditing) {
      playSound("task-save", 0.45);
      onUpdateTask({
        ...editingTask,
        title: taskTitle.trim(),
        reason: taskReason.trim(),
        emotion: taskEmotion,
        date: taskDate,
        deadline: taskDeadline,
      });
    } else {
      playSound("task-create", 0.5);
      onAddTask({
        title: taskTitle.trim(),
        reason: taskReason.trim(),
        emotion: taskEmotion,
        date: taskDate,
        deadline: taskDeadline,
      });

      setTaskTitle("");
      setTaskReason("");
      setTaskEmotion("calm");
      setTaskDate(defaultDate);
      setTaskDeadline(defaultDate);
    }
  };

  const EmotionChip = ({ id, label, color, selected, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`emotion-chip clean-chip ${selected ? "is-selected" : ""}`}
      style={{
        background: selected ? color : "rgba(255,255,255,0.06)",
        borderColor: selected ? color : "rgba(255,255,255,0.15)",
        color: selected ? "#000" : "var(--text-main)",
      }}
    >
      {label}
    </button>
  );

  return (
    <section className="create-page create-page-premium">
      {/* INTENCIÓN */}
      <div className="glass card create-card create-card-intention">
        <h3>Intención del día</h3>

        <form className="create-form" onSubmit={handleIntentionSubmit}>
          <label className="field">
            <span>Escribe tu intención</span>
            <input
              type="text"
              placeholder="Ej. Hoy elijo tratarme con más amabilidad"
              value={intentionTitle}
              onChange={(e) => setIntentionTitle(e.target.value)}
            />
          </label>

          <label className="field">
            <span>¿Por qué es importante para ti?</span>
            <textarea
              rows={3}
              placeholder="Ej. Deseo dejar la autoexigencia detrás."
              value={intentionReason}
              onChange={(e) => setIntentionReason(e.target.value)}
            />
          </label>

          <div className="field">
            <span>Emoción que te acompaña hoy</span>
            <div className="emotion-grid emotion-grid-compact">
              {EMOTIONS.map((em) => (
                <EmotionChip
                  key={em.id}
                  {...em}
                  selected={intentionEmotion === em.id}
                  onClick={() => {
                    playSound("emotion-select", 0.3);
                    setIntentionEmotion(em.id);
                  }}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="primary-button wide">
            Guardar intención de hoy
          </button>
        </form>
      </div>

      {/* TAREA */}
      <div className="glass card create-card create-card-task">
        <h3>Tarea / acción consciente</h3>

        <form className="create-form" onSubmit={handleTaskSubmit}>
          <label className="field">
            <span>Tarea o acción</span>
            <input
              type="text"
              placeholder="Ej. Terminar el capítulo del libro"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </label>

          <label className="field">
            <span>¿Qué aporta esta acción a tu día?</span>
            <textarea
              rows={3}
              placeholder="Ej. Me acerca a mi versión disciplinada."
              value={taskReason}
              onChange={(e) => setTaskReason(e.target.value)}
            />
          </label>

          <div className="field">
            <span>Emoción asociada</span>
            <div className="emotion-grid emotion-grid-compact">
              {EMOTIONS.map((em) => (
                <EmotionChip
                  key={em.id}
                  {...em}
                  selected={taskEmotion === em.id}
                  onClick={() => {
                    playSound("emotion-select", 0.3);
                    setTaskEmotion(em.id);
                  }}
                />
              ))}
            </div>
          </div>

          <label className="field">
            <span>Fecha programada</span>
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Fecha límite para completarla</span>
            <input
              type="date"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
            />
          </label>

          <button type="submit" className="primary-button wide">
            {isEditing ? "Guardar cambios" : "Guardar tarea"}
          </button>
        </form>
      </div>
    </section>
  );
}

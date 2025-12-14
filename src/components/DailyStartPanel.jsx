import React, { useState } from "react";
import "./DailyStartPanel.css";

const EMOTIONS = [
  { id: "calm", label: "Calma", emoji: "🙂" },
  { id: "neutral", label: "Neutro", emoji: "😐" },
  { id: "energy", label: "Energía", emoji: "🔥" },
  { id: "anxiety", label: "Ansiedad", emoji: "🌧️" },
  { id: "tired", label: "Cansancio", emoji: "😴" },
];

export function DailyStartPanel({ onClose }) {
  const [emotion, setEmotion] = useState(null);
  const [mainTask, setMainTask] = useState("");
  const [intention, setIntention] = useState("");

  const handleConfirm = () => {
    // Aquí luego podremos guardar en localStorage
    onClose?.();
  };

  return (
    <div className="dsp-backdrop" onClick={onClose}>
      <div
        className="dsp-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dsp-handle" />
        <h2 className="dsp-title">Comienza tu día</h2>
        <p className="dsp-subtitle">
          Define tu intención, tu energía y tu enfoque principal.
        </p>

        <div className="dsp-block">
          <p className="dsp-block-label">Intención del día</p>
          <textarea
            className="dsp-textarea"
            placeholder="¿Con qué intención quieres vivir el día de hoy?"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
          />
        </div>

        <div className="dsp-block">
          <p className="dsp-block-label">¿Cómo te sientes ahora mismo?</p>
          <div className="dsp-emotions-row">
            {EMOTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  emotion === item.id
                    ? "dsp-emotion-chip dsp-emotion-chip-active"
                    : "dsp-emotion-chip"
                }
                onClick={() => setEmotion(item.id)}
              >
                <span className="dsp-emotion-emoji">{item.emoji}</span>
                <span className="dsp-emotion-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="dsp-block">
          <p className="dsp-block-label">Tarea principal del día</p>
          <input
            className="dsp-input"
            placeholder="¿Qué sería lo más importante completar hoy?"
            value={mainTask}
            onChange={(e) => setMainTask(e.target.value)}
          />
        </div>

        <button className="dsp-confirm-button" onClick={handleConfirm}>
          Estoy listo para empezar
        </button>
      </div>
    </div>
  );
}

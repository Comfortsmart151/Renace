// src/components/IntentionModal.jsx
import React, { useState } from "react";

const EMOTIONS = [
  { id: "calm", label: "Calma" },
  { id: "focused", label: "Enfoque" },
  { id: "grateful", label: "Gratitud" },
  { id: "excited", label: "Entusiasmo" },
  { id: "anxious", label: "Ansiedad" },
  { id: "tired", label: "Cansancio" },
];

export default function IntentionModal({ onSave, onClose }) {
  const [intention, setIntention] = useState("");
  const [reason, setReason] = useState("");
  const [emotion, setEmotion] = useState("calm"); // default
  const today = new Date().toISOString().slice(0, 10);

  const handleSave = () => {
    if (!intention.trim()) return;

    const newIntent = {
      id: Date.now(),
      intention,
      reason,
      emotion,
      date: today,
    };

    onSave(newIntent);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h3 className="modal-title">Crear intención</h3>
        <p className="modal-subtitle">
          Declara aquello que quieres sentir o lograr hoy.
        </p>

        {/* Campo: Intención */}
        <div className="field-group">
          <label className="field-label">Intención</label>
          <input
            className="input"
            placeholder="¿Cuál es tu intención de hoy?"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
          />
        </div>

        {/* Campo: Razón */}
        <div className="field-group" style={{ marginTop: "12px" }}>
          <label className="field-label">Razón</label>
          <textarea
            className="textarea"
            placeholder="¿Por qué quieres sostener esta intención?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Chips de emoción */}
        <div className="field-group" style={{ marginTop: "16px" }}>
          <label className="field-label">Emoción principal</label>

          <div className="chips-row">
            {EMOTIONS.map((e) => (
              <div
                key={e.id}
                className={`chip ${emotion === e.id ? "active" : ""}`}
                onClick={() => setEmotion(e.id)}
              >
                {e.label}
              </div>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Guardar intención
          </button>
        </div>

      </div>
    </div>
  );
}

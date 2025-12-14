// src/components/ModalEditarObjetivo.jsx
import React, { useState } from "react";
import "./ModalPremium.css";

export default function ModalEditarObjetivo({ onClose, current, onSave }) {
  const [value, setValue] = useState(current || "");

  return (
    <div className="modal-premium-overlay">
      <div className="modal-premium-card">
        <h2 className="modal-title">Definir objetivo central</h2>
        <p className="modal-subtitle">Escribe tu objetivo principal de vida.</p>

        <textarea
          className="modal-textarea"
          placeholder="Ej: Quiero construir una vida más clara, organizada y con intención."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="modal-btn-row">
          <button className="modal-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="modal-btn-save"
            onClick={() => {
              onSave(value);
              onClose();
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

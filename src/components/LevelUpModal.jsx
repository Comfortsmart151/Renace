import React from "react";
import "./LevelUpModal.css";

export default function LevelUpModal({ nivel, titulo, onClose }) {
  return (
    <div className="levelup-overlay">
      <div className="levelup-modal">

        <div className="levelup-icon">✨</div>

        <h2 className="levelup-title">¡Nivel {nivel} alcanzado!</h2>

        <p className="levelup-text">
          {titulo}<br />
          Estás creciendo de manera increíble.
        </p>

        <button className="levelup-btn" onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
}


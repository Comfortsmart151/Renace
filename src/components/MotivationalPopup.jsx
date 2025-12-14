import React, { useEffect } from "react";
import "./MotivationalPopup.css";

export default function MotivationalPopup({ message, onClose }) {
  useEffect(() => {
    const timeout = setTimeout(onClose, 2600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="mp-overlay">
      <div className="mp-card">
        <div className="mp-icon">✨</div>
        <p className="mp-message">{message}</p>
        <button className="mp-btn" onClick={onClose}>
          Seguir avanzando
        </button>
      </div>
    </div>
  );
}

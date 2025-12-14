import React, { useEffect } from "react";
import "./toast.css";

export default function Toast({ id, title, message, onClose }) {
  
  // Cerrar automáticamente después de 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className="toast-card">
      <div className="toast-icon">
        <i className="ri-notification-3-line"></i>
      </div>

      <div className="toast-content">
        <h4>{title}</h4>
        <p>{message}</p>
      </div>

      <button className="toast-close" onClick={() => onClose(id)}>
        <i className="ri-close-line"></i>
      </button>
    </div>
  );
}

// src/components/HomeIntentionCard.jsx
import React, { useState, useRef } from "react";
import "./HomeIntentionCard.css";

export default function HomeIntentionCard({ item, onDelete, onArchive }) {
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);

  /* ------------------------------
     TOUCH EVENTS (Mobile)
  ------------------------------ */
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const diff = e.touches[0].clientX - startX.current;
    const limited = Math.max(Math.min(diff, 120), -120);
    setOffsetX(limited);
  };

  const handleTouchEnd = () => finalizeSwipe();

  /* ------------------------------
     MOUSE EVENTS (Desktop)
  ------------------------------ */
  const handleMouseDown = (e) => {
    startX.current = e.clientX;
    setIsSwiping(true);
  };

  const handleMouseMove = (e) => {
    if (!isSwiping) return;
    const diff = e.clientX - startX.current;
    const limited = Math.max(Math.min(diff, 120), -120);
    setOffsetX(limited);
  };

  const handleMouseUp = () => finalizeSwipe();
  const handleMouseLeave = () => isSwiping && finalizeSwipe();

  /* ------------------------------
     LOGICA SWIPE
  ------------------------------ */
  const finalizeSwipe = () => {
    setIsSwiping(false);

    if (offsetX > 80) onArchive();
    if (offsetX < -80) onDelete();

    setOffsetX(0);
  };

  return (
    <div className="hic-wrapper">
      {/* Fondo de acciones */}
      <div className="hic-actions">
        <div className="hic-actions-left">Archivar</div>
        <div className="hic-actions-right">Eliminar</div>
      </div>

      {/* Tarjeta deslizable */}
      <div
        className={`hic-card ${item.archivado ? "hic-card-archived" : ""}`}
        style={{ transform: `translateX(${offsetX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >

        <div className="hic-content">
          
          {/* Texto principal de la intención */}
          <p className="hic-text">{item.texto}</p>

          {/* Motivo (solo si existe) */}
          {item.motivo && item.motivo.trim() !== "" && (
            <p className="hic-motivo">
              {item.motivo}
            </p>
          )}

          <span className="hic-meta">
            {new Date(item.fecha.toDate()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

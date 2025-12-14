// src/components/RetoCard.jsx
import React from "react";
import { useSwipeActions } from "../hooks/useSwipeActions";

export default function RetoCard({ reto, onComplete, onDelete }) {
  const swipe = useSwipeActions({
    onArchive: () => onComplete(reto.id),
    onDelete: () => onDelete(reto.id),
  });

  return (
    <div className="swipe-card-wrapper">
      {/* Fondo de acciones */}
      <div className="swipe-card-actions">
        <div
          className="swipe-actions-left"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "110px",
            background: "rgba(34,197,94,0.35)",
          }}
        ></div>

        <div
          className="swipe-actions-right"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "110px",
            background: "rgba(244,67,54,0.35)",
          }}
        ></div>
      </div>

      {/* TARJETA DESLIZABLE */}
      <div
        className={`swipe-card status-${reto.status}`}
        style={swipe.style}
        {...swipe.handlers}
      >
        <div className="reto-card-header">
          <span className={`reto-frequency-tag ${reto.frequency}`}>
            {reto.frequency === "diario"
              ? "Diario"
              : reto.frequency === "semanal"
              ? "Semanal"
              : "Mensual"}
          </span>

          {reto.status === "completado" && (
            <span className="reto-status-pill">Completado</span>
          )}
        </div>

        <h5>{reto.title}</h5>
        <p className="reto-desc">{reto.description}</p>

        <div className="reto-card-actions">
          {reto.status !== "completado" && (
            <button
              className="reto-small-btn complete"
              onClick={() => onComplete(reto.id)}
            >
              Completar
            </button>
          )}

          <button
            className="reto-small-btn remove"
            onClick={() => onDelete(reto.id)}
          >
            Quitar
          </button>
        </div>
      </div>
    </div>
  );
}

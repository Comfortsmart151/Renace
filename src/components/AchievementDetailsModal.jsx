// src/components/AchievementDetailsModal.jsx
import React from "react";

export default function AchievementDetailsModal({ achievement, progress, unlocked, onClose }) {
  if (!achievement) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícono grande */}
        <div
          style={{
            fontSize: "3rem",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          {achievement.icon}
        </div>

        {/* Título */}
        <h3 className="modal-title" style={{ textAlign: "center" }}>
          {achievement.title}
        </h3>

        {/* Descripción */}
        <p
          className="modal-subtitle"
          style={{
            textAlign: "center",
            marginTop: "4px",
            marginBottom: "14px",
            fontSize: "0.9rem",
          }}
        >
          {achievement.description}
        </p>

        {/* Progreso */}
        {!unlocked && achievement.goal > 1 && (
          <>
            <p style={{ textAlign: "center", fontSize: "0.85rem", marginBottom: "6px" }}>
              Progreso: {progress}%
            </p>

            <div
              style={{
                width: "100%",
                height: "8px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, var(--renace-primary), #a78bfa)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </>
        )}

        {/* Mensaje motivacional */}
        <p
          style={{
            marginTop: "2px",
            textAlign: "center",
            color: "var(--renace-text-main)",
            fontSize: "0.9rem",
            lineHeight: "1.4",
            padding: "0 10px",
          }}
        >
          {unlocked
            ? "🎉 ¡Logro alcanzado! Cada paso que das construye a tu mejor versión."
            : "✨ Vas por el camino correcto. Mantén tu ritmo, la constancia crea claridad."}
        </p>

        {/* Botón cerrar */}
        <div className="modal-footer" style={{ marginTop: "18px", justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

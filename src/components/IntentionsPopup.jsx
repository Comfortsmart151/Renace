// src/components/IntentionsPopup.jsx
import React from "react";

export default function IntentionsPopup({
  intentions,
  onDelete,
  onClose,
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h3 className="modal-title">Intenciones de hoy</h3>

        {/* Contenido */}
        {intentions.length === 0 ? (
          <p
            className="modal-subtitle"
            style={{
              marginTop: "8px",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            No tienes intenciones registradas.
          </p>
        ) : (
          <ul
            style={{
              marginTop: "10px",
              paddingLeft: "0",
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {intentions.map((i) => (
              <li
                key={i.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: "14px",
                  background: "rgba(15, 23, 42, 0.85)",
                  border: "1px solid rgba(148, 163, 184, 0.35)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "var(--renace-text-main)",
                  fontSize: "0.9rem",
                }}
              >
                {/* Texto de intención */}
                <span>
                  {i.intention ||
                    i.title ||
                    i.reason ||
                    i.message ||
                    "Sin texto"}
                </span>

                {/* Botón eliminar */}
                <button
                  className="btn btn-ghost"
                  style={{
                    fontSize: "0.75rem",
                    padding: "5px 10px",
                    marginLeft: "10px",
                    borderColor: "rgba(239, 68, 68, 0.65)",
                    color: "rgba(239, 68, 68, 0.85)",
                  }}
                  onClick={() => onDelete(i.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer con botón cerrar */}
        <div className="modal-footer" style={{ justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

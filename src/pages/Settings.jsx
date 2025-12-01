// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";

export function Settings() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [denseMode, setDenseMode] = useState(false);

  /* ===============================
        Aplicar configuración
  =============================== */
  useEffect(() => {
    document.body.dataset.reducedMotion = reducedMotion ? "true" : "false";
    document.body.dataset.denseMode = denseMode ? "true" : "false";
  }, [reducedMotion, denseMode]);

  /* ===============================
            UI PREMIUM
  =============================== */
  return (
    <div className="page-shell" data-tab="settings">
      
      {/* TARJETA: Experiencia visual */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Experiencia visual</span>
        </div>

        {/* Toggle 1 */}
        <div className="field-group" style={{ marginTop: "10px" }}>
          <label className="field-label" style={{ display: "block" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
              Reducir animaciones y brillo
            </span>
          </label>

          <div
            style={{
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <small style={{ color: "var(--renace-text-muted)" }}>
              Ideal si te sientes cansado visualmente.
            </small>

            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              style={{
                width: "42px",
                height: "22px",
                accentColor: "var(--renace-primary)",
              }}
            />
          </div>
        </div>

        {/* Toggle 2 */}
        <div className="field-group" style={{ marginTop: "18px" }}>
          <label className="field-label" style={{ display: "block" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
              Modo compacto
            </span>
          </label>

          <div
            style={{
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <small style={{ color: "var(--renace-text-muted)" }}>
              Reduce espacios y muestra más contenido.
            </small>

            <input
              type="checkbox"
              checked={denseMode}
              onChange={(e) => setDenseMode(e.target.checked)}
              style={{
                width: "42px",
                height: "22px",
                accentColor: "var(--renace-primary)",
              }}
            />
          </div>
        </div>
      </div>

      {/* TARJETA: Datos */}
      <div className="card" style={{ marginTop: "20px" }}>
        <div className="card-header">
          <span className="card-title">Datos</span>
        </div>

        <p className="reflection-text" style={{ marginTop: "6px" }}>
          Toda tu información se almacena localmente en este dispositivo usando
          <strong> localStorage</strong>.
        </p>

        <p
          style={{
            marginTop: "6px",
            fontSize: "0.8rem",
            color: "var(--renace-text-muted)",
          }}
        >
          Puedes limpiar los datos desde la configuración de tu navegador.
        </p>
      </div>
    </div>
  );
}

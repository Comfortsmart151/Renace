import React, { useEffect, useState } from "react";

export function Settings() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [denseMode, setDenseMode] = useState(false);

  useEffect(() => {
    document.body.dataset.reducedMotion = reducedMotion ? "true" : "false";
    document.body.dataset.denseMode = denseMode ? "true" : "false";
  }, [reducedMotion, denseMode]);

  return (
    <section className="settings-page">
      <div className="card glass">
        <h3>Experiencia visual</h3>

        <label className="toggle">
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
          />
          <span className="toggle-label">
            Reducir animaciones y brillo
            <small>
              Ideal si prefieres menos movimiento o estás cansado/a visualmente.
            </small>
          </span>
        </label>

        <label className="toggle">
          <input
            type="checkbox"
            checked={denseMode}
            onChange={(e) => setDenseMode(e.target.checked)}
          />
          <span className="toggle-label">
            Modo compacto
            <small>Reduce espacios y muestra más contenido en pantalla.</small>
          </span>
        </label>
      </div>

      <div className="card glass">
        <h3>Datos</h3>
        <p className="muted">
          Toda tu información se guarda solo en este dispositivo usando
          localStorage. Puedes limpiar manualmente desde la configuración de tu
          navegador.
        </p>
      </div>
    </section>
  );
}

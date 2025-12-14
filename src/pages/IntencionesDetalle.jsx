// src/pages/IntencionesDetalle.jsx
import React, { useEffect, useState } from "react";
import "./Profile.css";

import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function IntencionesDetalle({ onNavigate }) {
  const [intenciones, setIntenciones] = useState([]);

  useEffect(() => {
    const col = collection(db, "intenciones");
    const q = query(col, orderBy("fecha", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        const fechaRaw = data.fecha;
        let fecha = null;

        if (fechaRaw?.toDate) {
          fecha = fechaRaw.toDate();
        } else if (fechaRaw) {
          fecha = new Date(fechaRaw);
        }

        return {
          id: doc.id,
          texto:
            data.intencion ||
            data.texto ||
            data.mensaje ||
            "Intención sin texto.",
          fecha,
        };
      });

      setIntenciones(items);
    });

    return () => unsub();
  }, []);

  return (
    <div className="profile-page">
      <header className="profile-subheader">
        <button
          type="button"
          className="profile-back-chip"
          onClick={() => onNavigate && onNavigate("profile")}
        >
          <span className="profile-back-icon">←</span>
          <span>Volver a perfil</span>
        </button>

        <h1 className="profile-subtitle-main">Intenciones</h1>
        <p className="profile-subtitle-helper">
          Revisa lo que has venido declarando en tu proceso de renacer.
        </p>
      </header>

      <section className="profile-section">
        <div className="profile-section-header">
          <h2>Historial de intenciones</h2>
          <p>Las más recientes aparecen primero.</p>
        </div>

        <div className="profile-intentions-list">
          {intenciones.length === 0 ? (
            <p className="profile-empty-text">
              Aún no has registrado intenciones. Empieza hoy mismo desde la
              pantalla principal.
            </p>
          ) : (
            intenciones.map((item) => (
              <article key={item.id} className="profile-intention-item">
                <div className="profile-intention-dot" />
                <div className="profile-intention-content">
                  <p className="profile-intention-text">“{item.texto}”</p>
                  {item.fecha && (
                    <p className="profile-intention-date">
                      {item.fecha.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

// src/pages/HistorialObjetivo.jsx
import React, { useEffect, useState } from "react";
import "./HistorialObjetivo.css";

import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function formatMonthKey(key) {
  const [year, month] = key.split("-");
  const idx = parseInt(month, 10) - 1;
  const name = MONTHS_ES[idx] || key;
  return `${name.charAt(0).toUpperCase() + name.slice(1)} ${year}`;
}

export default function HistorialObjetivo({ onNavigate }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "users", "alex", "historialObjetivos");
    const qy = query(colRef, orderBy("fechaGenerado", "desc"));

    return onSnapshot(qy, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id, // AAAA-MM
        ...doc.data(),
      }));
      setEntries(data);
    });
  }, []);

  return (
    <div className="hist-page">
      {/* HEADER */}
      <header className="hist-header">
        <button className="back-btn" onClick={() => onNavigate("profile")}>
          ←
        </button>
        <div>
          <h1>Historial del objetivo</h1>
          <p>Revisa cómo ha evolucionado tu enfoque mes a mes.</p>
        </div>
      </header>

      {/* LISTA DE MESES */}
      {entries.length === 0 && (
        <p className="hist-empty">
          Aún no hay registros. A medida que avances cada mes, Renace irá
          guardando tu progreso automáticamente.
        </p>
      )}

      <div className="hist-list">
        {entries.map((item, index) => {
          const prev = entries[index + 1];
          const diff =
            prev && typeof prev.progresoFinal === "number"
              ? item.progresoFinal - prev.progresoFinal
              : null;

          let diffText = "Primer registro";
          let diffClass = "neutral";

          if (diff !== null) {
            if (diff > 0) {
              diffText = `Subiste ${diff} pts vs mes anterior`;
              diffClass = "up";
            } else if (diff < 0) {
              diffText = `Bajaste ${Math.abs(diff)} pts vs mes anterior`;
              diffClass = "down";
            } else {
              diffText = "Mismo nivel que el mes anterior";
              diffClass = "neutral";
            }
          }

          const completados = item.completados || 0;
          const totalPasos = item.totalPasos || 0;

          return (
            <div key={item.id} className="hist-card">
              <div className="hist-card-header">
                <div>
                  <p className="hist-month">{formatMonthKey(item.id)}</p>
                  <p className="hist-objective">{item.objective}</p>
                </div>
                <div className="hist-progress-badge">
                  <span>{item.progresoFinal ?? 0}%</span>
                </div>
              </div>

              <p className="hist-why">“{item.why}”</p>

              <div className="hist-bar-wrapper">
                <div className="hist-bar-bg">
                  <div
                    className="hist-bar-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        item.progresoFinal ?? 0
                      )}%`,
                    }}
                  />
                </div>
                <p className="hist-steps">
                  {completados}/{totalPasos} pasos completados
                </p>
              </div>

              <p className={`hist-diff ${diffClass}`}>{diffText}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

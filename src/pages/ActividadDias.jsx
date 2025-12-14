// src/pages/ActividadDias.jsx
import React, { useEffect, useState } from "react";
import "./ActividadDias.css";

import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

/* =======================================================
   ICONOS PREMIUM POR TIPO
======================================================= */
const ICONOS = {
  Tarea: "🟢",
  Reto: "🔥",
  Intención: "✨",
  Actividad: "📌",
};

/* =======================================================
   FORMATO FECHA
======================================================= */
function formatFecha(fecha) {
  return fecha.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export default function ActividadDias({ onNavigate }) {
  const { user } = useAuth();
  const userId = user?.uid || null;

  const [dias, setDias] = useState([]);

  /* =======================================================
     CARGAR ACTIVIDAD AGRUPADA POR DÍA
  ======================================================= */
  useEffect(() => {
    const col = collection(db, "historial");

    const unsub = onSnapshot(col, (snapshot) => {
      const byDay = new Map();

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        // 🔥 ACEPTAR DOCS SIN userId (retrocompatibilidad)
        if (userId && data.userId && data.userId !== userId) return;

        let fecha = data.fecha;

        // Soporte de distintos tipos de fecha
        if (fecha?.toDate) fecha = fecha.toDate();
        else if (typeof fecha === "string" || typeof fecha === "number")
          fecha = new Date(fecha);

        if (!(fecha instanceof Date) || isNaN(fecha.getTime())) return;

        // Normalizar al día
        const key = fecha.toISOString().slice(0, 10);

        if (!byDay.has(key)) {
          byDay.set(key, {
            key,
            fecha,
            items: [],
          });
        }

        /* -----------------------------------------------------
           🔥 FIX: UNIFICAR TIPOS DE ACTIVIDAD
        ------------------------------------------------------ */
        let rawTipo = data.tipo || "";

        // Normalizar reto
        if (rawTipo === "reto_completado" || rawTipo === "reto")
          rawTipo = "reto";

        // Normalizar tareas
        if (rawTipo === "tarea_completada" || rawTipo === "tarea")
          rawTipo = "tarea";

        // Normalizar intención
        if (rawTipo === "intencion" || rawTipo === "intención")
          rawTipo = "intencion";

        let tipoUI = "Actividad";
        if (rawTipo === "tarea") tipoUI = "Tarea";
        if (rawTipo === "reto") tipoUI = "Reto";
        if (rawTipo === "intencion") tipoUI = "Intención";

        const descripcion =
          data.descripcion ||
          data.titulo ||
          "Actividad registrada.";

        byDay.get(key).items.push({
          tipo: tipoUI,
          descripcion,
        });
      });

      const list = Array.from(byDay.values()).sort(
        (a, b) => b.fecha - a.fecha
      );

      setDias(list.slice(0, 10));
    });

    return () => unsub();
  }, [userId]);

  /* =======================================================
     RENDER
  ======================================================= */
  return (
    <div className="actividad-page">
      <button
        className="actividad-back"
        onClick={() => onNavigate("profile")}
      >
        ← Volver
      </button>

      <h1 className="actividad-title">Actividad reciente</h1>
      <p className="actividad-sub">
        Cada día que hiciste algo por tu renacer aparecerá aquí.
      </p>

      <h3 className="actividad-section-title">Últimos días con actividad</h3>
      <p className="actividad-sub2">Máximo 10 días recientes.</p>

      {dias.length === 0 ? (
        <p className="actividad-empty">Aún no hay actividad registrada.</p>
      ) : (
        <div className="actividad-list">
          {dias.map((day) => (
            <div key={day.key} className="actividad-card">
              <div className="actividad-card-header">
                <span className="actividad-card-dateicon">📅</span>

                <div>
                  <p className="actividad-card-date">
                    {formatFecha(day.fecha)}
                  </p>

                  <p className="actividad-card-count">
                    {day.items.length} registro
                    {day.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <ul className="actividad-items">
                {day.items.slice(0, 4).map((item, i) => (
                  <li key={i} className="actividad-item">
                    <span className="actividad-item-icon">
                      {ICONOS[item.tipo] || "📌"}
                    </span>
                    <span className="actividad-item-text">
                      <b>{item.tipo}</b>: {item.descripcion}
                    </span>
                  </li>
                ))}

                {day.items.length > 4 && (
                  <li className="actividad-mas">
                    + {day.items.length - 4} actividades más este día
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

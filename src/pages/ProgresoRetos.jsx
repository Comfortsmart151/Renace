// src/pages/ProgresoRetos.jsx
import React, { useEffect, useState } from "react";
import "./SubPages.css";

import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function isSameDay(a, b) {
  return a.toDateString() === b.toDateString();
}
function isSameWeek(a, b) {
  const oneJan = new Date(a.getFullYear(), 0, 1);
  const weekA = Math.ceil((((a - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  const weekB = Math.ceil((((b - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  return weekA === weekB;
}
function isSameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export default function ProgresoRetos({ onNavigate }) {
  const { user } = useAuth();
  const userId = user?.uid || null;

  const [stats, setStats] = useState({
    hoy: 0,
    semana: 0,
    mes: 0,
  });

  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "historial"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      let hoy = 0, semana = 0, mes = 0;
      const now = new Date();

      const lista = [];

      snap.forEach((d) => {
        const data = d.data();

        // 🔥 ACEPTAR DOCS SIN userId (igual que ActividadDias)
        if (userId && data.userId && data.userId !== userId) return;

        /* =======================================================
           🔥 FIX PREMIUM — NORMALIZAR TIPOS antes de filtrar
        ======================================================== */
        let rawTipo = data.tipo || "";

        if (rawTipo === "reto_completado" || rawTipo === "reto")
          rawTipo = "reto";
        else
          return; // ❌ no es un reto real

        /* =======================================================
           Manejo de fecha
        ======================================================== */
        let fecha = data.fecha?.toDate?.() || new Date();

        lista.push({
          descripcion: data.descripcion || data.titulo,
          fecha,
        });

        if (isSameDay(fecha, now)) hoy++;
        if (isSameWeek(fecha, now)) semana++;
        if (isSameMonth(fecha, now)) mes++;
      });

      setStats({ hoy, semana, mes });
      setHistorial(lista.slice(0, 15));
    });
  }, [userId]);

  return (
    <div className="subpage-wrapper">

      <button className="subpage-back" onClick={() => onNavigate("profile")}>
        ←
      </button>

      <h1>Progreso de retos</h1>

      {/* RESUMEN */}
      <section className="subpage-card">
        <h2>Resumen</h2>
        <p>Retos completados hoy: <b>{stats.hoy}</b></p>
        <p>Esta semana: <b>{stats.semana}</b></p>
        <p>Este mes: <b>{stats.mes}</b></p>
      </section>

      {/* HISTORIAL */}
      <section className="subpage-card" style={{ marginTop: 25 }}>
        <h2>Historial reciente</h2>

        {historial.length === 0 ? (
          <p className="subpage-text">Aún no has completado retos.</p>
        ) : (
          <ul className="subpage-history">
            {historial.map((h, i) => (
              <li key={i}>
                <span className="hist-date">
                  {h.fecha.toLocaleDateString("es-ES", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                  })}
                </span>{" "}
                — {h.descripcion}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// src/pages/DailyIntentionPage.jsx
import React, { useEffect, useState } from "react";
import "./SubPages.css";

import { db } from "../firebase";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { registerActivity } from "../utils/registerActivity";

export default function DailyIntentionPage({ onNavigate }) {
  const { user } = useAuth();
  const userId = user?.uid || null;

  const [todayIntention, setTodayIntention] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState([]);

  const todayKey = new Date().toISOString().slice(0, 10);

  /* ---------------------------------------------------
     CARGAR INTENCIÓN LOCAL + FIRESTORE
  --------------------------------------------------- */
  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("renace_intencion_hoy"));
    if (local?.key === todayKey) {
      setTodayIntention(local.value);
    }

    if (!userId) return;

    const q = query(
      collection(db, "historial"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      const list = [];

      snap.forEach((d) => {
        const data = d.data();

        if (data.userId !== userId) return;
        if (!data.tipo?.includes("intencion")) return;

        list.push({
          ...data,
          fecha: data.fecha?.toDate?.() || new Date(),
        });
      });

      setHistory(list.slice(0, 10));
    });
  }, [userId]);

  /* ---------------------------------------------------
     GUARDAR NUEVA INTENCIÓN
  --------------------------------------------------- */
  async function saveIntention() {
    const text = inputValue.trim();
    if (!text) return;

    setTodayIntention(text);
    localStorage.setItem(
      "renace_intencion_hoy",
      JSON.stringify({ key: todayKey, value: text })
    );

    // 🔥 Registrar como actividad del día
    await registerActivity({
      userId,
      tipo: "intencion_dia",
      descripcion: text,
      titulo: "Intención del día",
    });

    setInputValue("");
  }

  return (
    <div className="subpage-wrapper">

      <button className="subpage-back" onClick={() => onNavigate("profile")}>
        ←
      </button>

      <h1>Intención del día</h1>

      {/* TARJETA PRINCIPAL */}
      <section className="subpage-card">
        <h2>Tu intención de hoy</h2>

        {todayIntention ? (
          <p className="subpage-text">“{todayIntention}”</p>
        ) : (
          <p className="subpage-text">Aún no has definido tu intención de hoy.</p>
        )}

        <textarea
          className="subpage-input"
          placeholder="Escribe tu intención…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button className="subpage-btn" onClick={saveIntention}>
          Guardar intención
        </button>
      </section>

      {/* HISTORIAL */}
      <section className="subpage-card" style={{ marginTop: 30 }}>
        <h2>Historial reciente</h2>

        {history.length === 0 ? (
          <p className="subpage-text">Aún no tienes intenciones pasadas.</p>
        ) : (
          <ul className="subpage-history">
            {history.map((h, i) => (
              <li key={i}>
                <span className="hist-date">
                  {h.fecha.toLocaleDateString("es-ES", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                  })}
                </span>{" "}
                — “{h.descripcion}”
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

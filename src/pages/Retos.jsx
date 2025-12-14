// src/pages/Retos.jsx
import React, { useState, useEffect } from "react";
import "./Retos.css";

import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

import ProgressDots from "../components/ProgressDots";
import CompletionEffect from "../components/CompletionEffect";
import LevelUpModal from "../components/LevelUpModal";

import { crearRetoPersonalizado } from "../utils/retoPersonalizado";
import { RETOS_BASE } from "../data/retosBase";
import { useAuth } from "../context/AuthContext";

/* ------------------------------------------------
   HELPERS DE FECHA
------------------------------------------------ */
function isSameDay(a, b) {
  return a.toDateString() === b.toDateString();
}

function getWeekOfYear(d) {
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - start) / 86400000) + start.getDay() + 1) / 7);
}

function isSameWeek(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    getWeekOfYear(a) === getWeekOfYear(b)
  );
}

function isSameMonth(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  );
}

/* ------------------------------------------------
   SISTEMA DE NIVELES XP
------------------------------------------------ */
function getNivelFromXP(xp) {
  if (xp < 5) return 1;
  if (xp < 12) return 2;
  if (xp < 25) return 3;
  if (xp < 40) return 4;
  return 5;
}

function getNivelTitle(n) {
  switch (n) {
    case 1: return "Explorando tu camino";
    case 2: return "Tomando ritmo";
    case 3: return "Enfocado";
    case 4: return "Constante";
    case 5: return "Renaciendo";
    default: return "";
  }
}

function getMedallaFromTotal(t) {
  if (t >= 15) return "oro";
  if (t >= 7) return "plata";
  if (t >= 3) return "bronce";
  return "ninguna";
}

/* ------------------------------------------------
   TARJETA DE RETO
------------------------------------------------ */
function RetoCard({ tipo, etiqueta, reto, onComplete }) {
  const [animKey, setKey] = useState(0);
  const [glow, setGlow] = useState(false);

  const handleClick = async () => {
    await onComplete();
    setKey((k) => k + 1);
    setGlow(true);
    setTimeout(() => setGlow(false), 600);
  };

  return (
    <div className={`reto-card ${glow ? "card-completed-anim" : ""}`}>
      <div className="reto-header">
        <span className={`reto-tag reto-tag-${tipo}`}>{etiqueta}</span>
        <span className="reto-level">Nivel {reto.nivel}</span>
      </div>

      <p className="reto-text">{reto.titulo}</p>
      <p className="reto-desc">{reto.descripcion}</p>

      <div className="reto-footer">
        <button className="reto-btn" onClick={handleClick}>
          Completar reto
        </button>
        <CompletionEffect trigger={animKey} />
      </div>
    </div>
  );
}

/* ------------------------------------------------
   COMPONENTE PRINCIPAL RETOS
------------------------------------------------ */
export default function Retos() {
  const { user } = useAuth();
  const userId = user?.uid || null;

  const [areaSeleccionada, setAreaSeleccionada] = useState("Salud física");
  const [mensaje, setMensaje] = useState("");

  const [progreso, setProgreso] = useState({
    diario: 0,
    semanal: 0,
    mensual: 0,
    total: 0,
    xp: 0,
  });

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [nivelSubido, setNivelSubido] = useState(null);

  const [retoSugerido, setRetoSugerido] = useState(null);

  /* ------------------------------------------------
     ESCUCHAR AVANCE (solo tipo reto_completado)
------------------------------------------------ */
  useEffect(() => {
    const col = collection(db, "historial");

    const unsub = onSnapshot(col, (snap) => {
      const now = new Date();

      let diario = 0,
        semanal = 0,
        mensual = 0,
        total = 0,
        xp = 0;

      snap.docs.forEach((d) => {
        const data = d.data();

        if (userId) {
          if (data.userId && data.userId !== userId) return;
        }

        if (data.tipo !== "reto_completado") return;
        if (data.area !== areaSeleccionada) return;

        let fecha = data.fecha;
        if (fecha?.toDate) fecha = fecha.toDate();
        else if (fecha instanceof Date === false) fecha = new Date(fecha);
        if (!fecha || isNaN(fecha.getTime())) return;

        if (data.frecuencia === "diario" && isSameDay(fecha, now)) {
          diario++;
          xp += 1;
          total++;
        }

        if (data.frecuencia === "semanal" && isSameWeek(fecha, now)) {
          semanal++;
          xp += 2;
          total++;
        }

        if (data.frecuencia === "mensual" && isSameMonth(fecha, now)) {
          mensual++;
          xp += 3;
          total++;
        }
      });

      setProgreso({ diario, semanal, mensual, total, xp });
    });

    return () => unsub();
  }, [areaSeleccionada, userId]);

  /* ------------------------------------------------
     CÁLCULOS
------------------------------------------------ */
  const nivelActual = getNivelFromXP(progreso.xp);
  const tituloNivel = getNivelTitle(nivelActual);
  const medalla = getMedallaFromTotal(progreso.total);

  const configArea = RETOS_BASE[areaSeleccionada];

  const retosDiariosPend = configArea.diario.slice(progreso.diario);
  const retosSemanalesPend = configArea.semanal.slice(progreso.semanal);
  const retosMensualesPend = configArea.mensual.slice(progreso.mensual);

  /* ------------------------------------------------
     RETO SUGERIDO
------------------------------------------------ */
  useEffect(() => {
    let active = true;

    async function load() {
      const reto = await crearRetoPersonalizado({
        area: areaSeleccionada,
        progreso: { ...progreso, nivelArea: nivelActual },
        frecuencia: "diario",
      });

      if (active) setRetoSugerido(reto);
    }

    load();
    return () => (active = false);
  }, [areaSeleccionada, progreso.xp, nivelActual]);

  /* ------------------------------------------------
     COMPLETAR RETO (corregido sin duplicar historial)
------------------------------------------------ */
  async function completarReto(tipo, reto) {
    try {
      const now = new Date();
      const localDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      // SOLO SE REGISTRA UNA VEZ
      await addDoc(collection(db, "historial"), {
        userId: userId || null,
        tipo: "reto_completado",
        titulo: reto.titulo,
        descripcion: reto.descripcion,
        area: areaSeleccionada,
        frecuencia: tipo,
        nivel: reto.nivel,
        origen: reto.origen || "base",
        sugerido: reto.sugerido || false,
        fecha: localDay,
        createdAt: serverTimestamp(),
      });

      // Mensaje UI
      setMensaje("Reto completado ✔");
      setTimeout(() => setMensaje(""), 2000);

      // Nivel up inmediato
      const xpAntes = progreso.xp;
      const xpExtra = tipo === "diario" ? 1 : tipo === "semanal" ? 2 : 3;
      const xpDespues = xpAntes + xpExtra;
      const nivelDespues = getNivelFromXP(xpDespues);

      if (nivelDespues > nivelActual) {
        setNivelSubido(nivelDespues);
        setShowLevelUp(true);
      }

    } catch (err) {
      console.error("Error completando reto:", err);
      setMensaje("No se pudo completar el reto");
      setTimeout(() => setMensaje(""), 2000);
    }
  }

  /* ------------------------------------------------
     RENDER
------------------------------------------------ */
  return (
    <div className="retos-page">
      <div className="retos-banner">
        <h2 className="retos-title">Retos</h2>
        <p className="retos-sub">
          Avanza un día a la vez. La constancia transforma.
        </p>
      </div>

      {mensaje && <p className="retos-message">{mensaje}</p>}

      {/* ÁREAS */}
      <div className="retos-areas-row">
        {Object.keys(RETOS_BASE).map((a) => (
          <button
            key={a}
            className={`retos-area-chip ${
              areaSeleccionada === a ? "active" : ""
            }`}
            onClick={() => setAreaSeleccionada(a)}
          >
            {a}
          </button>
        ))}
      </div>

      {/* PANEL DE PROGRESO */}
      <div className="retos-progress-panel">
        <h4 className="progress-title">Progreso del área</h4>

        <div className="progress-row">
          <span className="progress-label">Diario</span>
          <ProgressDots total={3} filled={Math.min(progreso.diario, 3)} />
        </div>

        <div className="progress-row">
          <span className="progress-label">Semanal</span>
          <ProgressDots total={3} filled={Math.min(progreso.semanal, 3)} />
        </div>

        <div className="progress-row">
          <span className="progress-label">Mensual</span>
          <ProgressDots total={3} filled={Math.min(progreso.mensual, 3)} />
        </div>

        <div className="nivel-badge">
          <span className="nivel-label">Nivel del área</span>
          <span className="nivel-value">
            Nivel {nivelActual} · {tituloNivel}
          </span>
        </div>

        <div className="medallas-row">
          <span className="progress-label">Medallas</span>
          <div className="medallas-chips">
            <span className={`medalla-chip ${["bronce", "plata", "oro"].includes(medalla) ? "medalla-unlocked" : ""}`}>
              🥉 Bronce
            </span>
            <span className={`medalla-chip ${["plata", "oro"].includes(medalla) ? "medalla-unlocked" : ""}`}>
              🥈 Plata
            </span>
            <span className={`medalla-chip ${medalla === "oro" ? "medalla-unlocked" : ""}`}>
              🥇 Oro
            </span>
          </div>
        </div>
      </div>

      {/* RETO SUGERIDO */}
      {retoSugerido && (
        <section className="retos-section">
          <h3 className="retos-section-title">Reto sugerido para ti</h3>
          <div className="retos-grid">
            <RetoCard
              tipo="diario"
              etiqueta="Sugerido por Renace"
              reto={retoSugerido}
              onComplete={() => completarReto("diario", retoSugerido)}
            />
          </div>
        </section>
      )}

      {/* DIARIOS */}
      <section className="retos-section">
        <h3 className="retos-section-title">Retos diarios</h3>
        {retosDiariosPend.length === 0 ? (
          <p className="retos-empty">Ya completaste los retos diarios 🎉</p>
        ) : (
          <div className="retos-grid">
            {retosDiariosPend.map((r, i) => (
              <RetoCard
                key={`d-${i}`}
                tipo="diario"
                etiqueta="Reto diario"
                reto={r}
                onComplete={() => completarReto("diario", r)}
              />
            ))}
          </div>
        )}
      </section>

      {/* SEMANALES */}
      <section className="retos-section">
        <h3 className="retos-section-title">Retos semanales</h3>
        {retosSemanalesPend.length === 0 ? (
          <p className="retos-empty">Retos semanales completados 💪</p>
        ) : (
          <div className="retos-grid">
            {retosSemanalesPend.map((r, i) => (
              <RetoCard
                key={`s-${i}`}
                tipo="semanal"
                etiqueta="Reto semanal"
                reto={r}
                onComplete={() => completarReto("semanal", r)}
              />
            ))}
          </div>
        )}
      </section>

      {/* MENSUALES */}
      <section className="retos-section">
        <h3 className="retos-section-title">Retos mensuales</h3>
        {retosMensualesPend.length === 0 ? (
          <p className="retos-empty">¡Retos mensuales completados! 🌙</p>
        ) : (
          <div className="retos-grid">
            {retosMensualesPend.map((r, i) => (
              <RetoCard
                key={`m-${i}`}
                tipo="mensual"
                etiqueta="Reto mensual"
                reto={r}
                onComplete={() => completarReto("mensual", r)}
              />
            ))}
          </div>
        )}
      </section>

      {/* HINT */}
      <p className="retos-hint">
        Completa los retos que desees. Cada acción te acerca a tu mejor versión.
      </p>

      {/* MODAL NIVEL-UP */}
      {showLevelUp && nivelSubido && (
        <LevelUpModal
          nivel={nivelSubido}
          titulo={getNivelTitle(nivelSubido)}
          onClose={() => setShowLevelUp(false)}
        />
      )}
    </div>
  );
}

// src/pages/Create.jsx
import React, { useState } from "react";
import "./Create.css";

import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { useNotifications } from "../hooks/useNotifications";

import { syncCreateTaskCalendar } from "../utils/taskCalendarSync";

export default function Create() {
  const [tab, setTab] = useState("tarea");

  const { user } = useAuth();
  const { settings } = useSettings();
  const { notify } = useNotifications();

  // Estados intención
  const [intencion, setIntencion] = useState("");
  const [motivoIntencion, setMotivoIntencion] = useState("");

  // Estados tarea
  const [tarea, setTarea] = useState("");
  const [categoria, setCategoria] = useState("Personal");
  const [fechaLimite, setFechaLimite] = useState("");
  const [horaLimite, setHoraLimite] = useState("");
  const [prioridad, setPrioridad] = useState("Media");

  // Logro
  const [logro, setLogro] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  /* ----------------------------------------
     HISTORIAL
  ---------------------------------------- */
  const guardarEnHistorial = async (tipo, payload) => {
    await addDoc(collection(db, "historial"), {
      tipo,
      ...payload,
      fecha: Timestamp.now(),
    });
  };

  /* ----------------------------------------
     🔥 GUARDAR INTENCIÓN — FASE 8
  ---------------------------------------- */
  const guardarIntencion = async () => {
    if (!intencion.trim()) {
      setMensaje("Escribe tu intención antes de guardar.");
      return;
    }

    setGuardando(true);

    try {
      await addDoc(collection(db, "intenciones"), {
        texto: intencion,
        motivo: motivoIntencion || "",
        fecha: Timestamp.now(),
        archivado: false,
      });

      await guardarEnHistorial("intencion", {
        texto: intencion,
        motivo: motivoIntencion || "",
      });

      // 🔔 FASE 8 — NOTIFICACIÓN
      if (settings.notificationsEnabled) {
        notify({
          title: "✨ Intención guardada",
          body: "Excelente decisión. Hoy estás renaciendo con propósito.",
          delay: 400,
        });
      }

      // 📳 Vibración
      if (settings.hapticFeedback && navigator.vibrate) {
        navigator.vibrate(20);
      }

      setIntencion("");
      setMotivoIntencion("");
      setMensaje("Intención guardada ✔");
    } catch (err) {
      console.error(err);
      setMensaje("Error guardando intención.");
    }

    setGuardando(false);
  };

  /* ----------------------------------------
     GUARDAR TAREA
  ---------------------------------------- */
  const guardarTarea = async () => {
    if (!tarea.trim()) {
      setMensaje("Escribe una tarea antes de guardar.");
      return;
    }

    setGuardando(true);

    try {
      const taskPayload = {
        title: tarea,
        description: "",
        completed: false,
        category: categoria,
        priority: prioridad,
        deadlineDate: fechaLimite || null,
        deadlineTime: horaLimite || null,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "tasks"), taskPayload);

      if (user && taskPayload.deadlineDate) {
        const eventId = await syncCreateTaskCalendar(
          { ...taskPayload, id: docRef.id },
          user
        );

        if (eventId) {
          await updateDoc(docRef, { calendarEventId: eventId });
        }
      }

      await guardarEnHistorial("tarea", {
        titulo: tarea,
        categoria,
        fechaLimite,
        horaLimite,
      });

      setTarea("");
      setCategoria("Personal");
      setFechaLimite("");
      setHoraLimite("");
      setPrioridad("Media");

      setMensaje("Tarea guardada ✔");
    } catch (err) {
      console.error(err);
      setMensaje("Error guardando tarea.");
    }

    setGuardando(false);
  };

  /* ----------------------------------------
     GUARDAR LOGRO
  ---------------------------------------- */
  const guardarLogro = async () => {
    if (!logro.trim()) {
      setMensaje("Describe tu logro antes de guardar.");
      return;
    }

    setGuardando(true);

    try {
      await addDoc(collection(db, "logros"), {
        texto: logro,
        fecha: Timestamp.now(),
      });

      await guardarEnHistorial("logro", { texto: logro });

      setLogro("");
      setMensaje("Logro guardado ✔");
    } catch (err) {
      setMensaje("Error guardando logro.");
    }

    setGuardando(false);
  };

  /* ----------------------------------------
     RENDER
  ---------------------------------------- */
  return (
    <div className="page-wrapper-create">
      {/* TABS */}
      <div className="create-tabs-row">
        <button
          className={`create-tab ${
            tab === "intencion" ? "create-tab-active" : ""
          }`}
          onClick={() => setTab("intencion")}
        >
          Intención
        </button>

        <button
          className={`create-tab ${
            tab === "tarea" ? "create-tab-active" : ""
          }`}
          onClick={() => setTab("tarea")}
        >
          Tarea
        </button>

        <button
          className={`create-tab ${
            tab === "logro" ? "create-tab-active" : ""
          }`}
          onClick={() => setTab("logro")}
        >
          Logro
        </button>
      </div>

      {mensaje && <p className="create-message">{mensaje}</p>}

      {/* INTENCIÓN */}
      {tab === "intencion" && (
        <div className="create-card">
          <label className="create-label">¿Cuál es tu intención de hoy?</label>

          <textarea
            className="create-textarea"
            value={intencion}
            onChange={(e) => setIntencion(e.target.value)}
            placeholder="Escribe aquí tu intención..."
          />

          <label className="create-label">¿Por qué es importante?</label>

          <textarea
            className="create-textarea"
            value={motivoIntencion}
            onChange={(e) => setMotivoIntencion(e.target.value)}
            placeholder="¿Cómo te beneficia cumplir esta intención?"
          />

          <button
            className="create-primary-button"
            onClick={guardarIntencion}
            disabled={guardando}
          >
            Guardar intención
          </button>
        </div>
      )}

      {/* TAREA */}
      {tab === "tarea" && (
        <div className="create-card">
          <label className="create-label">Nueva tarea</label>

          <textarea
            className="create-textarea"
            value={tarea}
            onChange={(e) => setTarea(e.target.value)}
            placeholder="Describe la tarea..."
          />

          <label className="create-label">Categoría</label>
          <select
            className="create-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option>Personal</option>
            <option>Trabajo</option>
            <option>Salud</option>
            <option>Estudio</option>
            <option>Renace</option>
          </select>

          <label className="create-label">Fecha límite</label>
          <input
            type="date"
            className="create-input"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
          />

          <label className="create-label">Hora límite</label>
          <input
            type="time"
            className="create-input"
            value={horaLimite}
            onChange={(e) => setHoraLimite(e.target.value)}
          />

          <label className="create-label">Prioridad</label>
          <select
            className="create-select"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
          >
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>

          <button
            className="create-primary-button"
            onClick={guardarTarea}
            disabled={guardando}
          >
            Guardar tarea
          </button>
        </div>
      )}

      {/* LOGRO */}
      {tab === "logro" && (
        <div className="create-card">
          <label className="create-label">Nuevo logro</label>

          <textarea
            className="create-textarea"
            value={logro}
            onChange={(e) => setLogro(e.target.value)}
            placeholder="Escribe tu logro aquí..."
          />

          <button
            className="create-primary-button"
            onClick={guardarLogro}
            disabled={guardando}
          >
            Guardar logro
          </button>
        </div>
      )}
    </div>
  );
}

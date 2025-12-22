// src/pages/ObjectiveMain.jsx
import React, { useState, useEffect } from "react";
import "./ObjectiveMain.css";

import { db } from "../firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { registerActivity } from "../utils/registerActivity";

/* --------------------------------------------------
   MODAL PREMIUM PARA EDITAR OBJETIVO CENTRAL
-------------------------------------------------- */
function EditObjectiveModal({ isOpen, onClose, objective, why, onSave }) {
  const [newObjective, setNewObjective] = useState(objective);
  const [newWhy, setNewWhy] = useState(why);

  useEffect(() => {
    setNewObjective(objective);
    setNewWhy(why);
  }, [objective, why]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Editar objetivo central</h2>

        <label className="modal-label">Tu objetivo</label>
        <textarea
          className="modal-input"
          value={newObjective}
          onChange={(e) => setNewObjective(e.target.value)}
          placeholder="Escribe tu objetivo principal…"
        />

        <label className="modal-label">¿Por qué este objetivo?</label>
        <textarea
          className="modal-input"
          value={newWhy}
          onChange={(e) => setNewWhy(e.target.value)}
          placeholder="¿Qué te motiva? ¿Qué deseas lograr?"
        />

        <button
          className="modal-save-btn"
          onClick={() => onSave(newObjective, newWhy)}
        >
          Guardar cambios
        </button>

        <button className="modal-cancel-btn" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   MODAL PREMIUM PARA AÑADIR NUEVO PASO
-------------------------------------------------- */
function AddStepModal({ isOpen, onClose, onAdd }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (isOpen) setText("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Añadir paso</h2>

        <label className="modal-label">
          ¿Qué acción concreta quieres sumar?
        </label>
        <textarea
          className="modal-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ej: Leer 10 minutos al día, ahorrar X monto semanal, etc…"
        />

        <button
          className="modal-save-btn"
          onClick={() => {
            if (!text.trim()) return;
            onAdd(text.trim());
          }}
        >
          Añadir paso
        </button>

        <button className="modal-cancel-btn" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   PANTALLA PRINCIPAL OBJECTIVEMAIN
-------------------------------------------------- */
export default function ObjectiveMain({ onNavigate }) {
  const { user } = useAuth();
  const userId = user?.uid || null;

  const [loaded, setLoaded] = useState(false);

  const [objective, setObjective] = useState("");
  const [why, setWhy] = useState("");
  const [progress, setProgress] = useState(0);
  const [subSteps, setSubSteps] = useState([]);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const [motivation, setMotivation] = useState("");

  const motivationPhrases = [
    "Cada pequeño paso que des hacia “{objective}” importa.",
    "Tu disciplina de hoy sostiene el futuro que deseas.",
    "Aunque avances lento, sigues avanzando hacia “{objective}”.",
    "Lo que hoy parece pequeño mañana será parte de tu gran logro.",
    "No estás empezando de cero, estás empezando desde tu experiencia.",
    "Recordar tu objetivo te ayuda a tomar mejores decisiones hoy.",
    "Estás construyendo una vida más alineada contigo.",
    "Tu objetivo es una promesa que te haces a ti mismo.",
    "Cada vez que eliges avanzar, honras tu intención.",
    "Tu constancia es el puente entre tu realidad actual y “{objective}”.",
  ];

  /* ------------------------------------------
     CARGAR DESDE FIRESTORE SOLO PARA EL USER
  ------------------------------------------ */
  useEffect(() => {
    if (!userId) return;

    const objetivoRef = doc(db, "users", userId, "data", "objetivoCentral");

    const unsub = onSnapshot(objetivoRef, async (snap) => {
      if (!snap.exists()) {
        await setDoc(objetivoRef, {
          userId,
          objective: "Crear una vida más organizada y enfocada",
          why: "Quiero sentir claridad y disciplina.",
          progress: 0,
          subSteps: [
            { id: 1, text: "Definir mi rutina de mañana", done: false },
            { id: 2, text: "Completar 5 tareas del día", done: false },
            { id: 3, text: "Escribir mi intención diaria", done: false },
          ],
        });

        return;
      }

      const d = snap.data();
      setObjective(d.objective);
      setWhy(d.why);
      setProgress(d.progress);
      setSubSteps(d.subSteps || []);
      setLoaded(true);
    });

    return () => unsub();
  }, [userId]);

  /* ------------------------------------------
     FRASE MOTIVACIONAL PERSONALIZADA
  ------------------------------------------ */
  useEffect(() => {
    if (!objective) return;
    const phrase =
      motivationPhrases[
        Math.floor(Math.random() * motivationPhrases.length)
      ];
    setMotivation(phrase.replace("{objective}", objective));
  }, [objective]);

  /* ------------------------------------------
     SNAPSHOT MENSUAL POR USUARIO
  ------------------------------------------ */
  useEffect(() => {
    if (!loaded || !userId) return;

    async function ensureMonthlySnapshot() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const monthKey = `${year}-${month}`;

      const histRef = doc(
        db,
        "users",
        userId,
        "historialObjetivos",
        monthKey
      );

      const snap = await getDoc(histRef);
      if (snap.exists()) return;

      const totalPasos = subSteps.length;
      const completados = subSteps.filter((s) => s.done).length;

      await setDoc(histRef, {
        userId,
        objective,
        why,
        progresoFinal: progress,
        totalPasos,
        completados,
        fechaGenerado: now,
      });
    }

    ensureMonthlySnapshot();
  }, [loaded, userId, objective, why, progress, subSteps]);

  /* ------------------------------------------
     ACTUALIZAR PASOS / PROGRESO
  ------------------------------------------ */
  const recomputeProgressAndSave = async (updatedSteps) => {
    if (!userId) return;

    const objetivoRef = doc(db, "users", userId, "data", "objetivoCentral");

    const done = updatedSteps.filter((i) => i.done).length;
    const pct =
      updatedSteps.length > 0
        ? Math.round((done / updatedSteps.length) * 100)
        : 0;

    setSubSteps(updatedSteps);
    setProgress(pct);

    await updateDoc(objetivoRef, {
      subSteps: updatedSteps,
      progress: pct,
    });
  };

  const toggleStep = async (id) => {
    const updated = subSteps.map((s) =>
      s.id === id ? { ...s, done: !s.done } : s
    );
    await recomputeProgressAndSave(updated);
  };

  const addStep = async (text) => {
    const maxId = subSteps.reduce((max, s) => Math.max(max, s.id || 0), 0);
    const newStep = { id: maxId + 1, text, done: false };
    const updated = [...subSteps, newStep];
    await recomputeProgressAndSave(updated);
    setOpenAddModal(false);
  };

  /* ------------------------------------------
     GUARDAR CAMBIOS DEL OBJETIVO
  ------------------------------------------ */
  const updateObjective = async (newObj, newWhy) => {
    if (!userId) return;

    const objetivoRef = doc(db, "users", userId, "data", "objetivoCentral");

    await updateDoc(objetivoRef, {
      objective: newObj,
      why: newWhy,
    });

    await registerActivity({
      userId,
      tipo: "objetivo_actualizado",
      descripcion: "Objetivo actualizado",
      titulo: newObj,
    });

    setOpenEditModal(false);
  };

  /* ------------------------------------------
     UI PARA INVITADO
  ------------------------------------------ */
  if (!userId) {
    return (
      <div className="objective-page objective-loading">
        <header className="objective-header">
          <button className="back-btn" onClick={() => onNavigate("profile")}>
            ←
          </button>
          <div className="objective-header-text">
            <h1>Objetivo central</h1>
          </div>
        </header>

        <div className="objective-card objective-guest-card">
          <p>
            Para definir y seguir tu objetivo central, inicia sesión desde el perfil.
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------
     LOADING
  ------------------------------------------ */
  if (!loaded) {
    return (
      <div className="objective-page objective-loading">
        Cargando...
      </div>
    );
  }

  /* ------------------------------------------
     RENDER NORMAL
  ------------------------------------------ */
  return (
    <div className="objective-page">
      <header className="objective-header">
        <button className="back-btn" onClick={() => onNavigate("profile")}>
          ←
        </button>
        <div className="objective-header-text">
          <h1>Objetivo central</h1>
          <p>Tu norte principal, claro y aterrizado.</p>
        </div>
      </header>

      <div className="objective-card">
        <div className="progress-circle">
          <svg className="progress-svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <circle className="bg" cx="70" cy="70" r="56" />
            <circle
              className="bar"
              cx="70"
              cy="70"
              r="56"
              style={{
                strokeDasharray: 352,
                strokeDashoffset: 352 - (352 * progress) / 100,
              }}
            />
          </svg>
          <div className="progress-value">{progress}%</div>
        </div>

        <h2 className="objective-title">{objective}</h2>
        <p className="objective-why">“{why}”</p>

        <button
          className="edit-objective-btn"
          onClick={() => setOpenEditModal(true)}
        >
          Editar objetivo
        </button>
      </div>

      <section className="steps-section">
        <div className="steps-header-row">
          <h3>Pasos para lograrlo</h3>
          <button
            className="add-step-btn"
            onClick={() => setOpenAddModal(true)}
          >
            +
          </button>
        </div>

        <div className="steps-list">
          {subSteps.length === 0 && (
            <p className="steps-empty">
              Aún no has definido pasos. Empieza añadiendo una acción concreta.
            </p>
          )}

          {subSteps.map((step) => (
            <button
              key={step.id}
              className={`step-card ${step.done ? "done" : ""}`}
              onClick={() => toggleStep(step.id)}
            >
              <span className="check">{step.done ? "✔" : "○"}</span>
              <p>{step.text}</p>
            </button>
          ))}
        </div>
      </section>

      {motivation && (
        <section className="motivation-section">
          <div className="motivation-card">
            <span className="motivation-icon">✨</span>
            <p className="motivation-text">{motivation}</p>
          </div>
        </section>
      )}

      <EditObjectiveModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        objective={objective}
        why={why}
        onSave={updateObjective}
      />

      <AddStepModal
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={addStep}
      />
    </div>
  );
}

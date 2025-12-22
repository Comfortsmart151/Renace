// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import "./Profile.css";

import { useAuth } from "../context/AuthContext";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import EditProfileModal from "../components/EditProfileModal";

// FIREBASE LOGIN PROVIDERS
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function Profile({ onNavigate }) {
  const { user, logout } = useAuth();

  /* =======================================================
     0) LOGIN BUTTON HANDLERS
  ======================================================= */
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      // opcional: feedback o toast
    } catch (err) {
      console.error("❌ Google login error:", err);
      alert("No se pudo iniciar sesión con Google.");
    }
  };

  const loginWithApple = async () => {
    try {
      const provider = new OAuthProvider("apple.com");
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("❌ Apple login error:", err);
      alert("No se pudo iniciar sesión con Apple.");
    }
  };

  /* =======================================================
     1) PERFIL LOCAL (SIEMPRE)
  ======================================================= */
  const getLocalProfile = () => {
    try {
      const stored = localStorage.getItem("renace_profile");
      return stored
        ? JSON.parse(stored)
        : {
            nombre: "Usuario",
            tagline: "Construyendo una vida con intención.",
            avatarUrl: null,
            email: "",
          };
    } catch {
      return {
        nombre: "Usuario",
        tagline: "Construyendo una vida con intención.",
        avatarUrl: null,
        email: "",
      };
    }
  };

  const [perfil, setPerfil] = useState(getLocalProfile());
  const [openEdit, setOpenEdit] = useState(false);

  const [daysActive, setDaysActive] = useState(0);
  const [intencionesCount, setIntencionesCount] = useState(0);
  const [tareasHoy, setTareasHoy] = useState(0);
  const [tareasCompletadasTotal, setTareasCompletadasTotal] = useState(0);
  const [retosCompletados, setRetosCompletados] = useState(0);
  const [lastIntention, setLastIntention] = useState("");

  /* =======================================================
     2) PERFIL FIRESTORE SOLO SI HAY USER
  ======================================================= */
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "data", "perfil");

    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const cloud = snap.data();

        const merged = {
          ...perfil,
          ...cloud,
          email: user.email,
        };

        setPerfil(merged);
        localStorage.setItem("renace_profile", JSON.stringify(merged));
      } else {
        const newData = {
          nombre: user.displayName || perfil.nombre,
          tagline: perfil.tagline,
          avatarUrl: user.photoURL || perfil.avatarUrl,
          email: user.email,
        };

        setPerfil(newData);
        localStorage.setItem("renace_profile", JSON.stringify(newData));
      }
    });

    return () => unsubscribe();
  }, [user]);

  /* =======================================================
     3) AUTO-GUARDAR LOCAL
  ======================================================= */
  useEffect(() => {
    localStorage.setItem("renace_profile", JSON.stringify(perfil));
  }, [perfil]);

  /* =======================================================
     4) ÚLTIMA INTENCIÓN
  ======================================================= */
  useEffect(() => {
    if (!user) return;

    const col = collection(db, "intenciones");
    const unsub = onSnapshot(col, (snap) => {
      setIntencionesCount(snap.size);

      let last = null;

      snap.forEach((doc) => {
        const d = doc.data();
        if (!d.fecha) return;

        const date = d.fecha.toDate ? d.fecha.toDate() : new Date(d.fecha);

        if (!last || date > last.fecha) {
          last = {
            texto: d.intencion || d.texto || "",
            fecha: date,
          };
        }
      });

      setLastIntention(last?.texto || "Aún no has escrito tu intención.");
    });

    return () => unsub();
  }, [user]);

  /* =======================================================
     5) TAREAS
  ======================================================= */
  useEffect(() => {
    if (!user) return;

    const col = collection(db, "tasks");
    const unsub = onSnapshot(col, (snap) => {
      const today = new Date().toISOString().slice(0, 10);

      let hoy = 0;
      let total = 0;

      snap.forEach((doc) => {
        const d = doc.data();
        if (d.completed) {
          total++;
          const created = d.createdAt?.toDate?.() || new Date(d.createdAt);
          if (created.toISOString().slice(0, 10) === today) hoy++;
        }
      });

      setTareasHoy(hoy);
      setTareasCompletadasTotal(total);
    });

    return () => unsub();
  }, [user]);

  /* =======================================================
     6) RETOS
  ======================================================= */
  useEffect(() => {
    if (!user) return;

    const col = collection(db, "retos");
    const unsub = onSnapshot(col, (snap) => {
      let total = 0;

      snap.forEach((doc) => {
        const d = doc.data();
        if (d.status === "completado" || d.estado === "completado") total++;
      });

      setRetosCompletados(total);
    });

    return () => unsub();
  }, [user]);

  /* =======================================================
     7) DÍAS ACTIVOS
  ======================================================= */
  useEffect(() => {
    if (!user) return;

    const col = collection(db, "historial");
    const unsub = onSnapshot(col, (snap) => {
      const set = new Set();

      snap.forEach((doc) => {
        const d = doc.data()?.fecha?.toDate?.();
        if (d) set.add(d.toISOString().slice(0, 10));
      });

      setDaysActive(set.size);
    });

    return () => unsub();
  }, [user]);

  /* =======================================================
     8) NIVEL RENACE
  ======================================================= */
  const puntos =
    intencionesCount * 5 +
    tareasCompletadasTotal * 10 +
    retosCompletados * 25 +
    daysActive * 2;

  const level = Math.floor(puntos / 100) + 1;
  const pct = Math.min(100, puntos % 100);
  const faltan = 100 - pct;

  /* =======================================================
     AVATAR
  ======================================================= */
  const renderAvatar = () => {
    if (perfil.avatarUrl)
      return (
        <img
          src={perfil.avatarUrl}
          className="big-avatar profile-avatar-img"
          onClick={() => setOpenEdit(true)}
        />
      );

    return (
      <div className="big-avatar" onClick={() => setOpenEdit(true)}>
        {perfil.nombre?.charAt(0)?.toUpperCase()}
      </div>
    );
  };

  /* =======================================================
     🟣 UI DEL INVITADO — LOGIN VIEW
  ======================================================= */
  if (!user) {
    return (
      <div className="profile-page guest-center">
        <div className="guest-card">
          <h2 className="guest-title">Perfil</h2>
          <p className="guest-sub">
            Inicia sesión para sincronizar tu progreso
            y guardar tus avances en la nube.
          </p>

          <button className="login-btn google" onClick={loginWithGoogle}>
            🟣 Continuar con Google
          </button>

          <button className="login-btn apple" onClick={loginWithApple}>
             Continuar con Apple
          </button>

          <button
            className="login-btn settings-nav"
            onClick={() => onNavigate("settings")}
          >
            Ir a ajustes / vincular cuenta
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     UI PARA USUARIOS LOGGEADOS
  ======================================================= */
  return (
    <div className="profile-page">
      <div className="split-header-card">
        <button
          className="settings-button-top"
          onClick={() => onNavigate("settings")}
        >
          ⚙️
        </button>

        {renderAvatar()}

        <h1 className="profile-name" onClick={() => setOpenEdit(true)}>
          {perfil.nombre}
        </h1>

        {perfil.email && <p className="profile-email">{perfil.email}</p>}

        <p className="profile-tagline">{perfil.tagline}</p>

        <button className="edit-inline-btn" onClick={() => setOpenEdit(true)}>
          Editar nombre y foto
        </button>
      </div>

      {/* NIVEL */}
      <div className="profile-level-card">
        <h3 className="level-title">Nivel Renace</h3>
        <p className="level-subtitle">
          Nivel {level} · {puntos} pts
        </p>

        <div className="profile-xp-bar">
          <div className="profile-xp-bar-fill" style={{ width: `${pct}%` }} />
        </div>

        <p className="profile-xp-helper">
          Te faltan <span className="profile-xp-strong">{faltan}</span> pts
          para subir de nivel.
        </p>
      </div>

      {/* PROGRESO PERSONAL */}
      <section className="profile-section">
        <div className="profile-section-header">
          <h2>Progreso personal</h2>
          <p>Resumen rápido de tu avance.</p>
        </div>

        <div className="progress-grid">
          <button className="progress-card" onClick={() => onNavigate("dailyIntention")}>
            <span className="progress-icon">✨</span>
            <p className="progress-title">Intención del día</p>
            <p className="progress-desc">“{lastIntention}”</p>
          </button>

          <button className="progress-card" onClick={() => onNavigate("tasks")}>
            <span className="progress-icon">✅</span>
            <p className="progress-title">Tareas hoy</p>
            <p className="progress-number">{tareasHoy}</p>
          </button>

          <button className="progress-card" onClick={() => onNavigate("challengeProgress")}>
            <span className="progress-icon">🎯</span>
            <p className="progress-title">Retos</p>
            <p className="progress-number">{retosCompletados}</p>
          </button>

          <button className="progress-card" onClick={() => onNavigate("activeDays")}>
            <span className="progress-icon">📅</span>
            <p className="progress-title">Actividad</p>
            <p className="progress-number">{daysActive}</p>
          </button>
        </div>
      </section>

      {/* ACCIONES PREMIUM */}
      <section className="profile-section">
        <div className="profile-section-header">
          <h2>Acciones premium</h2>
          <p>Atajos diseñados para tu crecimiento.</p>
        </div>

        <div className="actions-grid">
          <button className="action-card" onClick={() => onNavigate("objectiveMain")}>
            <div className="action-header">
              <span className="action-icon">🎯</span>
              <span className="action-title">Objetivo central</span>
            </div>
            <p className="action-desc">Define y sigue tu gran enfoque.</p>
          </button>

          <button className="action-card" onClick={() => onNavigate("historial-objetivo")}>
            <div className="action-header">
              <span className="action-icon">📊</span>
              <span className="action-title">Historial objetivo</span>
            </div>
            <p className="action-desc">Tu evolución mensual.</p>
          </button>

          <button className="action-card" onClick={() => onNavigate("retos")}>
            <div className="action-header">
              <span className="action-icon">🔥</span>
              <span className="action-title">Reto personal</span>
            </div>
            <p className="action-desc">Supera tus límites.</p>
          </button>

          <button className="action-card" onClick={() => onNavigate("settings")}>
            <div className="action-header">
              <span className="action-icon">⚙️</span>
              <span className="action-title">Ajustes</span>
            </div>
            <p className="action-desc">Tema, sonidos y más.</p>
          </button>
        </div>
      </section>

      {/* LOGOUT */}
      {user && (
        <div className="logout-area">
          <button className="logout-btn" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      )}

      {/* MODAL */}
      {openEdit && (
        <EditProfileModal
          onClose={() => setOpenEdit(false)}
          perfil={perfil}
          setPerfil={setPerfil}
          user={user}
        />
      )}
    </div>
  );
}

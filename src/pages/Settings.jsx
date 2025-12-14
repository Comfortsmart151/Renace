// src/pages/Settings.jsx — ULTRA PREMIUM v13 (solo modo oscuro)
import React, { useEffect, useState } from "react";
import "./Settings.css";

// Hooks / Context
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";

// 🔔 Notificaciones
import { useNotifications } from "../hooks/useNotifications";

// Firebase
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Components Ultra Premium
import SettingsSection from "../components/SettingsSection";
import SettingsCard from "../components/SettingsCard";
import SettingsToggle from "../components/SettingsToggle";
import SettingAccentSelector from "../components/AccentSelector";

// Google utils
import {
  loadGapiScript,
  initGapiClient,
  initTokenClient,
  requestCalendarAccess,
} from "../utils/googleCalendar";

// SFX
import { playCompleteSound } from "../utils/sfx";

export default function Settings({ onNavigate }) {
  const { settings, toggleSetting, updateSetting } = useSettings();
  const { user, loading: initializing, login, logout } = useAuth();
  const { enableNotifications, notify } = useNotifications();

  const [calendarStatus, setCalendarStatus] = useState("disconnected");
  const [cloudStatus, setCloudStatus] = useState("disconnected");
  const [scrolled, setScrolled] = useState(false);

  /* --------------------------------------------------------------
     HEADER SCROLL BLUR
  -------------------------------------------------------------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* --------------------------------------------------------------
     Cargar estado inicial Calendar + Backup
  -------------------------------------------------------------- */
  useEffect(() => {
    if (!user) {
      setCalendarStatus("disconnected");
      setCloudStatus("disconnected");
      return;
    }

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setCalendarStatus(
            data.calendarConnected ? "connected" : "disconnected"
          );
          setCloudStatus(
            data.cloudBackupEnabled ? "connected" : "disconnected"
          );
        } else {
          setCloudStatus("connected");
        }
      } catch (err) {
        console.warn("Error cargando flags:", err);
      }
    };

    load();
  }, [user]);

  /* --------------------------------------------------------------
     🧘 MODO ENFOQUE — EFECTO MAESTRO
  -------------------------------------------------------------- */
  useEffect(() => {
    if (settings.focusMode) {
      updateSetting("blockNotifications", true);
      updateSetting("subtleSounds", false);
      updateSetting("hapticFeedback", false);
    }
  }, [settings.focusMode]);

  /* --------------------------------------------------------------
     HAPTIC FEEDBACK (respeta enfoque)
  -------------------------------------------------------------- */
  const haptic = () => {
    if (
      settings.hapticFeedback &&
      !settings.focusMode &&
      window?.navigator?.vibrate
    ) {
      window.navigator.vibrate(12);
    }
  };

  /* --------------------------------------------------------------
     LOGIN GOOGLE
  -------------------------------------------------------------- */
  const handleConnectAccount = async () => {
    try {
      await login();
      const u = auth.currentUser;
      if (!u) return alert("No se pudo obtener el usuario.");

      await setDoc(
        doc(db, "users", u.uid),
        {
          email: u.email,
          displayName: u.displayName || "",
          photoURL: u.photoURL || "",
          cloudBackupEnabled: true,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setCloudStatus("connected");
      haptic();
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar a Google.");
    }
  };

  /* --------------------------------------------------------------
     LOGOUT
  -------------------------------------------------------------- */
  const handleDisconnectAccount = async () => {
    const ok = window.confirm("¿Cerrar sesión?");
    if (!ok) return;

    try {
      await logout();
      setCloudStatus("disconnected");
      setCalendarStatus("disconnected");
      haptic();
    } catch (err) {
      console.error(err);
      alert("No se pudo cerrar sesión.");
    }
  };

  /* --------------------------------------------------------------
     GOOGLE CALENDAR
  -------------------------------------------------------------- */
  const handleConnectCalendar = async () => {
    if (!user) return alert("Primero conecta tu cuenta.");

    try {
      setCalendarStatus("loading");

      await loadGapiScript();
      await initGapiClient();
      await initTokenClient();
      const token = await requestCalendarAccess();

      if (!token) {
        setCalendarStatus("disconnected");
        return alert("No se pudo autorizar Calendar.");
      }

      await setDoc(
        doc(db, "users", user.uid),
        { calendarConnected: true, updatedAt: new Date().toISOString() },
        { merge: true }
      );

      setCalendarStatus("connected");
      haptic();
      alert("Google Calendar conectado correctamente.");
    } catch (err) {
      console.error(err);
      setCalendarStatus("disconnected");
      alert("Error conectando Google Calendar.");
    }
  };

  /* --------------------------------------------------------------
     Borrar datos
  -------------------------------------------------------------- */
  const handleClearData = async () => {
    const ok = window.confirm("Esto borrará datos locales. ¿Continuar?");
    if (!ok) return;

    localStorage.clear();

    if (indexedDB?.databases) {
      const dbs = await indexedDB.databases();
      dbs.forEach((dbInfo) => indexedDB.deleteDatabase(dbInfo.name));
    }

    window.location.reload();
  };

  /* --------------------------------------------------------------
     ❌ Eliminado sonido al togglear
     ✔ El sonido se dispara SOLO en acciones reales
  -------------------------------------------------------------- */

  /* ==========================================================
     RENDER ULTRA PREMIUM
  ========================================================== */
  return (
    <div className="settings-page">
      {/* HEADER */}
      <header
        className={`settings-header-premium ${
          scrolled ? "settings-header-scrolled" : ""
        }`}
      >
        <div className="settings-header-glow" />

        <div className="settings-header-top">
          <button
            className="settings-back-chip"
            onClick={() => {
              const page = document.querySelector(".settings-page");
              page.classList.add("settings-exit");
              setTimeout(() => onNavigate("profile"), 260);
            }}
          >
            ← Volver
          </button>

          <span className="settings-badge">Centro de ajustes</span>
        </div>

        <h1 className="settings-title-premium">Ajustes de Renace</h1>
        <p className="settings-subtitle-premium">
          Personaliza tu experiencia para renacer cada día.
        </p>
      </header>

      {/* APARIENCIA */}
      <SettingsSection title="Apariencia">
        <SettingsCard>
          <p className="settings-card-title">Color de acento</p>
          <SettingAccentSelector
            value={settings.accent}
            onChange={(v) => {
              updateSetting("accent", v);
              haptic();
            }}
          />
        </SettingsCard>
      </SettingsSection>

      {/* 🔔 NOTIFICACIONES */}
      <SettingsSection title="Notificaciones">
        <SettingsCard>
          <div className="settings-card-row">
            <div>
              <p className="settings-card-title">Activar notificaciones</p>
              <p className="settings-card-sub">
                Recordatorios, intención del día y motivación
              </p>
            </div>

            <SettingsToggle
              value={
                settings.notificationsEnabled &&
                !settings.blockNotifications
              }
              disabled={settings.focusMode}
              onToggle={async () => {
                if (settings.focusMode) {
                  alert("El modo enfoque bloquea notificaciones.");
                  return;
                }

                if (settings.notificationsEnabled) {
                  updateSetting("notificationsEnabled", false);
                  haptic();
                  return;
                }

                const ok = await enableNotifications();
                haptic();

                if (!ok) {
                  alert(
                    "Las notificaciones están bloqueadas en el navegador.\n\n" +
                      "Actívalas desde el ícono 🔒 > Notificaciones."
                  );
                  return;
                }

                updateSetting("notificationsEnabled", true);

                notify({
                  title: "🔔 Notificaciones activadas",
                  body: "Renace te acompañará durante el día.",
                  delay: 1200,
                });
              }}
            />
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* RECORDATORIOS */}
      <SettingsSection title="Recordatorios">
        <SettingsCard>
          <div className="settings-card-row">
            <p className="settings-card-title">Recordatorios diarios</p>
            <SettingsToggle
              value={settings.dailyReminders}
              onToggle={() => toggleSetting("dailyReminders")}
            />
          </div>
        </SettingsCard>

        <SettingsCard>
          <div className="settings-card-row">
            <p className="settings-card-title">Resumen semanal</p>
            <SettingsToggle
              value={settings.weeklySummary}
              onToggle={() => toggleSetting("weeklySummary")}
            />
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* 🧘 MODO ENFOQUE */}
      <SettingsSection title="Modo enfoque">
        <SettingsCard>
          <div className="settings-card-row">
            <p className="settings-card-title">Activar modo enfoque</p>
            <SettingsToggle
              value={settings.focusMode}
              onToggle={() => toggleSetting("focusMode")}
            />
          </div>
        </SettingsCard>

        <SettingsCard>
          <div className="settings-card-row">
            <p className="settings-card-title">Bloquear notificaciones</p>
            <SettingsToggle
              value={settings.blockNotifications}
              disabled={settings.focusMode}
              onToggle={() => toggleSetting("blockNotifications")}
            />
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* 🔊 SONIDO Y FEEDBACK */}
      <SettingsSection title="Sonido y feedback">
        <SettingsCard>
          <div className="settings-card-row">
            <p className="settings-card-title">Sonidos sutiles</p>
            <SettingsToggle
              value={settings.subtleSounds}
              disabled={settings.focusMode}
              onToggle={() => toggleSetting("subtleSounds")}
            />
          </div>
        </SettingsCard>

        <SettingsCard>
          <div className="settings-card-row">
            <p className="settings-card-title">Vibración</p>
            <SettingsToggle
              value={settings.hapticFeedback}
              disabled={settings.focusMode}
              onToggle={() => toggleSetting("hapticFeedback")}
            />
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* CUENTA Y SINCRONIZACIÓN */}
      <SettingsSection title="Cuenta y sincronización">
        <SettingsCard>
          <div className="settings-card-row">
            <div>
              <p className="settings-list-title">
                {user ? "Cuenta conectada" : "Conectar cuenta"}
              </p>
              {user && <p className="settings-list-sub">{user.email}</p>}
            </div>

            {!initializing &&
              (user ? (
                <button
                  className="settings-list-pill"
                  onClick={handleDisconnectAccount}
                >
                  Cerrar sesión
                </button>
              ) : (
                <button
                  className="settings-list-pill"
                  onClick={handleConnectAccount}
                >
                  Conectar con Google
                </button>
              ))}
          </div>
        </SettingsCard>

        <SettingsCard>
          <div className="settings-card-row">
            <p className="settings-list-title">Google Calendar</p>

            {!user ? (
              <span className="settings-list-pill">Conecta tu cuenta</span>
            ) : calendarStatus === "loading" ? (
              <span className="settings-list-pill">Cargando…</span>
            ) : calendarStatus === "connected" ? (
              <span className="settings-list-pill">Conectado</span>
            ) : (
              <button
                className="settings-list-pill"
                onClick={handleConnectCalendar}
              >
                Conectar
              </button>
            )}
          </div>
        </SettingsCard>

        <SettingsCard>
          <div className="settings-card-row">
            <p className="settings-list-title">Respaldo en la nube</p>
            <span className="settings-list-pill">
              {cloudStatus === "connected" && user
                ? "Activo"
                : "Disponible al conectar cuenta"}
            </span>
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* PRIVACIDAD */}
      <SettingsSection title="Datos y privacidad" variant="danger">
        <SettingsCard variant="danger">
          <p className="settings-card-title">Borrar datos locales</p>
          <button
            className="settings-danger-button-premium"
            onClick={handleClearData}
          >
            Borrar datos
          </button>
        </SettingsCard>
      </SettingsSection>
    </div>
  );
}

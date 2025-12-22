// src/MainApp.jsx
import React, { useState, useEffect } from "react";

/* ================================
   CONTEXTOS
================================ */
import { useSettings } from "./context/SettingsContext";
import { useNotifications } from "./hooks/useNotifications";

/* ================================
   PÁGINAS BASE
================================ */
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Retos from "./pages/Retos";
import Historial from "./pages/Historial";

/* ================================
   PREMIUM EXISTENTES
================================ */
import DailyIntentionPage from "./pages/DailyIntentionPage";
import TaskProgressPage from "./pages/TaskProgressPage";
import ProgresoRetos from "./pages/ProgresoRetos";
import ActiveDaysPage from "./pages/ActividadDias";

/* ================================
   NUEVAS PREMIUM
================================ */
import ObjectiveMain from "./pages/ObjectiveMain";
import HistorialObjetivo from "./pages/HistorialObjetivo";

/* ================================
   COMPONENTES
================================ */
import BottomNav from "./components/BottomNav";
import ToastContainer from "./components/ToastContainer";
import useToasts from "./hooks/useToasts";

/* ================================
   FASE 7 — SCHEDULER DIARIO
================================ */
import { runDailyScheduler } from "./utils/dailyScheduler";

/* ================================
   FIREBASE (FCM – controlado)
================================ */
import {
  requestUserNotificationToken,
  listenToForegroundMessages,
  db,
} from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export default function MainApp() {
  /* ------------------------------------------
     SETTINGS
  ------------------------------------------ */
  const { settings } = useSettings();
  const { notify } = useNotifications();

  /* ------------------------------------------
     NAVEGACIÓN GLOBAL
  ------------------------------------------ */
  const [navigation, setNavigation] = useState({
    tab: "home",
    taskId: null,
  });

  const { tab, taskId } = navigation;

  const { toasts, addToast, removeToast } = useToasts();

  /* ------------------------------------------
     🔔 FASE 7 — HORARIOS AUTOMÁTICOS
  ------------------------------------------ */
  useEffect(() => {
    runDailyScheduler(settings);
  }, [settings]);

  /* ------------------------------------------
     🔔 FASE 9 — RESUMEN SEMANAL (DOMINGO)
  ------------------------------------------ */
  useEffect(() => {
    if (!settings.notificationsEnabled) return;

    const today = new Date();
    const isSunday = today.getDay() === 0; // 0 = domingo
    if (!isSunday) return;

    const year = today.getFullYear();
    const weekNumber = Math.ceil(
      ((today - new Date(year, 0, 1)) / 86400000 + 1) / 7
    );
    const weekKey = `${year}-week-${weekNumber}`;

    const lastSent = localStorage.getItem("renace_weekly_summary");
    if (lastSent === weekKey) return;

    const messages = [
      "Esta semana diste pasos importantes, incluso en silencio.",
      "No fue perfecta, pero fue real. Y eso cuenta.",
      "Cada pequeño avance de esta semana suma a tu proceso.",
      "Seguiste adelante. Eso ya es un logro.",
      "Tu constancia esta semana merece reconocimiento.",
    ];

    const message =
      messages[Math.floor(Math.random() * messages.length)];

    notify({
      title: "🌱 Tu semana en Renace",
      body: message,
      delay: 1200,
    });

    if (settings.hapticFeedback && navigator.vibrate) {
      navigator.vibrate([20, 40, 20]);
    }

    localStorage.setItem("renace_weekly_summary", weekKey);
  }, [
    settings.notificationsEnabled,
    settings.hapticFeedback,
    notify,
  ]);

  /* ------------------------------------------
     1) Token FCM
  ------------------------------------------ */
  useEffect(() => {
    async function setupFCM() {
      const token = await requestUserNotificationToken();
      if (!token) return;

      await setDoc(
        doc(db, "users", "default-local-user"),
        { fcmToken: token },
        { merge: true }
      );
    }

    setupFCM();
  }, []);

  /* ------------------------------------------
     2) Notificaciones foreground → Toast
  ------------------------------------------ */
  useEffect(() => {
    listenToForegroundMessages((payload) => {
      const title = payload?.notification?.title || "Renace";
      const message = payload?.notification?.body || "";
      addToast(title, message);
    });
  }, [addToast]);

  /* ------------------------------------------
     3) Mensajes desde Service Worker
  ------------------------------------------ */
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handler = (event) => {
      const data = event.data;
      if (data?.type === "OPEN_TASK" && data.taskId) {
        setNavigation({ tab: "tasks", taskId: data.taskId });
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);
    return () =>
      navigator.serviceWorker.removeEventListener("message", handler);
  }, []);

  /* ------------------------------------------
     4) Abrir tarea desde URL
  ------------------------------------------ */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tId = params.get("taskId");

    if (tId) {
      setNavigation({ tab: "tasks", taskId: tId });
    }
  }, []);

  /* ------------------------------------------
     5) Compatibilidad legacy
  ------------------------------------------ */
  useEffect(() => {
    if (navigation.tab === "progress") {
      setNavigation({ tab: "historial", taskId: null });
    }
  }, [navigation.tab]);

  /* ------------------------------------------
     Navegación central
  ------------------------------------------ */
  const handleNavigate = (newTab, newTaskId = null) => {
    setNavigation({ tab: newTab, taskId: newTaskId });
  };

  const isHome = tab === "home";

  /* ------------------------------------------
     RENDER
  ------------------------------------------ */
  return (
    <div className={`app-root ${isHome ? "no-padding" : ""}`}>
      <div className="app-shell">
        {/* TOASTS */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        {/* CONTENEDOR CENTRAL */}
        <div
          className={`app-content ${
            isHome ? "app-content--home" : "app-content--scroll"
          }`}
        >
          {/* HOME */}
          {isHome && (
            <div className="home-container">
              <Home onNavigate={handleNavigate} />
            </div>
          )}

          {/* PÁGINAS BASE */}
          {tab === "tasks" && (
            <Tasks
              onNavigate={handleNavigate}
              focusTaskId={taskId}
              onClearFocus={() =>
                setNavigation({ ...navigation, taskId: null })
              }
            />
          )}

          {tab === "create" && (
  <Create
    onNavigate={handleNavigate}
    initialTab={navigation.taskId || "intencion"}
  />
)}

          {tab === "historial" && <Historial onNavigate={handleNavigate} />}
          {tab === "retos" && <Retos onNavigate={handleNavigate} />}
          {tab === "profile" && <Profile onNavigate={handleNavigate} />}
          {tab === "settings" && <Settings onNavigate={handleNavigate} />}

          {/* PREMIUM */}
          {tab === "dailyIntention" && (
            <DailyIntentionPage onNavigate={handleNavigate} />
          )}

          {tab === "taskProgress" && (
            <TaskProgressPage onNavigate={handleNavigate} />
          )}

          {tab === "challengeProgress" && (
            <ProgresoRetos onNavigate={handleNavigate} />
          )}

          {tab === "activeDays" && (
            <ActiveDaysPage onNavigate={handleNavigate} />
          )}

          {tab === "objectiveMain" && (
            <ObjectiveMain onNavigate={handleNavigate} />
          )}

          {tab === "historial-objetivo" && (
            <HistorialObjetivo onNavigate={handleNavigate} />
          )}
        </div>

        {/* BOTTOM NAV */}
        <BottomNav current={tab} onChange={(v) => handleNavigate(v)} />
      </div>
    </div>
  );
}

import React, { createContext, useContext, useEffect, useState } from "react";

/* ============================================================
   CONTEXTO
============================================================ */
const SettingsContext = createContext();

/* ============================================================
   CONFIGURACIÓN POR DEFECTO
============================================================ */
const DEFAULT_SETTINGS = {
  theme: "dark",
  accent: "morado",

  // 🔔 NOTIFICACIONES (CONTROL DE APP, NO PERMISO)
  notificationsEnabled: false,

  // Recordatorios
  dailyReminders: false,
  weeklySummary: false,

  // Enfoque
  focusMode: false,
  blockNotifications: false,

  // Feedback
  subtleSounds: false,
  hapticFeedback: false,
};

/* ============================================================
   MAPA DE ACENTOS (FUENTE ÚNICA DE VERDAD)
============================================================ */
const ACCENT_MAP = {
  morado: {
    primary: "#a855f7",
    glow: "rgba(168, 85, 247, 0.55)",
  },
  azul: {
    primary: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.55)",
  },
  rosa: {
    primary: "#ec4899",
    glow: "rgba(236, 72, 153, 0.55)",
  },
  verde: {
    primary: "#22c55e",
    glow: "rgba(34, 197, 94, 0.55)",
  },
  naranja: {
    primary: "#f97316",
    glow: "rgba(249, 115, 22, 0.55)",
  },
  rojo: {
    primary: "#ef4444",
    glow: "rgba(239, 68, 68, 0.55)",
  },
  cyan: {
    primary: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.55)",
  },
};

/* ============================================================
   APLICAR ACENTO AL CSS
============================================================ */
function applyAccent(accent) {
  const data = ACCENT_MAP[accent] || ACCENT_MAP.morado;
  const root = document.documentElement;

  root.style.setProperty("--accent-primary", data.primary);
  root.style.setProperty("--accent-glow", data.glow);
}

/* ============================================================
   PROVIDER
============================================================ */
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("renace_settings");
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  /* --------------------------------------------
     GUARDAR EN LOCALSTORAGE
  -------------------------------------------- */
  useEffect(() => {
    localStorage.setItem("renace_settings", JSON.stringify(settings));
  }, [settings]);

  /* --------------------------------------------
     APLICAR ACENTO (MAGIA REAL)
  -------------------------------------------- */
  useEffect(() => {
    applyAccent(settings.accent);
  }, [settings.accent]);

  /* --------------------------------------------
     TOGGLE BOOLEANOS
  -------------------------------------------- */
  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* --------------------------------------------
     UPDATE DIRECTO
  -------------------------------------------- */
  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ============================================================
     EXPORT
  ============================================================ */
  return (
    <SettingsContext.Provider
      value={{
        settings,
        toggleSetting,
        updateSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

/* ============================================================
   HOOK
============================================================ */
export function useSettings() {
  return useContext(SettingsContext);
}

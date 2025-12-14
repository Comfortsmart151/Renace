import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const INITIAL_SETTINGS = {
  theme: "dark",
  accent: "morado",
  dailyReminders: true,
  weeklySummary: false,
  focusMode: false,
  blockNotifications: false,
  subtleSounds: false,
  hapticFeedback: true,
  betaFeatures: true,
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("renace_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_SETTINGS, ...parsed };
      }
    } catch (err) {
      console.warn("No se pudieron leer los ajustes guardados:", err);
    }
    return INITIAL_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("renace_settings", JSON.stringify(settings));
    } catch (err) {
      console.warn("No se pudieron guardar los ajustes:", err);
    }
  }, [settings]);

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      toggleSetting: (key) =>
        setSettings((prev) => ({ ...prev, [key]: !prev[key] })),
      updateSetting: (key, value) =>
        setSettings((prev) => ({ ...prev, [key]: value })),
      resetSettings: () => setSettings(INITIAL_SETTINGS),
    }),
    [settings]
  );

  // *** SIN JSX — VÁLIDO EN .JS ***
  return React.createElement(
    SettingsContext.Provider,
    { value },
    children
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings debe usarse dentro de un <SettingsProvider>.");
  }
  return ctx;
}

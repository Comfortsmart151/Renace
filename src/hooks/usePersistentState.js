// src/hooks/usePersistentState.js
import { useState, useEffect } from "react";

export function usePersistentState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error("Error leyendo localStorage para", key, err);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Error guardando en localStorage para", key, err);
    }
  }, [key, value]);

  return [value, setValue];
}

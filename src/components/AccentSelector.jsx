// src/components/AccentSelector.jsx
import React from "react";
import "../pages/Settings.css";

const ACCENTS = [
  { value: "morado", className: "accent-morado" },
  { value: "azul", className: "accent-azul" },
  { value: "rosa", className: "accent-rosa" },
  { value: "verde", className: "accent-verde" },
  { value: "naranja", className: "accent-naranja" },
  { value: "rojo", className: "accent-rojo" },
  { value: "cyan", className: "accent-cyan" },
];

export default function AccentSelector({ value, onChange }) {
  return (
    <div className="settings-accent-row">
      {ACCENTS.map((accent) => (
        <button
          key={accent.value}
          type="button"
          aria-label={accent.value}
          className={
            "settings-accent-dot " +
            accent.className +
            (value === accent.value ? " settings-accent-dot-active" : "")
          }
          onClick={() => onChange(accent.value)}
        />
      ))}
    </div>
  );
}

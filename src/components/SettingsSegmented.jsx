// src/components/SettingsSegmented.jsx
import React from "react";
import "../pages/Settings.css";

export default function SettingsSegmented({ options, value, onChange }) {
  const haptic = () => {
    if (window?.navigator?.vibrate) {
      window.navigator.vibrate(8);
    }
  };

  return (
    <div
      className="settings-segmented-ultra"
      style={{ "--segments": options.length }}
    >
      {/* BOTONES */}
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`segmented-btn-ultra ${
            value === opt.value ? "active" : ""
          }`}
          onClick={() => {
            onChange(opt.value);
            haptic();
          }}
        >
          {opt.label}
        </button>
      ))}

      {/* SLIDER ANIMADO */}
      <div
        className="segmented-slider-ultra"
        style={{
          transform: `translateX(${
            options.findIndex((o) => o.value === value) * 100
          }%)`,
        }}
      />
    </div>
  );
}

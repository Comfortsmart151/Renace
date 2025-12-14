// src/components/SettingsCard.jsx
import React from "react";
import "../pages/Settings.css";

export default function SettingsCard({ children, variant }) {
  return (
    <div
      className={`settings-card-premium ${
        variant === "danger" ? "settings-card-danger" : ""
      } glow-wrap`}
    >
      {children}
    </div>
  );
}

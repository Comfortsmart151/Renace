// src/components/SettingsSection.jsx
import React from "react";
import "../pages/Settings.css";

export default function SettingsSection({
  title,
  description,
  children,
  variant,
}) {
  return (
    <section
      className={`settings-section-premium glow-section ${
        variant === "danger" ? "settings-section-danger glow-section-danger" : ""
      }`}
    >
      <div className="settings-section-header">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>

      {children}
    </section>
  );
}

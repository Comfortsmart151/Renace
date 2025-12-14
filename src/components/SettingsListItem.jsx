// src/components/SettingsListItem.jsx
import React from "react";
import "../pages/Settings.css";

export default function SettingsListItem({
  title,
  subtitle,
  pill,
  disabled = false,
}) {
  return (
    <div
      className={`settings-list-item ${
        disabled ? "settings-list-disabled" : ""
      }`}
    >
      <div>
        <p className="settings-list-title">{title}</p>
        {subtitle && <p className="settings-list-sub">{subtitle}</p>}
      </div>
      {pill && <span className="settings-list-pill">{pill}</span>}
    </div>
  );
}

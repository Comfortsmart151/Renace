import React from "react";
import "../pages/Settings.css";

export default function SettingsToggle({
  value,
  onToggle,
  ariaLabel,
  disabled = false,
}) {
  const haptic = () => {
    if (!disabled && window?.navigator?.vibrate) {
      window.navigator.vibrate(12);
    }
  };

  return (
    <button
      type="button"
      className={`settings-toggle-ultra ${value ? "on" : ""} ${
        disabled ? "disabled" : ""
      }`}
      aria-pressed={value}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onToggle();
        haptic();
      }}
    >
      <span className="settings-toggle-thumb-ultra" />
    </button>
  );
}

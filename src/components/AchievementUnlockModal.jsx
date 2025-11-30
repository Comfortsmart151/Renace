import React, { useEffect } from "react";
import { ConfettiBurst } from "./ConfettiBurst";

export function AchievementUnlockModal({ achievement, onClose }) {
  if (!achievement) return null;

  useEffect(() => {
    const timer = setTimeout(onClose, 1800);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="ach-popup-overlay" onClick={onClose}>
      <ConfettiBurst active={true} />

      <div className="ach-popup glass" onClick={(e) => e.stopPropagation()}>
        <div className="ach-icon">{achievement.icon}</div>
        <h3>¡Logro desbloqueado!</h3>
        <p className="ach-title">{achievement.title}</p>
      </div>
    </div>
  );
}

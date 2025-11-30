import React, { useEffect } from "react";
import { playSound } from "../utils/playSound";

const MESSAGES = {
  calm: [
    "Respira, avanzaste con calma ✨",
    "La serenidad también es disciplina 🌿",
    "Pequeños pasos desde la paz interior 💙",
  ],
  focused: [
    "Enfoque puro. Eso es poder 🎯",
    "Tu mente está alineada con tu propósito ⚡",
    "Hoy avanzaste con claridad total 🔥",
  ],
  grateful: [
    "La gratitud mueve montañas 💛",
    "Agradecer también es avanzar ✨",
    "Creces desde lo que ya eres 🙏",
  ],
  excited: [
    "Esa energía tuya contagia 💥",
    "¡Wow! Vas con todo hoy ✨",
    "Ese impulso es oro 🔥",
  ],
  anxious: [
    "Aun con ansiedad, avanzaste 💙",
    "Coraje es dar un paso incluso con miedo 🛡",
    "Tu avance hoy vale doble 💫",
  ],
  tired: [
    "Incluso cansado, avanzaste. Eso es fuerza real 💜",
    "Tu constancia habla más alto que tu cansancio 🔥",
    "Hoy demostraste disciplina auténtica ✨",
  ],
  default: [
    "Un paso adelante es un paso adelante 🌟",
    "Avanzaste. Eso merece ser celebrado 💛",
    "La versión futura de ti te agradece 🙌",
  ],
};

export function TaskSuccessModal({ task, onClose }) {
  if (!task) return null;

  const messages = MESSAGES[task.emotion] || MESSAGES.default;
  const message = messages[Math.floor(Math.random() * messages.length)];

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate(15);
  }, []);

  useEffect(() => {
    playSound("task-complete", 0.35);
  }, []);

  const handleClose = () => {
    playSound("popup-close", 0.28);
    onClose();
  };

  return (
    <div className="task-success-overlay" onClick={handleClose}>
      <div
        className="task-success-modal glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ts-icon">{getIcon(task.emotion)}</div>

        <h3 className="ts-title">¡Tarea completada!</h3>
        <p className="ts-message">{message}</p>

        <button className="ts-button" onClick={handleClose}>
          Continuar
        </button>
      </div>
    </div>
  );
}

function getIcon(emotion) {
  switch (emotion) {
    case "calm":
      return "🌙";
    case "focused":
      return "🎯";
    case "grateful":
      return "💛";
    case "excited":
      return "✨";
    case "anxious":
      return "🛡";
    case "tired":
      return "😴";
    default:
      return "🌟";
  }
}

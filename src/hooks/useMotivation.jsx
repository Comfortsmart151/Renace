import { useState } from "react";
import MotivationalPopup from "../components/MotivationalPopup";

const taskMessages = [
  "Un paso más hacia tu mejor versión.",
  "¡Excelente! Estás avanzando con fuerza.",
  "Cada tarea completada te hace más disciplinado.",
  "Tu compromiso está dando frutos.",
  "Pequeños pasos, grandes cambios.",
  "Estás construyendo un futuro increíble.",
  "Hoy le ganaste a la procrastinación.",
  "¡Tarea completada! Tu energía está fluyendo.",
  "Tu constancia te está transformando.",
  "Hiciste lo que dijiste. Eso es poder."
];

const challengeMessages = [
  "¡Reto completado! Estás en otro nivel.",
  "Superaste un desafío. Te estás fortaleciendo.",
  "¡Boom! Otra victoria para tu mejor versión.",
  "Tu disciplina habla más fuerte que tus excusas.",
  "Estás creando una vida con propósito.",
  "Cada reto que superas eleva tu autoestima.",
  "Eres más fuerte de lo que crees.",
  "Tu renacimiento está en marcha.",
  "Estás demostrando de qué estás hecho.",
  "¡Sigue así! Estás encendido."
];

export default function useMotivation() {
  const [popup, setPopup] = useState(null);

  const showTaskMotivation = () => {
    const msg = taskMessages[Math.floor(Math.random() * taskMessages.length)];
    setPopup(msg);
  };

  const showChallengeMotivation = () => {
    const msg = challengeMessages[Math.floor(Math.random() * challengeMessages.length)];
    setPopup(msg);
  };

  const popupComponent = popup ? (
    <MotivationalPopup message={popup} onClose={() => setPopup(null)} />
  ) : null;

  return { popupComponent, showTaskMotivation, showChallengeMotivation };
}

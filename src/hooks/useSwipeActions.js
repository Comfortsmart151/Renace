// src/hooks/useSwipeActions.js
import { useState, useRef } from "react";

export function useSwipeActions({ onArchive, onDelete }) {
  const [offset, setOffset] = useState(0);
  const [returning, setReturning] = useState(false);

  const startX = useRef(null);

  const THRESHOLD_DELETE = 95;  // distancia para eliminar
  const THRESHOLD_ARCHIVE = -95; // distancia para archivar

  const handleStart = (e) => {
    setReturning(false);
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e) => {
    if (startX.current === null) return;

    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const delta = currentX - startX.current;

    // Limitar arrastre para que no se vaya demasiado
    if (delta > 160) return;
    if (delta < -160) return;

    setOffset(delta);
  };

  const handleEnd = () => {
    if (offset > THRESHOLD_DELETE) {
      // Deslizamiento a la derecha = ELIMINAR
      onDelete && onDelete();
      resetCard();
      return;
    }

    if (offset < THRESHOLD_ARCHIVE) {
      // Deslizamiento a la izquierda = ARCHIVAR
      onArchive && onArchive();
      resetCard();
      return;
    }

    // Si no pasó los límites → volver a posición
    resetPosition();
  };

  const resetPosition = () => {
    setReturning(true);
    setOffset(0);

    setTimeout(() => setReturning(false), 250);
  };

  const resetCard = () => {
    setReturning(true);
    setOffset(0);

    setTimeout(() => setReturning(false), 250);
  };

  return {
    handlers: {
      onMouseDown: handleStart,
      onMouseMove: handleMove,
      onMouseUp: handleEnd,
      onMouseLeave: handleEnd,

      onTouchStart: handleStart,
      onTouchMove: handleMove,
      onTouchEnd: handleEnd,
    },

    style: {
      transform: `translateX(${offset}px)`,
      transition: returning ? "transform 0.25s cubic-bezier(0.22,1,0.36,1)" : "none",
    },
  };
}

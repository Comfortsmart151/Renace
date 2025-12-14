// src/components/IntentionItem.jsx
import React from "react";
import { useSwipeActions } from "../hooks/useSwipeActions";

export default function IntentionItem({ intention, onDelete }) {
  const swipe = useSwipeActions({
    onDelete: () => onDelete(intention.id),
  });

  return (
    <div className="intention-swipe-wrapper">
      <div className="intention-swipe-bg">
        Desliza para eliminar
      </div>

      <div
        className="intention-item-card"
        style={swipe.style}
        {...swipe.handlers}
      >
        <span className="intention-bullet">✨</span>
        <span className="intention-text-line">{intention.texto}</span>
      </div>
    </div>
  );
}

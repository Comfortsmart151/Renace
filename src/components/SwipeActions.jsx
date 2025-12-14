// src/components/SwipeActions.jsx
import React from "react";
import "./SwipeActions.css";

export default function SwipeActions({
  showLeft = true,
  showRight = true,
  onArchive,
  onDelete,
}) {
  return (
    <div className="swipe-actions-container">
      {showLeft && (
        <button className="swipe-btn swipe-left" onClick={onArchive}>
          <span>Archivar</span>
        </button>
      )}

      {showRight && (
        <button className="swipe-btn swipe-right" onClick={onDelete}>
          <span>Eliminar</span>
        </button>
      )}
    </div>
  );
}

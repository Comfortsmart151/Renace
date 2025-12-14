import React from "react";
import { useSwipeActions } from "../hooks/useSwipeActions";

export default function HomeIntentionCard({ item, onDelete, onArchive }) {
  const swipe = useSwipeActions({
    onDelete: () => onDelete(item.id),
    onArchive: () => onArchive(item.id),
  });

  return (
    <div className="swipe-card-wrapper">

      {/* CAPAS DE ACCIONES */}
      <div className="swipe-card-actions">
        <div className="swipe-actions-left">Archivar</div>
        <div className="swipe-actions-right">Eliminar</div>
      </div>

      {/* TARJETA PRINCIPAL */}
      <div className="swipe-card" style={swipe.style} {...swipe.handlers}>
        <div className="intention-card-item">
          <h4>{item.texto}</h4>
          <p className="intent-time">{item.hora}</p>
        </div>
      </div>
    </div>
  );
}

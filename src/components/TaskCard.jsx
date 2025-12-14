// src/components/TaskCard.jsx
import React from "react";
import "./TaskCard.css";

export default function TaskCard({ task, onToggle, onEdit, onDelete, status }) {
  return (
    <div className={`taskcard taskcard-${status || "normal"}`}>
      {/* TEXTOS */}
      <div className="tc-info">
        <h3 className={`tc-title ${task.completed ? "done" : ""}`}>
          {task.title}
        </h3>

        {task.description && (
          <p className="tc-desc">{task.description}</p>
        )}

        {/* Deadline opcional */}
        {(task.deadlineDate || task.deadlineTime) && (
          <p className="tc-deadline">
            {task.deadlineDate && <span>{task.deadlineDate}</span>}
            {task.deadlineTime && <span> · {task.deadlineTime}</span>}
          </p>
        )}
      </div>

      {/* ICONOS DE ACCIÓN */}
      <div className="tc-actions">
        {/* COMPLETAR */}
        <button className="tc-btn" onClick={() => onToggle(task)}>
          <img
            src="/icons/check_outline.png"
            alt="complete"
            className="tc-action-icon big"
          />
        </button>

        {/* EDITAR */}
        <button className="tc-btn" onClick={() => onEdit(task)}>
          <img
            src="/icons/edit.png"
            alt="edit"
            className="tc-action-icon big"
          />
        </button>

        {/* ELIMINAR */}
        <button className="tc-btn" onClick={() => onDelete(task)}>
          <img
            src="/icons/trash.png"
            alt="delete"
            className="tc-action-icon big"
          />
        </button>
      </div>
    </div>
  );
}

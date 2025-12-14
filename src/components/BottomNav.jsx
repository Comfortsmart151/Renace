import React from "react";
import "./BottomNav.css";

export default function BottomNav({ current, onChange }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={current === "home" ? "active" : ""} 
        onClick={() => onChange("home")}
      >
        <i className="ri-home-5-line"></i>
        <span>Inicio</span>
      </button>

      <button 
        className={current === "tasks" ? "active" : ""} 
        onClick={() => onChange("tasks")}
      >
        <i className="ri-calendar-todo-line"></i>
        <span>Tareas</span>
      </button>

      <button 
        className={current === "create" ? "active" : ""} 
        onClick={() => onChange("create")}
      >
        <i className="ri-add-line"></i>
        <span>Crear</span>
      </button>

      <button 
        className={current === "progress" ? "active" : ""} 
        onClick={() => onChange("progress")}
      >
        <i className="ri-bar-chart-2-line"></i>
        <span>Progreso</span>
      </button>

      <button 
        className={current === "profile" ? "active" : ""} 
        onClick={() => onChange("profile")}
      >
        <i className="ri-user-3-line"></i>
        <span>Perfil</span>
      </button>
    </nav>
  );
}

import React from "react";

const TABS = [
  { id: "home", label: "Inicio", icon: "/icons/home.png" },
  { id: "tasks", label: "Tareas", icon: "/icons/tareas.png" },
  { id: "create", label: "Crear", icon: "/icons/crear.png" },
  { id: "achievements", label: "Logros", icon: "/icons/logros.png" },
  { id: "profile", label: "Perfil", icon: "/icons/perfil.png" },
  { id: "settings", label: "Ajustes", icon: "/icons/ajustes.png" },
];

export function BottomNav({ current, onChange }) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${current === tab.id ? "active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            <img
              src={tab.icon}
              alt={tab.label}
              className="nav-icon"
              draggable="false"
            />
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

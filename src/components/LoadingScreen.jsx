// src/components/LoadingScreen.jsx
import React from "react";
import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-logo">🌙</div>
      <div className="loading-text">Cargando tu espacio para renacer...</div>
    </div>
  );
}

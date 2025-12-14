// src/pages/ChallengeProgressPage.jsx
import React from "react";
import "./SubPages.css";

export default function ChallengeProgressPage({ onNavigate }) {
  return (
    <div className="subpage-wrapper">
      <header className="subpage-header">
        <button className="subpage-back" onClick={() => onNavigate("profile")}>
          ←
        </button>
        <h1>Progreso de retos</h1>
      </header>

      <section className="subpage-card">
        <h2>Retos completados</h2>
        <p className="subpage-text">
          Verás tus rachas, retos más fuertes y tu evolución Renace.
        </p>
      </section>
    </div>
  );
}

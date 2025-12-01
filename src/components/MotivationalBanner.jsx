// src/components/MotivationalBanner.jsx
import React, { useMemo } from "react";
import "./MotivationalBanner.css";

// IMÁGENES
const IMAGES = [
  "/assets/banners/1.jpg",
  "/assets/banners/2.jpg",
  "/assets/banners/3.jpg",
  "/assets/banners/4.jpg",
  "/assets/banners/5.jpg",
  "/assets/banners/6.jpg",
];

// FRASES
const PHRASES = [
  "A veces avanzar es simplemente respirar y volver a intentarlo.",
  "Cada avance, por pequeño que sea, es progreso.",
  "Hoy puedes empezar diferente.",
  "Lo que siembras con intención florece con tiempo.",
  "Tu historia apenas está comenzando.",
  "El enfoque determina tu energía.",
];

export default function MotivationalBanner() {
  const randomImage = useMemo(
    () => IMAGES[Math.floor(Math.random() * IMAGES.length)],
    []
  );

  const randomPhrase = useMemo(
    () => PHRASES[Math.floor(Math.random() * PHRASES.length)],
    []
  );

  return (
    <div className="m-banner">
      {/* Imagen */}
      <img src={randomImage} alt="Banner" className="m-banner-img" />

      {/* Fade inferior */}
      <div className="m-banner-fade"></div>

      {/* Frase abajo */}
      <p className="m-banner-text">{randomPhrase}</p>
    </div>
  );
}

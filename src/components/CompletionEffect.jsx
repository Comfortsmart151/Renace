import React, { useEffect, useState } from "react";
import "./CompletionEffect.css";

export default function CompletionEffect({ trigger }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;

    const arr = [];

    for (let i = 0; i < 16; i++) {
      arr.push({
        id: i,
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 120,
        size: 6 + Math.random() * 6,
        delay: Math.random() * 80,
      });
    }

    setParticles(arr);

    // limpiar después de animar
    const timeout = setTimeout(() => setParticles([]), 600);
    return () => clearTimeout(timeout);
  }, [trigger]);

  return (
    <div className="completion-effect-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            transform: `translate(${p.x}px, ${p.y}px)`,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

import React, { useEffect, useState } from "react";

export function ConfettiBurst({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return;

    const arr = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.25,
    }));

    setParticles(arr);

    const timeout = setTimeout(() => setParticles([]), 800);
    return () => clearTimeout(timeout);
  }, [active]);

  return (
    <div className="confetti-container">
      {particles.map((p, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

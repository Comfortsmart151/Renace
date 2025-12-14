// src/components/ProgressDots.jsx
import React from "react";
import "./ProgressDots.css";

export default function ProgressDots({ total = 3, filled = 0 }) {
  return (
    <div className="progress-dots">
      {[...Array(total)].map((_, i) => (
        <div
          key={i}
          className={`dot ${i < filled ? "filled" : ""}`}
        />
      ))}
    </div>
  );
}

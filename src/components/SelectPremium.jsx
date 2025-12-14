import React, { useState, useRef, useEffect } from "react";
import "./SelectPremium.css";

export default function SelectPremium({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Cerrar si se hace clic afuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sp-wrapper" ref={ref}>
      {label && <p className="sp-label">{label}</p>}

      <div
        className="sp-selected"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{value}</span>
        <i className={`ri-arrow-down-s-line sp-arrow ${open ? "open" : ""}`}></i>
      </div>

      {open && (
        <div className="sp-options">
          {options.map((opt) => (
            <div
              key={opt}
              className={`sp-option ${opt === value ? "active" : ""}`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

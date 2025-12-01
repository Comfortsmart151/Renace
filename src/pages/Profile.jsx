// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";

export default function Profile() {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("renace-user-name");
    if (saved) setName(saved);
  }, []);

  const saveName = () => {
    if (tempName.trim().length < 2) return;
    localStorage.setItem("renace-user-name", tempName);
    setName(tempName);
    setEditing(false);
  };

  return (
    <div className="profile-section">

      <div className="card animate-card">
        <h2 className="profile-title">Mi Perfil</h2>

        <div className="profile-avatar">
          <span className="avatar-emoji">🙂</span>
        </div>

        <h3 className="profile-name">{name || "Tu nombre"}</h3>

        <button
          className="primary-button"
          onClick={() => {
            setTempName(name);
            setEditing(true);
          }}
        >
          Cambiar nombre
        </button>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div
            className="modal-card glass"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title">Editar nombre</h3>

            <input
              type="text"
              className="modal-input"
              placeholder="Escribe tu nombre"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setEditing(false)}
              >
                Cancelar
              </button>

              <button className="modal-btn save" onClick={saveName}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

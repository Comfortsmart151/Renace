import React, { useState } from "react";

export function Profile() {
  const [name, setName] = useState(
    localStorage.getItem("renace_profile_name") || ""
  );
  const [focusWord, setFocusWord] = useState(
    localStorage.getItem("renace_profile_focus") || ""
  );

  const handleSave = () => {
    localStorage.setItem("renace_profile_name", name);
    localStorage.setItem("renace_profile_focus", focusWord);
  };

  return (
    <section className="profile-page">
      <div className="card glass profile-header">
        <div className="avatar-orb" aria-hidden="true" />
        <div>
          <p className="muted small">Bienvenido/a</p>
          <h2>{name || "Tu nombre aquí"}</h2>
          <p className="muted">
            Diseña tu espacio emocional para que la app se sienta más tuya.
          </p>
        </div>
      </div>

      <div className="card glass">
        <h3>Identidad consciente</h3>
        <label className="field">
          <span>Nombre o alias</span>
          <input
            type="text"
            placeholder="Ej. Alex, Alma, Renacer..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Palabra enfoque del momento</span>
          <input
            type="text"
            placeholder="Ej. Calma, Disciplina, Presencia..."
            value={focusWord}
            onChange={(e) => setFocusWord(e.target.value)}
          />
        </label>

        <button className="primary-button" onClick={handleSave}>
          Guardar cambios
        </button>
      </div>
    </section>
  );
}

// src/components/EditProfileModal.jsx
import React, { useState } from "react";
import "./EditProfileModal.css";

import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { registerActivity } from "../utils/registerActivity";

export default function EditProfileModal({ onClose, perfil, setPerfil, user }) {
  /* ------------------------------------------------------
     STATE LOCAL DEL MODAL
  ------------------------------------------------------ */
  const [nombre, setNombre] = useState(perfil.nombre || "");
  const [tagline, setTagline] = useState(perfil.tagline || "");
  const [avatarUrl, setAvatarUrl] = useState(perfil.avatarUrl || null);

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  /* ------------------------------------------------------
     AVATARES DISPONIBLES (12)
  ------------------------------------------------------ */
  const avatars = Array.from(
    { length: 12 },
    (_, i) => `/avatars/avatar${i + 1}.png`
  );

  /* ------------------------------------------------------
     CAMBIAR AVATAR LOCAL
  ------------------------------------------------------ */
  const handleSelectAvatar = (url) => {
    setAvatarUrl(url);
    setShowAvatarPicker(false);
  };

  /* ------------------------------------------------------
     SUBIR FOTO DESDE LA PC
  ------------------------------------------------------ */
  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarUrl(ev.target.result); // Base64 local
    };
    reader.readAsDataURL(file);
  };

  /* ------------------------------------------------------
     GUARDAR CAMBIOS (LOCAL + FIREBASE SI HAY USER)
  ------------------------------------------------------ */
  const handleSave = async () => {
    const newData = {
      nombre: nombre.trim() || "Usuario",
      tagline: tagline.trim() || "Construyendo una vida con intención.",
      avatarUrl,
      email: perfil.email || user?.email || "",
    };

    /* 🔥 1. GUARDAR LOCAL */
    setPerfil(newData);
    localStorage.setItem("renace_profile", JSON.stringify(newData));

    /* 🔥 2. GUARDAR EN FIREBASE SOLO SI HAY USUARIO */
    if (user?.uid) {
      try {
        const ref = doc(db, "users", user.uid, "data", "perfil");
        await setDoc(ref, newData, { merge: true });

        // Registrar actividad
        await registerActivity({
          userId: user.uid,
          tipo: "perfil_editado",
          descripcion: "Actualizaste tu nombre y avatar.",
          titulo: newData.nombre,
        });

        alert("Perfil sincronizado con la nube ✨");
      } catch (e) {
        console.error("Error guardando en Firestore:", e);
        alert("Guardado local, pero hubo un error sincronizando.");
      }
    } else {
      alert("Cambios guardados en este dispositivo 🌟");
    }

    onClose();
  };

  /* ------------------------------------------------------
     UI DEL MODAL
  ------------------------------------------------------ */
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Editar perfil</h2>

        {/* AVATAR */}
        <div className="modal-avatar-container">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              className="modal-avatar-img"
              alt="avatar"
            />
          ) : (
            <div className="modal-avatar-placeholder">
              {nombre?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>

        {/* BOTONES AVATAR */}
        <div className="avatar-buttons">
          <button
            className="btn-secondary"
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
          >
            Elegir avatar
          </button>

          <label className="btn-secondary upload-btn">
            Subir foto
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadPhoto}
            />
          </label>
        </div>

        {/* GRID DE AVATARES */}
        {showAvatarPicker && (
          <div className="avatar-picker-grid">
            {avatars.map((a) => (
              <img
                key={a}
                src={a}
                className="avatar-option"
                onClick={() => handleSelectAvatar(a)}
              />
            ))}
          </div>
        )}

        {/* INPUTS */}
        <label className="input-label">Nombre:</label>
        <input
          className="input-field"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
        />

        <label className="input-label">Descripción corta:</label>
        <textarea
          className="input-field textarea"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Algo sobre ti..."
        />

        {/* BOTONES FINALES */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn-save" onClick={handleSave}>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

// src/pages/LoginScreen.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import "./LoginScreen.css";

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <div className="login-screen">
      <div className="login-content">

        <h1 className="login-title">Bienvenido a Renace</h1>
        <p className="login-subtitle">
          Tu espacio para volver a empezar, reenfocarte y crear intención.
        </p>

        <button className="login-google-btn" onClick={login}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google icon"
            className="google-icon"
          />
          Continuar con Google
        </button>
      </div>
    </div>
  );
}

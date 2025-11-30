import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// IMPORTA EL CSS CORRECTO
import "./styles/global.css";

// REGISTRO DEL SERVICE WORKER (PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("SW registrado ✔️"))
      .catch((err) => console.log("SW error ❌", err));
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

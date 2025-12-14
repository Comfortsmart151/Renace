import React from "react";
import Toast from "./Toast";
import "./toast.css";

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          id={t.id}
          title={t.title}
          message={t.message}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}

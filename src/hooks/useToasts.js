import { useState, useCallback } from "react";

export default function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

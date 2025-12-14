// src/hooks/useNotifications.js
import { useEffect, useState } from "react";
import {
  requestNotificationPermission,
  scheduleNotification,
} from "../utils/notifications";

import {
  requestUserNotificationToken,
  listenToForegroundMessages,
} from "../firebase";

export function useNotifications() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);

  /* --------------------------------------------------------------
     ESTADO INICIAL DE PERMISO
  -------------------------------------------------------------- */
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      setPermissionGranted(true);
    }
  }, []);

  /* --------------------------------------------------------------
     ACTIVAR NOTIFICACIONES (LOCAL + PUSH)
  -------------------------------------------------------------- */
  const enableNotifications = async (userId) => {
    if (!("Notification" in window)) return false;

    // 1️⃣ Permiso navegador
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);

    if (!granted) return false;

    // 2️⃣ Token FCM (si está disponible)
    try {
      const token = await requestUserNotificationToken();
      if (token) {
        setFcmToken(token);

        // (opcional) aquí luego puedes guardarlo en Firestore por usuario
        // ya lo tienes preparado en firebase.js
      }
    } catch (err) {
      console.warn("No se pudo obtener token FCM:", err);
    }

    return true;
  };

  /* --------------------------------------------------------------
     NOTIFICACIÓN LOCAL (IN-APP / DELAY)
  -------------------------------------------------------------- */
  const notify = ({ title, body, delay = 1000 }) => {
    if (!permissionGranted) return;

    scheduleNotification({
      title,
      body,
      delay,
    });
  };

  /* --------------------------------------------------------------
     ESCUCHAR PUSH EN FOREGROUND
  -------------------------------------------------------------- */
  const listenForeground = (callback) => {
    return listenToForegroundMessages((payload) => {
      callback?.(payload);
    });
  };

  return {
    permissionGranted,
    enableNotifications,
    notify,
    listenForeground,
    fcmToken,
  };
}

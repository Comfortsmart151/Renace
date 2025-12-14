/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCzBf2Q8GbzuLyRllsO3XVCywJzVU2mxoU",
  authDomain: "renace-e68b4.firebaseapp.com",
  projectId: "renace-e68b4",
  storageBucket: "renace-e68b4.firebasestorage.app",
  messagingSenderId: "111027290128",
  appId: "1:111027290128:web:22b098e9788ebe0af7ca95",
});

const messaging = firebase.messaging();

// Cuando llega notificación con la app cerrada / en background
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Notificación en background:", payload);

  const notification = payload.notification || {};
  const data = payload.data || {};

  const title = notification.title || "Renace";
  const body = notification.body || "";
  const icon = notification.icon || "/icons/icon-192.png";
  const taskId = data.taskId || null;

  self.registration.showNotification(title, {
    body,
    icon,
    data: {
      taskId,
    },
  });
});

// Cuando el usuario hace click en la notificación
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const taskId = event.notification.data && event.notification.data.taskId;

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      if (allClients.length > 0) {
        const client = allClients[0];
        await client.focus();

        if (taskId) {
          client.postMessage({
            type: "OPEN_TASK",
            taskId,
          });
        }
      } else {
        // Si no hay ventana abierta, abrir nueva con el taskId en la URL
        if (taskId) {
          await clients.openWindow(`/?taskId=${taskId}`);
        } else {
          await clients.openWindow(`/`);
        }
      }
    })()
  );
});

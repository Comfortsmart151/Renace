/* =========================================================
   🔔 NOTIFICATIONS UTILS — RENACE
========================================================= */

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function scheduleNotification({ title, body, delay = 1000 }) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  setTimeout(() => {
    new Notification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/badge.png",
    });
  }, delay);
}

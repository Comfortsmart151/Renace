import { scheduleNotification } from "./notifications";

/* =========================================================
   UTILIDADES
========================================================= */
function todayKey(type) {
  const today = new Date().toISOString().split("T")[0];
  return `renace_notif_${type}_${today}`;
}

function wasSentToday(type) {
  return localStorage.getItem(todayKey(type)) === "true";
}

function markAsSent(type) {
  localStorage.setItem(todayKey(type), "true");
}

/* =========================================================
   SCHEDULER PRINCIPAL
========================================================= */
export function runDailyScheduler(settings) {
  if (!settings.notificationsEnabled) return;

  const now = new Date();
  const hour = now.getHours();

  /* 🌅 MAÑANA (6:00 - 11:59) */
  if (
    hour >= 6 &&
    hour < 12 &&
    settings.dailyReminders &&
    !wasSentToday("morning")
  ) {
    scheduleNotification({
      title: "🌅 Intención del día",
      body: "Tómate un momento para definir tu intención de hoy.",
      delay: 1200,
    });

    markAsSent("morning");
  }

  /* 🌙 NOCHE (20:00 - 23:59) */
  if (
    hour >= 20 &&
    hour <= 23 &&
    settings.dailyReminders &&
    !wasSentToday("night")
  ) {
    scheduleNotification({
      title: "🌙 Reflexión del día",
      body: "¿Cómo fue tu día? Dedica un momento para reflexionar.",
      delay: 1200,
    });

    markAsSent("night");
  }
}

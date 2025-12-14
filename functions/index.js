const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Envía notificaciones push usando Firebase Cloud Messaging
 * Incluye taskId en el payload para poder abrir la tarea al hacer click.
 */
async function sendNotificationToUser(taskId, userId, title, body) {
  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) return;

  const token = userDoc.data().fcmToken;
  if (!token) return;

  await admin.messaging().send({
    token,
    notification: {
      title,
      body,
      icon: "/icons/icon-192.png",
    },
    data: {
      taskId: taskId,
    },
  });

  console.log(`Notificación enviada a user ${userId} sobre task ${taskId}:`, title);
}

/**
 * Revisa tareas cada minuto y envía notificaciones inteligentemente:
 * - 1 hora antes
 * - al vencer
 * - cuando está atrasada
 */
exports.checkExpiredTasks = functions.pubsub
  .schedule("* * * * *") // cada minuto
  .timeZone("America/Santo_Domingo")
  .onRun(async () => {
    const now = new Date();

    const tasksSnap = await db
      .collection("tasks")
      .where("completed", "==", false)
      .get();

    for (const docSnap of tasksSnap.docs) {
      const task = docSnap.data();
      const ref = docSnap.ref;
      const taskId = docSnap.id;

      if (!task.deadlineDate) continue;
      if (!task.userId) continue;

      const dateStr = task.deadlineDate;
      const timeStr = task.deadlineTime || "23:59";

      const deadline = new Date(`${dateStr}T${timeStr}`);
      const diffMinutes = (deadline - now) / 60000;

      // 1) 1 hora antes
      if (diffMinutes <= 60 && diffMinutes > 0) {
        if (!task.notifiedBefore) {
          await sendNotificationToUser(
            taskId,
            task.userId,
            "Tu tarea vence pronto",
            `"${task.title}" vence en menos de 1 hora.`
          );
          await ref.update({ notifiedBefore: true });
        }
      }

      // 2) Exacto al vencer
      if (diffMinutes <= 0 && diffMinutes > -1) {
        if (!task.notifiedExact) {
          await sendNotificationToUser(
            taskId,
            task.userId,
            "La tarea acaba de vencer",
            `"${task.title}" llegó a su hora límite.`
          );
          await ref.update({ notifiedExact: true });
        }
      }

      // 3) Atrasada
      if (diffMinutes < 0) {
        if (!task.notifiedLate) {
          await sendNotificationToUser(
            taskId,
            task.userId,
            "Tarea atrasada",
            `"${task.title}" sigue pendiente después de la hora límite.`
          );
          await ref.update({ notifiedLate: true });
        }
      }
    }

    return null;
  });

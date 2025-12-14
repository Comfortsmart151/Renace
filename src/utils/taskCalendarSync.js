// src/utils/taskCalendarSync.js
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "./googleCalendar";

/* ---------------------------------------------------------------
   Convertir fecha/hora de la tarea a formato ISO completo 
---------------------------------------------------------------- */
function buildDateTime(date, time) {
  if (!date) return null;

  const finalTime = time || "09:00";
  return `${date}T${finalTime}:00-04:00`; // Santo Domingo (GMT-4)
}

/* ---------------------------------------------------------------
   Crear evento de Calendar al crear una tarea
---------------------------------------------------------------- */
export async function syncCreateTaskCalendar(task, user) {
  if (!user) return null;
  if (!task.deadlineDate) return null;

  try {
    const start = buildDateTime(task.deadlineDate, task.deadlineTime);
    const end = buildDateTime(task.deadlineDate, task.deadlineTime || "10:00");

    const event = await createCalendarEvent({
      title: task.title,
      description: task.description || "",
      start,
      end,
    });

    return event?.id || null;
  } catch (err) {
    console.error("Error creando evento Calendar:", err);
    return null;
  }
}

/* ---------------------------------------------------------------
   Actualizar evento al editar una tarea
---------------------------------------------------------------- */
export async function syncUpdateTaskCalendar(task, user) {
  if (!user) return null;
  if (!task.calendarEventId) return null;

  try {
    const start = buildDateTime(task.deadlineDate, task.deadlineTime);
    const end = buildDateTime(task.deadlineDate, task.deadlineTime || "10:00");

    await updateCalendarEvent(task.calendarEventId, {
      title: task.title,
      description: task.description || "",
      start,
      end,
    });

    return true;
  } catch (err) {
    console.error("Error actualizando evento Calendar:", err);
    return false;
  }
}

/* ---------------------------------------------------------------
   Eliminar evento Calendar al borrar la tarea
---------------------------------------------------------------- */
export async function syncDeleteTaskCalendar(task, user) {
  if (!user) return null;
  if (!task.calendarEventId) return null;

  try {
    await deleteCalendarEvent(task.calendarEventId);
    return true;
  } catch (err) {
    console.error("Error eliminando evento Calendar:", err);
    return false;
  }
}

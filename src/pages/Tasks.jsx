// src/pages/Tasks.jsx
import React, { useState, useEffect, useRef } from "react";
import "./Tasks.css";

import TasksPopup from "../components/TasksPopup";
import EditTaskPopup from "../components/EditTaskPopup";
import TaskCard from "../components/TaskCard";

import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  getDoc,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { registerActivity } from "../utils/registerActivity";

// ⚡ Motivación
import useMotivation from "../hooks/useMotivation";

// GOOGLE CALENDAR
import {
  loadGapiScript,
  initGapiClient,
  initTokenClient,
  requestCalendarAccess,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../utils/googleCalendar";

export default function Tasks({ onNavigate, focusTaskId, onClearFocus }) {
  const { user } = useAuth();
  const userId = user?.uid || null;

  const [filter, setFilter] = useState("hoy");
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [calendarEnabled, setCalendarEnabled] = useState(false);

  const taskRefs = useRef({});

  // ⚡ Hook motivacional
  const { popupComponent, showTaskMotivation } = useMotivation();

  /* ---------------------------------------------------------------
        VERIFICAR SI EL USUARIO HABILITÓ GOOGLE CALENDAR
  --------------------------------------------------------------- */
  useEffect(() => {
    async function loadUserSettings() {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCalendarEnabled(snap.data().calendarConnected === true);
      }
    }

    loadUserSettings();
  }, [user]);

  /* ---------------------------------------------------------------
        INICIALIZAR GAPI + TOKEN CLIENT (solo si calendarEnabled)
  --------------------------------------------------------------- */
  useEffect(() => {
    if (!calendarEnabled) return;

    async function prepareCalendar() {
      try {
        await loadGapiScript();
        await initGapiClient();
        await initTokenClient();
        console.log("Google Calendar listo. ✔");
      } catch (err) {
        console.error("Error preparando Google Calendar:", err);
      }
    }

    prepareCalendar();
  }, [calendarEnabled]);

  /* ---------------------------------------------------------------
        ESCUCHAR TAREAS FIRESTORE
  --------------------------------------------------------------- */
  useEffect(() => {
    const baseCol = collection(db, "tasks");
    const q = query(baseCol, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const loaded = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setTasks(loaded);
      },
      (err) => {
        console.error("Error escuchando tareas:", err);
      }
    );

    return () => unsub();
  }, []);

  /* ---------------------------------------------------------------
        AUTO-SCROLL PARA MOSTRAR TAREA DESTACADA
  --------------------------------------------------------------- */
  useEffect(() => {
    if (!focusTaskId) return;

    setTimeout(() => {
      const el = taskRefs.current[focusTaskId];
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("task-highlight");

      setTimeout(() => {
        el.classList.remove("task-highlight");
        if (onClearFocus) onClearFocus();
      }, 1600);
    }, 300);
  }, [focusTaskId, tasks, onClearFocus]);

  /* ================================================================
     🟣 FUNCIONES DE SINCRONIZACIÓN CON GOOGLE CALENDAR
     ============================================================== */

  async function ensureCalendarAccess() {
    if (!calendarEnabled) return false;

    try {
      await requestCalendarAccess();
      return true;
    } catch (err) {
      console.error("No se pudo obtener acceso a Calendar:", err);
      return false;
    }
  }

  /* ---------------------------------------------------------------
        CREAR TAREA → OPCIONAL: CREAR EVENTO EN CALENDAR
  --------------------------------------------------------------- */
  async function addTask(newTask) {
    try {
      const payload = {
        title: newTask.title?.trim() || "",
        description: newTask.description?.trim() || "",
        completed: false,
        deadlineDate: newTask.deadlineDate || null,
        deadlineTime: newTask.deadlineTime || null,
        category: newTask.category || "Personal",
        priority: newTask.priority || "Media",
        subtasks: Array.isArray(newTask.subtasks) ? newTask.subtasks : [],
        createdAt: serverTimestamp(),
        calendarEventId: null,
      };

      const docRef = await addDoc(collection(db, "tasks"), payload);

      /* 🔥 Si el usuario habilitó Calendar, sincronizamos */
      if (calendarEnabled && payload.deadlineDate) {
        const ok = await ensureCalendarAccess();
        if (ok) {
          const start = `${payload.deadlineDate}T${payload.deadlineTime || "09:00"}:00`;
          const end = `${payload.deadlineDate}T${payload.deadlineTime || "10:00"}:00`;

          const event = await createCalendarEvent({
            title: payload.title,
            description: payload.description,
            start,
            end,
          });

          if (event?.id) {
            await updateDoc(doc(db, "tasks", docRef.id), {
              calendarEventId: event.id,
            });
          }
        }
      }

      // 🔥 ACTIVIDAD: tarea creada
      await registerActivity({
        userId,
        tipo: "tarea_creada",
        descripcion: payload.title,
      });
    } catch (err) {
      console.error("❌ Error añadiendo tarea:", err);
      alert("No se pudo guardar la tarea.");
    }
  }

  /* ---------------------------------------------------------------
        COMPLETAR TAREA
  --------------------------------------------------------------- */
  async function toggleCompleted(task) {
    if (!task?.id) return;

    try {
      const nuevoEstado = !task.completed;

      await updateDoc(doc(db, "tasks", task.id), {
        completed: nuevoEstado,
      });

      if (nuevoEstado) showTaskMotivation();

      await registerActivity({
        userId,
        tipo: nuevoEstado ? "tarea_completada" : "tarea_reabierta",
        descripcion: task.title,
      });
    } catch (err) {
      console.error("❌ Error completando tarea:", err);
    }
  }

  /* ---------------------------------------------------------------
        EDITAR TAREA → SINCRONIZAR EVENTO SI EXISTE
  --------------------------------------------------------------- */
  async function saveTask(updatedTask) {
    if (!updatedTask?.id) return;

    try {
      const payload = {
        title: updatedTask.title?.trim() || "",
        description: updatedTask.description?.trim() || "",
        category: updatedTask.category || "Personal",
        deadlineDate: updatedTask.deadlineDate || null,
        deadlineTime: updatedTask.deadlineTime || null,
      };

      await updateDoc(doc(db, "tasks", updatedTask.id), payload);

      /* 🔥 SINCRONIZAR SI USUARIO HABILITÓ CALENDAR */
      if (calendarEnabled && updatedTask.calendarEventId) {
        const ok = await ensureCalendarAccess();
        if (ok) {
          const start = `${payload.deadlineDate}T${payload.deadlineTime || "09:00"}:00`;
          const end = `${payload.deadlineDate}T${payload.deadlineTime || "10:00"}:00`;

          await updateCalendarEvent(updatedTask.calendarEventId, {
            title: payload.title,
            description: payload.description,
            start,
            end,
          });
        }
      }

      await registerActivity({
        userId,
        tipo: "tarea_editada",
        descripcion: payload.title,
      });
    } catch (err) {
      console.error("❌ Error editando tarea:", err);
    }
  }

  /* ---------------------------------------------------------------
        ELIMINAR TAREA → BORRAR EVENTO EN CALENDAR SI EXISTE
  --------------------------------------------------------------- */
  async function deleteTask(task) {
    if (!task?.id) return;

    try {
      await deleteDoc(doc(db, "tasks", task.id));

      if (calendarEnabled && task.calendarEventId) {
        const ok = await ensureCalendarAccess();
        if (ok) await deleteCalendarEvent(task.calendarEventId);
      }

      await registerActivity({
        userId,
        tipo: "tarea_eliminada",
        descripcion: task.title,
      });
    } catch (err) {
      console.error("❌ Error eliminando tarea:", err);
    }
  }

  /* ---------------------------------------------------------------
        FILTROS
  --------------------------------------------------------------- */
  const filteredTasks = tasks.filter((t) => {
    if (filter === "pendientes") return !t.completed;
    if (filter === "completadas") return t.completed;
    return true;
  });

  /* ---------------------------------------------------------------
        URGENCIA VISUAL
  --------------------------------------------------------------- */
  function getTaskStatus(task) {
    if (!task.deadlineDate) return "normal";

    const deadline = new Date(`${task.deadlineDate}T${task.deadlineTime || "23:59"}`);
    const now = new Date();

    const diffH = (deadline - now) / (1000 * 60 * 60);
    if (diffH < 0) return "expired";
    if (diffH <= 24) return "urgent";
    return "normal";
  }

  /* ---------------------------------------------------------------
        UI
  --------------------------------------------------------------- */
  return (
    <div className="tasks-page">
      <div className="tasks-banner">
        <h2 className="tasks-banner-title">Organiza tu día</h2>
        <p className="tasks-banner-sub">Pequeños pasos crean grandes cambios.</p>
      </div>

      {/* FILTROS */}
      <div className="tasks-filters">
        <button className={filter === "hoy" ? "active" : ""} onClick={() => setFilter("hoy")}>
          Hoy
        </button>
        <button className={filter === "pendientes" ? "active" : ""} onClick={() => setFilter("pendientes")}>
          Pendientes
        </button>
        <button className={filter === "completadas" ? "active" : ""} onClick={() => setFilter("completadas")}>
          Completadas
        </button>
      </div>

      {/* LISTA */}
      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <i className="ri-checkbox-blank-circle-line" />
            <h3>Sin tareas aquí</h3>
            <p>Crea tu primera tarea para empezar a tomar acción.</p>
            <button className="empty-add-btn" onClick={() => setShowPopup(true)}>
              Añadir tarea
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} ref={(el) => (taskRefs.current[task.id] = el)}>
              <TaskCard
                task={task}
                status={getTaskStatus(task)}
                onToggle={toggleCompleted}
                onDelete={deleteTask}
                onEdit={(t) => setEditingTask(t)}
              />
            </div>
          ))
        )}
      </div>

      {/* BOTÓN FLOTANTE */}
      <button className="add-task-btn" onClick={() => setShowPopup(true)}>
        <i className="ri-add-line"></i>
      </button>

      {showPopup && (
        <TasksPopup onClose={() => setShowPopup(false)} onAdd={addTask} />
      )}

      {editingTask && (
        <EditTaskPopup
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={saveTask}
        />
      )}

      {popupComponent}
    </div>
  );
}

// src/App.jsx
import React, { useEffect, useState } from "react";

import { PageShell } from "./components/PageShell.jsx";
import { BottomNav } from "./components/BottomNav.jsx";

import { Home } from "./pages/Home.jsx";
import { Tasks } from "./pages/Tasks.jsx";
import { Create } from "./pages/Create.jsx";
import { Achievements } from "./pages/Achievements.jsx";
import Profile from "./pages/Profile.jsx";
import { Settings } from "./pages/Settings.jsx";

// ================================
// CONSTANTES
// ================================
const INITIAL_TAB = "home";
const KEY_TASKS = "renace_tasks_v1";
const KEY_INTENTIONS = "renace_intentions_v1";

// ================================
// LOAD / SAVE HELPERS (ESTABLES)
// ================================
const safeLoad = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const safeSave = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// ================================
// COMPONENTE PRINCIPAL
// ================================
export default function App() {
  const today = new Date().toISOString().slice(0, 10);

  // ESTADOS
  const [currentTab, setCurrentTab] = useState(INITIAL_TAB);
  const [tasks, setTasks] = useState(() => safeLoad(KEY_TASKS));
  const [intentions, setIntentions] = useState(() => safeLoad(KEY_INTENTIONS));
  const [editingTask, setEditingTask] = useState(null);

  // ================================
  // Persistencia automática
  // ================================
  useEffect(() => safeSave(KEY_TASKS, tasks), [tasks]);
  useEffect(() => safeSave(KEY_INTENTIONS, intentions), [intentions]);

  // ================================
  // HANDLERS — INTENCIONES
  // ================================
  const addIntention = (intention) => {
    setIntentions((prev) => [
      {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        createdAt: new Date().toISOString(),
        date: today,
        ...intention,
      },
      ...prev,
    ]);
  };

  const deleteIntention = (id) => {
    setIntentions((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;

      const isToday = item.date === today;
      if (!isToday) return prev;

      return prev.filter((i) => i.id !== id);
    });
  };

  // ================================
  // HANDLERS — TAREAS
  // ================================
  const handleAddTask = (task) => {
    setTasks((prev) => [
      {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        createdAt: new Date().toISOString(),
        done: false,
        ...task,
      },
      ...prev,
    ]);
    setCurrentTab("tasks");
  };

  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const handleDeleteTask = (taskObj) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskObj.id));
  };

  const handleClearDone = () => {
    setTasks((prev) => prev.filter((t) => !t.done));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setCurrentTab("create");
  };

  const handleUpdateTask = (updated) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    setEditingTask(null);
    setCurrentTab("tasks");
  };

  // ================================
  // Títulos Dinámicos Premium
  // ================================
  const pageTitles = {
    home: ["Renace hoy", "Intención diaria y calma emocional"],
    tasks: ["Tareas pendientes", "Prioriza tus compromisos"],
    create: [
      editingTask ? "Editar tarea" : "Crear tarea",
      editingTask ? "Modifica y guarda tus cambios" : "",
    ],
    achievements: ["Logros", "Celebra tu avance, paso a paso"],
    profile: ["Perfil", "Diseña tu versión que renace"],
    settings: ["Ajustes", "Afina tu experiencia"],
  };

  const [pageTitle, pageSubtitle] =
    pageTitles[currentTab] || ["Renace", ""];

  // ================================
  // RENDERIZADO PREMIUM
  // ================================
  return (
    <div className="app-shell">
      <PageShell
        title={pageTitle}
        subtitle={pageSubtitle}
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
      >
        {currentTab === "home" && (
          <Home
            tasks={tasks}
            intentions={intentions}
            today={today}
            deleteIntention={deleteIntention}
            onQuickStart={() => setCurrentTab("create")}
            addIntention={addIntention}  // AGREGADO PARA MODAL
          />
        )}

        {currentTab === "tasks" && (
          <Tasks
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onClearDone={handleClearDone}
            onEditTask={handleEditTask}
          />
        )}

        {currentTab === "create" && (
          <Create
            addIntention={addIntention}
            onAddTask={handleAddTask}
            defaultDate={today}
            editingTask={editingTask}
            onUpdateTask={handleUpdateTask}
          />
        )}

        {currentTab === "achievements" && (
          <Achievements tasks={tasks} intentions={intentions} />
        )}

        {currentTab === "profile" && <Profile />}

        {currentTab === "settings" && <Settings />}
      </PageShell>

      <BottomNav current={currentTab} onChange={setCurrentTab} />
    </div>
  );
}

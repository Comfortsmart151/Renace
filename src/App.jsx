import React, { useEffect, useState } from "react";
import { PageShell } from "./components/PageShell.jsx";
import { BottomNav } from "./components/BottomNav.jsx";

import { Home } from "./pages/Home.jsx";
import { Tasks } from "./pages/Tasks.jsx";
import { Create } from "./pages/Create.jsx";
import { Achievements } from "./pages/Achievements.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Settings } from "./pages/Settings.jsx";

const INITIAL_TAB = "home";

/* ========================================================
   LOAD / SAVE — Tasks
======================================================== */
const loadTasks = () => {
  try {
    const raw = localStorage.getItem("renace_tasks_v1");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveTasks = (tasks) => {
  try {
    localStorage.setItem("renace_tasks_v1", JSON.stringify(tasks));
  } catch {}
};

/* ========================================================
   LOAD / SAVE — Intentions
======================================================== */
const loadIntentions = () => {
  try {
    const raw = localStorage.getItem("renace_intentions_v1");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveIntentions = (intentions) => {
  try {
    localStorage.setItem(
      "renace_intentions_v1",
      JSON.stringify(intentions)
    );
  } catch {}
};

export default function App() {
  const [currentTab, setCurrentTab] = useState(INITIAL_TAB);

  const [tasks, setTasks] = useState(() => loadTasks());
  const [intentions, setIntentions] = useState(() => loadIntentions());

  const [editingTask, setEditingTask] = useState(null);

  const today = new Date().toISOString().slice(0, 10);

  /* ========================================================
     PERSISTENCIA
  ======================================================== */
  useEffect(() => saveTasks(tasks), [tasks]);
  useEffect(() => saveIntentions(intentions), [intentions]);

  /* ========================================================
     HANDLERS — Intenciones
  ======================================================== */
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

  /* ========================================================
     HANDLERS — Tasks
  ======================================================== */
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
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
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

  /* ========================================================
     UI: Page Title
  ======================================================== */
  let pageTitle = "";
  let pageSubtitle = "";

  switch (currentTab) {
    case "home":
      pageTitle = "Renace hoy";
      pageSubtitle = "Intención diaria y calma emocional";
      break;
    case "tasks":
      pageTitle = "Tareas pendientes";
      pageSubtitle = "Prioriza tus compromisos";
      break;
    case "create":
      pageTitle = editingTask ? "Editar tarea" : "Crear tarea";
      pageSubtitle = editingTask ? "Modifica y guarda tus cambios" : "";
      break;
    case "achievements":
      pageTitle = "Logros";
      pageSubtitle = "Celebra tu avance, paso a paso";
      break;
    case "profile":
      pageTitle = "Perfil";
      pageSubtitle = "Diseña tu versión que renace";
      break;
    case "settings":
      pageTitle = "Ajustes";
      pageSubtitle = "Afina tu experiencia";
      break;
    default:
      pageTitle = "Renace";
  }

  /* ========================================================
     RENDER
  ======================================================== */
  return (
    <div className="app-shell">
      <PageShell
        title={pageTitle}
        subtitle={pageSubtitle}
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        data-tab={currentTab}
      >
        {currentTab === "home" && (
          <Home
            tasks={tasks}
            intentions={intentions}
            today={today}
            deleteIntention={deleteIntention}
            onQuickStart={() => setCurrentTab("create")}
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

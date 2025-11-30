export const ACHIEVEMENTS = [

  // ========================================================
  // PRODUCTIVIDAD
  // ========================================================

  {
    id: "first_task",
    title: "Primer paso",
    icon: "🔥",
    description: "Completaste tu primera tarea.",
    goal: 1,
    check: (data) => data.doneCount >= 1,
    progress: (data) => Math.min((data.doneCount / 1) * 100, 100),
    progressColor: "progress-excited",
  },

  {
    id: "discipline",
    title: "Disciplina",
    icon: "🎯",
    description: "Completaste 10 tareas.",
    goal: 10,
    check: (data) => data.doneCount >= 10,
    progress: (data) => Math.min((data.doneCount / 10) * 100, 100),
    progressColor: "progress-focused",
  },

  {
    id: "constancy",
    title: "Constancia",
    icon: "⚡",
    description: "Completaste 30 tareas.",
    goal: 30,
    check: (data) => data.doneCount >= 30,
    progress: (data) => Math.min((data.doneCount / 30) * 100, 100),
    progressColor: "progress-focused",
  },

  {
    id: "mastery",
    title: "Maestría",
    icon: "💎",
    description: "Completaste 60 tareas.",
    goal: 60,
    check: (data) => data.doneCount >= 60,
    progress: (data) => Math.min((data.doneCount / 60) * 100, 100),
    progressColor: "progress-focused",
  },

  // ========================================================
  // EMOCIONALES
  // ========================================================

  {
    id: "calm_emotion",
    title: "Calma interior",
    icon: "🌙",
    description: "Completaste una tarea con emoción calma.",
    goal: 1,
    check: (data) => data.doneByEmotion.calm >= 1,
    progress: (data) => Math.min((data.doneByEmotion.calm / 1) * 100, 100),
    progressColor: "progress-calm",
  },

  {
    id: "focus_emotion",
    title: "Enfoque mental",
    icon: "🎯",
    description: "Completaste una tarea con emoción enfoque.",
    goal: 1,
    check: (data) => data.doneByEmotion.focused >= 1,
    progress: (data) => Math.min((data.doneByEmotion.focused / 1) * 100, 100),
    progressColor: "progress-focused",
  },

  {
    id: "excited_emotion",
    title: "Emoción radiante",
    icon: "✨",
    description: "Completaste una tarea con emoción emoción.",
    goal: 1,
    check: (data) => data.doneByEmotion.excited >= 1,
    progress: (data) => Math.min((data.doneByEmotion.excited / 1) * 100, 100),
    progressColor: "progress-excited",
  },

  {
    id: "resilience",
    title: "Fortaleza emocional",
    icon: "🛡",
    description: "Completaste una tarea marcada como ansiedad o cansancio.",
    goal: 1,
    check: (data) =>
      data.doneByEmotion.anxious >= 1 || data.doneByEmotion.tired >= 1,
    progress: (data) => {
      const total = data.doneByEmotion.anxious + data.doneByEmotion.tired;
      return Math.min((total / 1) * 100, 100);
    },
    progressColor: "progress-calm",
  },

  // ========================================================
  // MIXTOS
  // ========================================================

  {
    id: "balance_day",
    title: "Balance diario",
    icon: "⚖️",
    description: "3 emociones distintas en un mismo día.",
    goal: 3,
    check: (data) => data.uniqueEmotionsToday >= 3,
    progress: (data) =>
      Math.min((data.uniqueEmotionsToday / 3) * 100, 100),
    progressColor: "progress-grateful",
  },

  {
    id: "intention_streak",
    title: "Renacer",
    icon: "🌱",
    description: "Guardaste intención 5 días seguidos.",
    goal: 5,
    check: (data) => data.intentionStreak >= 5,
    progress: (data) =>
      Math.min((data.intentionStreak / 5) * 100, 100),
    progressColor: "progress-grateful",
  },

  {
    id: "powerful_day",
    title: "Día poderoso",
    icon: "🔥",
    description: "Completaste 3 tareas hoy.",
    goal: 3,
    check: (data) => data.completedToday >= 3,
    progress: (data) =>
      Math.min((data.completedToday / 3) * 100, 100),
    progressColor: "progress-excited",
  },

  {
    id: "return_after_break",
    title: "Resurgir",
    icon: "💫",
    description: "Volviste después de 7 días sin actividad.",
    goal: 7,
    check: (data) => data.daysSinceLastUse >= 7,
    progress: (data) =>
      Math.min((data.daysSinceLastUse / 7) * 100, 100),
    progressColor: "progress-calm",
  },

];

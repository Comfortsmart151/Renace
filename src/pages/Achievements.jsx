// src/pages/Achievements.jsx
import React, { useMemo, useEffect, useState } from "react";
import { ACHIEVEMENTS } from "../data/AchievementsList";
import { playSound } from "../utils/playSound";

export function Achievements({ tasks, intentions }) {
  /* ===============================
            CALCULOS
  =============================== */
  const data = useMemo(() => {
    const done = tasks.filter((t) => t.done);
    const today = new Date().toISOString().slice(0, 10);

    return {
      doneCount: done.length,

      completedToday: done.filter((t) => t.date === today).length,

      doneByEmotion: done.reduce((acc, t) => {
        acc[t.emotion] = (acc[t.emotion] || 0) + 1;
        return acc;
      }, {}),

      uniqueEmotionsToday: new Set(
        done.filter((t) => t.date === today).map((t) => t.emotion)
      ).size,

      intentionStreak: calculateIntentionStreak(intentions),

      daysSinceLastUse: Math.floor(
        (Date.now() -
          new Date(tasks[0]?.createdAt || Date.now()).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    };
  }, [tasks, intentions]);

  /* ===============================
          SONIDO DE NUEVOS LOGROS
  =============================== */
  const [initialized, setInitialized] = useState(false);
  const [prevUnlocked, setPrevUnlocked] = useState(0);

  useEffect(() => {
    const unlockedNow = ACHIEVEMENTS.filter((a) => a.check(data)).length;

    if (!initialized) {
      setPrevUnlocked(unlockedNow);
      setInitialized(true);
      return;
    }

    if (unlockedNow > prevUnlocked) {
      playSound("achievement-unlock", 0.55);
      setPrevUnlocked(unlockedNow);
    }
  }, [data, initialized, prevUnlocked]);

  /* ===============================
          UI PREMIUM
  =============================== */

  return (
    <div className="page-shell" data-tab="achievements">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Logros obtenidos</span>
        </div>
        <p className="reflection-text" style={{ marginTop: "6px" }}>
          Avanza a tu ritmo. Renace celebra incluso tus pequeños pasos.
        </p>
      </div>

      {/* LISTA DE LOGROS */}
      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = ach.check(data);
          const progress = ach.progress(data);

          return (
            <div
              key={ach.id}
              className="card premium-hover"
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                opacity: unlocked ? 1 : 0.55,
                border: unlocked
                  ? "1px solid var(--renace-primary)"
                  : "1px solid rgba(255,255,255,0.06)",
                position: "relative",
              }}
            >
              {/* ICONO */}
              <div
                className="chip"
                style={{
                  fontSize: "1.4rem",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  background: unlocked
                    ? "rgba(129, 140, 248, 0.25)"
                    : "rgba(255,255,255,0.03)",
                }}
              >
                {ach.icon}
              </div>

              {/* CONTENIDO */}
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    margin: 0,
                    color: "var(--renace-text-main)",
                  }}
                >
                  {ach.title}
                </p>

                <p
                  style={{
                    fontSize: "0.8rem",
                    marginTop: "2px",
                    color: "var(--renace-text-muted)",
                    lineHeight: "1.3",
                  }}
                >
                  {ach.description}
                </p>

                {/* BARRA DE PROGRESO */}
                {!unlocked && ach.goal > 1 && (
                  <div
                    style={{
                      marginTop: "8px",
                      width: "100%",
                      height: "6px",
                      borderRadius: "6px",
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        background:
                          "linear-gradient(90deg, var(--renace-primary), #a78bfa)",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* CHECKMARK */}
              {unlocked && (
                <span
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--renace-primary)",
                    fontWeight: "600",
                  }}
                >
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===============================
    Racha de intenciones
=============================== */
function calculateIntentionStreak(intentions) {
  const set = new Set(intentions.map((i) => i.date));
  let streak = 0;
  let d = new Date();

  while (set.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return streak;
}

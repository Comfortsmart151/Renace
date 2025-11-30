import React, { useMemo, useEffect, useState } from "react";
import { ACHIEVEMENTS } from "../data/AchievementsList";
import { playSound } from "../utils/playSound";

export function Achievements({ tasks, intentions }) {
  const data = useMemo(() => {
    const done = tasks.filter((t) => t.done);
    const todayStr = new Date().toISOString().slice(0, 10);

    return {
      doneCount: done.length,

      completedToday: done.filter((t) => t.date === todayStr).length,

      doneByEmotion: done.reduce((acc, t) => {
        acc[t.emotion] = (acc[t.emotion] || 0) + 1;
        return acc;
      }, {}),

      uniqueEmotionsToday: new Set(
        done
          .filter((t) => t.date === todayStr)
          .map((t) => t.emotion)
      ).size,

      intentionStreak: calculateIntentionStreak(intentions),

      daysSinceLastUse: Math.floor(
        (Date.now() -
          new Date(tasks[0]?.createdAt || Date.now()).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    };
  }, [tasks, intentions]);

  const [initialized, setInitialized] = useState(false);
  const [prevUnlockedCount, setPrevUnlockedCount] = useState(0);

  useEffect(() => {
    const unlockedNow = ACHIEVEMENTS.filter((a) => a.check(data)).length;

    if (!initialized) {
      setPrevUnlockedCount(unlockedNow);
      setInitialized(true);
      return;
    }

    if (unlockedNow > prevUnlockedCount) {
      playSound("achievement-unlock", 0.5);
      setPrevUnlockedCount(unlockedNow);
    }
  }, [data, initialized, prevUnlockedCount]);

  return (
    <section className="achievements-page">
      {ACHIEVEMENTS.map((ach) => {
        const unlocked = ach.check(data);
        const progress = ach.progress(data);

        return (
          <div
            key={ach.id}
            className={`achievement-card glass ${
              unlocked ? "unlocked" : "locked"
            }`}
          >
            <div className="achievement-icon">{ach.icon}</div>

            <div className="achievement-content">
              <h4>{ach.title}</h4>

              <p>
                {ach.description}
                {!unlocked && ach.goal > 1 && ` (${Math.floor(progress)}%)`}
              </p>

              {!unlocked && ach.goal > 1 && (
                <div className="achievement-progress">
                  <div
                    className={`achievement-progress-fill ${ach.progressColor}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            {unlocked && <span className="checkmark">✓</span>}
          </div>
        );
      })}
    </section>
  );
}

/* Helper: racha de intenciones */
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

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function useDailyTaskStatus() {
  const [urgent, setUrgent] = useState(0);
  const [late, setLate] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tasks"), (snap) => {
      let urgentCount = 0;
      let lateCount = 0;

      const now = new Date();

      snap.docs.forEach((d) => {
        const t = d.data();
        if (t.completed) return;
        if (!t.deadlineDate) return;

        const time = t.deadlineTime || "23:59";
        const deadline = new Date(`${t.deadlineDate}T${time}`);
        const diffHours = (deadline - now) / (1000 * 60 * 60);

        if (diffHours < 0) {
          lateCount++;
        } else if (diffHours <= 24) {
          urgentCount++;
        }
      });

      setUrgent(urgentCount);
      setLate(lateCount);
    });

    return () => unsub();
  }, []);

  return { urgent, late };
}


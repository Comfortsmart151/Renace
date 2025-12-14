// src/pages/Historial.jsx
import React, { useEffect, useState, useMemo } from "react";
import "./Historial.css";

import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import SwipeActions from "../components/SwipeActions";
import { useSwipeActions } from "../hooks/useSwipeActions";

/* ----------------------------------------------------
   HELPERS DE FECHA
---------------------------------------------------- */
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatShortDate(ts) {
  if (!ts) return "";
  const d = ts.toDate();
  return d.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function getDayLabel(ts) {
  if (!ts) return "";
  const d = ts.toDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dateOnly = new Date(d);
  dateOnly.setHours(0, 0, 0, 0);

  if (isSameDay(dateOnly, today)) return "Hoy";
  if (isSameDay(dateOnly, yesterday)) return "Ayer";

  return formatShortDate(ts);
}

/* ----------------------------------------------------
   SWIPE WRAPPER
---------------------------------------------------- */
function SwipeCard({
  children,
  onArchive,
  onDelete,
  showLeft = true,
  showRight = true,
}) {
  const swipe = useSwipeActions({
    onArchive,
    onDelete,
  });

  return (
    <div className="swipe-wrapper">
      <SwipeActions
        showLeft={showLeft}
        showRight={showRight}
        onArchive={onArchive}
        onDelete={onDelete}
      />

      <div className="swipe-card" style={swipe.style} {...swipe.handlers}>
        {children}
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   COMPONENTE PRINCIPAL
---------------------------------------------------- */
export default function Historial() {
  const [intenciones, setIntenciones] = useState([]);
  const [retos, setRetos] = useState([]);
  const [tareas, setTareas] = useState([]);

  /* 1. INTENCIONES */
  useEffect(() => {
    const q = query(
      collection(db, "intenciones"),
      orderBy("fecha", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setIntenciones(data);
    });
  }, []);

  /* ----------------------------------------------------
     2. RETOS — AHORA UNIFICAMOS reto + reto_completado
  ---------------------------------------------------- */

  useEffect(() => {
    const q = query(
      collection(db, "historial"),
      where("tipo", "in", ["reto", "reto_completado"]), // 🔥 FIX
      orderBy("fecha", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        // 🔥 Unificar nombres: todo será tratado como "reto"
        tipo: "reto",
        ...d.data(),
      }));
      setRetos(data);
    });
  }, []);

  /* 3. TAREAS COMPLETADAS */
  useEffect(() => {
    const q = query(
      collection(db, "historial"),
      where("tipo", "==", "tarea"),
      orderBy("fecha", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setTareas(data);
    });
  }, []);

  /* ----------------------------------------------------
     ACCIONES — ARCHIVAR / ELIMINAR
  ---------------------------------------------------- */
  const archiveIntention = async (id) => {
    try {
      await updateDoc(doc(db, "intenciones", id), { archivado: true });
    } catch (err) {
      console.error("Error archivando intención:", err);
    }
  };

  const deleteIntention = async (id) => {
    try {
      await deleteDoc(doc(db, "intenciones", id));
    } catch (err) {
      console.error("Error eliminando intención:", err);
    }
  };

  const deleteHistorialItem = async (id) => {
    try {
      await deleteDoc(doc(db, "historial", id));
    } catch (err) {
      console.error("Error eliminando historial:", err);
    }
  };

  /* ----------------------------------------------------
     UNIFICAR TIMELINE
  ---------------------------------------------------- */
  const secciones = useMemo(() => {
    const eventos = [];

    // INTENCIONES
    intenciones.forEach((item) => {
      if (!item.fecha) return;

      eventos.push({
        id: item.id,
        tipo: "intencion",
        titulo: item.texto,
        motivo: item.motivo || "",
        archivado: !!item.archivado,
        fechaTs: item.fecha,
        fechaMs: item.fecha.toDate().getTime(),
      });
    });

    // TAREAS
    tareas.forEach((t) => {
      if (!t.fecha) return;

      eventos.push({
        id: t.id,
        tipo: "tarea",
        titulo: t.titulo,
        fechaTs: t.fecha,
        fechaMs: t.fecha.toDate().getTime(),
      });
    });

    // RETOS (ya unificados)
    retos.forEach((r) => {
      if (!r.fecha) return;

      eventos.push({
        id: r.id,
        tipo: "reto",
        titulo: r.titulo,
        area: r.area || "",
        fechaTs: r.fecha,
        fechaMs: r.fecha.toDate().getTime(),
      });
    });

    if (eventos.length === 0) return [];

    // ORDEN
    eventos.sort((a, b) => b.fechaMs - a.fechaMs);

    // AGRUPAR
    const sections = [];
    eventos.forEach((ev) => {
      const label = getDayLabel(ev.fechaTs);

      let section = sections.find((s) => s.label === label);
      if (!section) {
        section = { label, items: [] };
        sections.push(section);
      }

      section.items.push(ev);
    });

    return sections;
  }, [intenciones, tareas, retos]);

  /* ----------------------------------------------------
     RENDER
  ---------------------------------------------------- */
  const renderIcon = (tipo) => {
    if (tipo === "intencion") return "✨";
    if (tipo === "tarea") return "✅";
    return "🏆";
  };

  const renderTipoLabel = (tipo, archivado) => {
    if (tipo === "intencion") return archivado ? "Intención archivada" : "Intención";
    if (tipo === "tarea") return "Tarea completada";
    return "Reto completado";
  };

  return (
    <div className="historial-page">
      <h2 className="historial-title">Historial</h2>
      <p className="historial-sub">
        Tu camino, un paso a la vez. Aquí ves cómo has ido avanzando.
      </p>

      {secciones.length === 0 && (
        <p className="empty-text">Aún no hay actividad registrada.</p>
      )}

      {secciones.map((section) => (
        <section key={section.label} className="timeline-section">
          <div className="timeline-header">
            <span className="timeline-dot" />
            <span className="timeline-label">{section.label}</span>
          </div>

          <div className="timeline-list">
            {section.items.map((ev) => {
              const isIntencion = ev.tipo === "intencion";
              const isReto = ev.tipo === "reto";

              return (
                <SwipeCard
                  key={ev.id}
                  onArchive={isIntencion ? () => archiveIntention(ev.id) : undefined}
                  onDelete={
                    isIntencion
                      ? () => deleteIntention(ev.id)
                      : () => deleteHistorialItem(ev.id)
                  }
                  showLeft={isIntencion}
                >
                  <div
                    className={`timeline-card ${
                      isIntencion && ev.archivado ? "timeline-card-archived" : ""
                    }`}
                  >
                    <div className="timeline-card-top">
                      <div className="timeline-icon">{renderIcon(ev.tipo)}</div>

                      <div className="timeline-top-text">
                        <span className="timeline-type">
                          {renderTipoLabel(ev.tipo, ev.archivado)}
                        </span>

                        <span className="timeline-date">
                          {formatShortDate(ev.fechaTs)}
                        </span>
                      </div>
                    </div>

                    <p className="item-title">{ev.titulo}</p>

                    {isIntencion && ev.motivo && (
                      <p className="item-motivo">{ev.motivo}</p>
                    )}

                    <div className="item-meta">
                      {isReto && ev.area && (
                        <span className="item-chip">{ev.area}</span>
                      )}

                      {isIntencion && ev.archivado && (
                        <span className="item-chip item-chip-archived">
                          Archivada
                        </span>
                      )}
                    </div>
                  </div>
                </SwipeCard>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

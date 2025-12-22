// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import "./Home.css";

import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

/* ------------------------------------------
   FRASES
------------------------------------------ */
const bannerPhrases = [
  "Hoy puedes empezar otra vez.",
  "Un paso a la vez.",
  "La disciplina te sostiene.",
  "Lo estás logrando.",
  "Lo mejor aún viene.",
  "Cree en ti.",
  "Avanza incluso con dudas.",
  "Hazlo con intención.",
  "Tu momento es hoy.",
  "Pequeños pasos, grandes cambios.",
  "Tu esfuerzo importa.",
  "Todo empieza contigo.",
  "Sigue construyendo tu camino.",
  "Hoy es una oportunidad.",
  "Lo difícil también se logra.",
  "Estás más cerca que ayer.",
  "Hazlo por ti.",
  "Confía en tu proceso.",
  "Elige avanzar.",
  "Enfócate en lo que suma.",
  "Tu energía mueve todo.",
  "Da lo mejor hoy.",
  "Eres capaz de más.",
  "Hazlo con calma, pero hazlo.",
  "Hoy cuenta.",
  "Tu progreso es sagrado.",
  "Ten paciencia contigo.",
  "Sigue, aunque sea lento.",
  "Tú puedes con esto.",
  "Haz espacio para lo nuevo.",
  "Tu constancia te dará frutos.",
  "Cada día cuenta.",
  "Sostén la visión.",
  "Mereces avanzar.",
  "El progreso es progreso.",
  "Respira y continúa.",
  "Siempre puedes empezar.",
  "No te rindas hoy.",
  "Confía un poco más.",
  "Hazlo por tu futuro yo.",
  "Todo suma.",
  "Tu versión fuerte te espera.",
  "Crea tu momento.",
  "No pares ahora.",
  "Estás creciendo.",
  "Celebra tus avances.",
  "Sé tu impulso.",
  "Sigue con determinación.",
  "Lo que buscas también te busca.",
  "Elige tu paz.",
  "Hoy eres más fuerte.",
  "Siempre hay una forma.",
  "Comparte luz contigo.",
  "Hazlo posible.",
  "No subestimes tu avance.",
  "Sigue alineado.",
  "Eres más fuerte que tus excusas.",
  "Todo cambio empieza hoy.",
  "Haz lo necesario.",
  "Tu intención guía tu camino.",
  "La constancia te distingue.",
  "No te compares, avanza.",
  "Pequeños pasos cuentan.",
  "Hoy eliges avanzar.",
  "Eres tu mejor proyecto.",
  "La claridad llega caminando.",
  "Tu presencia basta.",
  "Avanza incluso cuando cueste.",
  "Construye tu ritmo.",
  "Todo mejora cuando tú mejoras.",
  "Sé amable contigo.",
  "Confía en lo que viene.",
  "Hoy también vale.",
  "Tu luz importa.",
  "Sé la energía que deseas.",
  "El progreso es silencioso.",
  "Muévete con intención.",
  "Hazte cargo de ti.",
  "Mereces lo que sueñas.",
  "Persistir también es avanzar.",
  "Tu crecimiento es real.",
  "Agradece y avanza.",
  "No tienes que correr.",
  "Hazlo con corazón.",
  "Todo se construye paso a paso.",
  "Hoy puedes elegir mejor.",
  "Tu esfuerzo te transforma.",
  "El enfoque lo cambia todo.",
  "Sigue firme.",
  "Date permiso de avanzar.",
  "Hoy puedes más.",
  "Tu mejor versión está en camino.",
  "Cree un poco más.",
  "Haz lo que te acerque.",
  "Eres capaz de lograrlo.",
  "Hoy mueve tu vida.",
  "Tu tiempo es ahora.",
  "Sigue elevándote.",
];

const greetingPhrases = [
  "Hoy puedes elegir avanzar desde la calma y el compromiso contigo mismo.",
  "No necesitas tener todo claro para dar el siguiente paso.",
  "A veces avanzar significa simplemente no rendirte contigo hoy.",
  "Tu proceso es único; honralo, siéntelo y continúa.",
  "Lo que haces hoy construye la vida que quieres mañana.",
  "Eres más fuerte que lo que te detuvo antes.",
  "Permítete avanzar incluso si el camino aún no se ve completo.",
  "Celebra cada paso, porque cada uno te ha traído hasta aquí.",
  "La claridad llega mientras caminas, no antes.",
  "Hoy puedes ser más amable y más paciente contigo mismo.",
  "Tu compromiso diario crea tu transformación.",
  "Lo que hoy parece pequeño mañana será un logro gigante.",
  "La constancia suave puede cambiar cualquier realidad.",
  "El progreso silencioso sigue siendo progreso.",
  "Eres la prueba de que resistir también es avanzar.",
  "Tu paso más pequeño sigue contando para tu crecimiento.",
  "Elige avanzar incluso en los días en los que dudas.",
  "Hoy estás construyendo una versión más fuerte de ti.",
  "No te compares: tu ritmo también es válido.",
  "Lo que buscas también está buscándote a ti.",
  "Agradece lo que tienes y avanza hacia lo que deseas.",
  "La vida recompensa a quienes siguen incluso cuando es difícil.",
  "Tu esfuerzo de hoy es un regalo para tu futuro yo.",
  "A veces la vida cambia cuando tú decides cambiar primero.",
  "Cada día es una oportunidad para volver a empezar con intención.",
  "Tú mereces una vida que te haga sentir orgulloso.",
  "Confía en tu proceso incluso cuando no ves resultados inmediatos.",
  "La disciplina es un acto profundo de amor propio.",
  "Avanzar no siempre es rápido, pero siempre es valioso.",
  "Tu transformación comienza cuando eliges no abandonarte.",
  "No necesitas ser perfecto, solo constante.",
  "Lo que hoy te cuesta mañana será parte de tu fortaleza.",
  "La paciencia te llevará lejos si la acompañas de acción.",
  "Vuelve a ti cada vez que te sientas perdido.",
  "Cuando te cuidas, todo mejora alrededor.",
  "Tu historia aún tiene capítulos luminosos esperándote.",
  "Reconoce cuánto has crecido: no eres la misma persona de antes.",
  "Hoy puedes sembrar algo que mañana agradecerás.",
  "La vida cambia cuando tú decides que ya es momento.",
  "Mereces avanzar con paz, no con prisa.",
  "Cada paso que das en silencio te acerca a algo poderoso.",
  "Permítete soltar lo que pesa para recibir lo que te eleva.",
  "Eres más capaz de lo que crees cuando te permites intentarlo.",
  "Todo gran cambio empieza con una intención sincera.",
  "La constancia te convierte en alguien imparable.",
  "Hoy puede ser el día que marque la diferencia.",
  "Elige el tipo de persona que quieres ser y actúa desde ahí.",
  "No dejes que un mal momento defina tu día completo.",
  "Te estás convirtiendo en alguien más consciente, fuerte y enfocado.",
  "Tu energía crea la dirección de tu vida.",
  "Incluso la noche más larga termina con un amanecer.",
  "Sostén tu visión aunque el proceso sea lento.",
  "A veces avanzar es simplemente respirar y continuar.",
  "La calma también es una forma de fuerza.",
  "Sigue mostrando compromiso contigo: eso te cambiará la vida.",
  "Lo que hoy haces es una inversión en quien quieres ser.",
  "Permanece alineado con lo que te hace bien.",
  "Tú eres tu mejor proyecto, sé paciente con él.",
  "El universo se mueve cuando tú te mueves.",
  "Confía en que estás exactamente donde necesitas estar para crecer.",
  "Avanza con intención, no con presión.",
  "Celebra que estás aquí, intentando, avanzando.",
  "Tú tienes permiso para empezar de nuevo todas las veces que necesites.",
  "Tu transformación se construye un día a la vez.",
  "Sé la energía que quieres atraer a tu vida.",
  "No te apresures: lo que es para ti llegará en el tiempo correcto.",
  "Cada día trae una oportunidad para renacer.",
  "Tu futuro te está esperando con nuevas posibilidades.",
  "Agradece lo que has superado: también cuenta como victoria.",
  "La claridad emocional llega cuando respiras profundo y observas.",
  "Enfócate en lo que puedes controlar y suelta lo que no.",
  "Hoy puedes ser más consciente de tus pasos.",
  "Lo que hoy eliges se convierte en tu mañana.",
  "Abraza tu proceso incluso cuando se siente lento.",
  "Estás aprendiendo a elegirte, y eso es hermoso.",
  "Permítete descansar sin culpa, avanzarás mejor.",
  "Tu intención es un faro en los días de duda.",
  "Sigue adelante aunque la motivación no esté: la disciplina te sostiene.",
  "Eres más resiliente de lo que imaginas.",
  "Tu crecimiento interno es tu mayor logro.",
  "Lo importante es que sigas avanzando hacia ti.",
  "Cada día puedes elegir construir algo mejor.",
  "Tú eres la persona con la que siempre puedes contar.",
  "Valida tus emociones, pero no te quedes ahí.",
  "Encuentra algo pequeño por lo que sentirte orgulloso hoy.",
  "Tu paz es prioridad, protégela.",
  "La vida también mejora cuando tú mejoras por dentro.",
  "Avanzas incluso en los días que crees que no.",
  "Sigue honrando tu proceso.",
  "Todo lo que siembras vuelve multiplicado.",
  "Estás creando una vida más alineada contigo.",
  "No dudes de ti: ya has superado tanto.",
  "Eres capaz de crear una nueva realidad.",
  "Lo que construyes en silencio gritará resultados.",
  "Ten fe en ti: estás aprendiendo a crecer con intención.",
];

/* ------------------------------------------
   COMPONENTE HOME
------------------------------------------ */
export default function Home({ onNavigate }) {
  const { user } = useAuth();
  const { settings } = useSettings();

  const uid = user?.uid || null;
  const isLogged = !!user?.uid;
  const LEGACY_OWNER = "alex";

  const [bannerImage, setBannerImage] = useState("1.jpg");
  const [bannerText, setBannerText] = useState("");
  const [dailyPhrase, setDailyPhrase] = useState("");

  const [perfil, setPerfil] = useState({ nombre: "Usuario" });
  const [intencionHoy, setIntencionHoy] = useState(null);

  const [urgentTasks, setUrgentTasks] = useState([]);
  const [lateTasks, setLateTasks] = useState([]);

  const [mainObjective, setMainObjective] = useState("");
  const [objectiveProgress, setObjectiveProgress] = useState(0);

  const [weeklyVisual, setWeeklyVisual] = useState({
    intentions: 0,
    tasks: 0,
    achievements: 0,
    highlight: "",
  });

  const lastIntention = useRef(null);

  /* ----------------------------------------------------------
     belongsToUser corregido
  ---------------------------------------------------------- */
  const belongsToUser = (data) => {
    const owner =
      data?.uid ||
      data?.userId ||
      data?.ownerId ||
      data?.createdBy ||
      data?.user ||
      null;

    if (!isLogged) return false;
    if (!owner) return uid === LEGACY_OWNER;
    return owner === uid;
  };
  /* ------------------------------------------
     EFECTOS INICIALES
  ------------------------------------------ */
  useEffect(() => {
    setBannerImage(`${Math.floor(Math.random() * 6) + 1}.jpg`);
    setBannerText(
      bannerPhrases[Math.floor(Math.random() * bannerPhrases.length)]
    );
    setDailyPhrase(
      greetingPhrases[Math.floor(Math.random() * greetingPhrases.length)]
    );

    if (isLogged) {
      escucharIntencionHoy();
      escucharTareas();
    } else {
      setIntencionHoy(null);
      setUrgentTasks([]);
      setLateTasks([]);
    }
  }, []);

  /* ------------------------------------------
     CARGAR PERFIL DESDE FIRESTORE (solo loggeado)
  ------------------------------------------ */
  useEffect(() => {
    if (!uid) return;

    const ref = doc(db, "users", uid, "data", "perfil");

    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setPerfil(snap.data());
      }
    });
  }, [uid]);

  /* ------------------------------------------
     OBJETIVO CENTRAL (solo loggeado)
  ------------------------------------------ */
  useEffect(() => {
    if (!uid) return;

    const ref = doc(db, "users", uid, "data", "objetivoCentral");

    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const d = snap.data();
      setMainObjective(d.objective);
      setObjectiveProgress(d.progress);
    });
  }, [uid]);

  /* ------------------------------------------
     🔥 FASE 10 — RESUMEN VISUAL SEMANAL (DOMINGO)
     Fuente: colección "historial"
  ------------------------------------------ */
  useEffect(() => {
    if (!settings.weeklySummary) return;
    if (!isLogged) return;

    const today = new Date();
    const isSunday = today.getDay() === 0;
    if (!isSunday) return;

    const since = new Date();
    since.setDate(since.getDate() - 7);

    const q = query(
      collection(db, "historial"),
      orderBy("fecha", "desc"),
      limit(120)
    );

    return onSnapshot(q, (snap) => {
      let intentions = 0;
      let tasks = 0;
      let achievements = 0;

      const lastIntentions = [];

      snap.forEach((d) => {
        const data = d.data();
        if (!belongsToUser(data)) return;

        const date =
          data.fecha?.toDate?.() || (data.fecha ? new Date(data.fecha) : null);

        if (!date) return;
        if (date < since) return;

        const tipo = (data.tipo || "").toLowerCase();

        if (tipo.includes("intencion")) {
          intentions += 1;
          if (data.texto) lastIntentions.push(data.texto);
        } else if (tipo.includes("tarea")) {
          tasks += 1;
        } else if (tipo.includes("logro")) {
          achievements += 1;
        }
      });

      const phrases = [
        "No fue perfecta… pero fue tuya. Y avanzaste.",
        "La constancia silenciosa también transforma.",
        "Renacer se construye con pasos pequeños, no perfectos.",
        "Esta semana sembraste algo. Sostén el ritmo.",
        "Tu progreso es real, aunque a veces no se sienta.",
      ];

      const highlight =
        lastIntentions[0] || phrases[Math.floor(Math.random() * phrases.length)];

      setWeeklyVisual({
        intentions,
        tasks,
        achievements,
        highlight,
      });
    });
  }, [settings.weeklySummary, isLogged]);

  /* ------------------------------------------
     INTENCIÓN DEL DÍA (solo loggeado)
  ------------------------------------------ */
  const escucharIntencionHoy = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "intenciones"),
      where("fecha", ">=", hoy),
      where("archivado", "==", false),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setIntencionHoy(null);
        lastIntention.current = null;
        return;
      }

      const ownedDoc = snapshot.docs.find((d) => belongsToUser(d.data()));

      if (!ownedDoc) {
        setIntencionHoy(null);
        lastIntention.current = null;
        return;
      }

      const data = ownedDoc.data();

      if (lastIntention.current !== data.texto) {
        setIntencionHoy({
          ...data,
          __animate: true,
        });

        lastIntention.current = data.texto;

        setTimeout(() => {
          setIntencionHoy((old) =>
            old ? { ...old, __animate: false } : null
          );
        }, 800);
      }
    });
  };

  /* ------------------------------------------
     TAREAS URGENTES / ATRASADAS (solo loggeado)
  ------------------------------------------ */
  const escucharTareas = () => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((t) => belongsToUser(t));

      const urgent = [];
      const late = [];

      tasks.forEach((task) => {
        if (!task.deadlineDate) return;

        const now = new Date();
        const deadline = new Date(
          `${task.deadlineDate}T${task.deadlineTime || "23:59"}`
        );

        const diffHours = (deadline - now) / (1000 * 60 * 60);

        if (diffHours < 0) late.push(task);
        else if (diffHours <= 24) urgent.push(task);
      });

      setUrgentTasks(urgent);
      setLateTasks(late);
    });
  };

  const urgentCount = urgentTasks.length;
  const lateCount = lateTasks.length;

  const handleGoToUrgent = () =>
    urgentCount > 0
      ? onNavigate("tasks", urgentTasks[0].id)
      : onNavigate("tasks");

  const handleGoToLate = () =>
    lateCount > 0
      ? onNavigate("tasks", lateTasks[0].id)
      : onNavigate("tasks");

  /* ------------------------------------------
     SALUDO FINAL DINÁMICO
  ------------------------------------------ */
  const obtenerSaludo = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const saludo = user
    ? `${obtenerSaludo()}, ${perfil.nombre || user.displayName || "Usuario"}`
    : obtenerSaludo();

  const isSunday = new Date().getDay() === 0;
  /* ------------------------------------------
     RENDER
  ------------------------------------------ */
  return (
    <div className="home-page home-container">
      {/* BANNER */}
      <div className="home-banner">
        <img src={`/banners/${bannerImage}`} className="banner-img" />
        <div className="banner-overlay" />
        <p className="banner-text">{bannerText}</p>
      </div>

      {/* SALUDO */}
      <h2 className="greeting">{saludo}</h2>

      {/* 🔥 FASE 10 — RESUMEN VISUAL SEMANAL (DOMINGO) */}
      {settings.weeklySummary && isSunday && isLogged && (
        <div className="premium-card weekly-summary-visual-card">
          <div className="ws-header">
            <span className="ws-icon">📊</span>
            <h3 className="ws-title">Tu semana en Renace</h3>
            <span className="ws-pill">Domingo</span>
          </div>

          <p className="ws-sub">
            Un vistazo rápido a lo que construiste estos 7 días.
          </p>

          <div className="ws-metrics">
            <div className="ws-metric">
              <span className="ws-number">{weeklyVisual.intentions}</span>
              <span className="ws-label">intenciones</span>
            </div>

            <div className="ws-metric">
              <span className="ws-number">{weeklyVisual.tasks}</span>
              <span className="ws-label">tareas creadas</span>
            </div>

            <div className="ws-metric">
              <span className="ws-number">{weeklyVisual.achievements}</span>
              <span className="ws-label">logros</span>
            </div>
          </div>

          <div className="ws-highlight">
            <p className="ws-highlight-title">Lo más valioso:</p>
            <p className="ws-highlight-text">“{weeklyVisual.highlight}”</p>
          </div>

          <div className="ws-actions">
            <button className="ws-btn" onClick={() => onNavigate("historial")}>
              Ver historial
            </button>

            <button
              className="ws-btn ws-btn-soft"
              onClick={() => onNavigate("create", "intencion")}
            >
              Crear intención
            </button>
          </div>
        </div>
      )}

      {/* OBJETIVO CENTRAL */}
      <div
        className="premium-card objective-mini-card"
        onClick={() => onNavigate("objectiveMain")}
      >
        <div className="om-header">
          <span className="om-icon">🎯</span>
          <h3 className="om-title">Objetivo central</h3>
        </div>

        <p className="om-text">
          “{mainObjective || "Aún no has definido tu objetivo"}”
        </p>

        <div className="om-progress-bar">
          <div
            className="om-progress-fill"
            style={{ width: `${objectiveProgress}%` }}
          />
        </div>

        <p className="om-progress-label">{objectiveProgress}% completado</p>
      </div>

      {/* FRASE DEL DÍA */}
      <div className="daily-quote-container">
        <div className="daily-quote-chip">{dailyPhrase}</div>
      </div>

      {/* RESUMEN DEL DÍA */}
      <div className="premium-card day-summary-card">
        <h3 className="ds-title">Pendientes de hoy</h3>

        <div className="ds-row">
          <div className="ds-item click" onClick={handleGoToUrgent}>
            <i className="ri-error-warning-line ds-icon"></i>
            <span>{urgentCount} urgentes</span>
          </div>

          <div className="ds-item click" onClick={handleGoToLate}>
            <i className="ri-alarm-warning-fill ds-icon"></i>
            <span>{lateCount} atrasada</span>
          </div>
        </div>
      </div>

      {/* INTENCIÓN DEL DÍA */}
      <div
        className={`premium-card intention-card ${
          intencionHoy ? "intention-has-value" : ""
        }`}
      >
        <h3>Mi intención de hoy es:</h3>

        <p className="intention-text">
          {intencionHoy
            ? intencionHoy.texto
            : "Tómate 30 segundos para declarar tu intención."}
        </p>

        <button
          className="intention-btn"
          onClick={() => onNavigate("create", "intencion")}
        >
          {intencionHoy ? "Agregar otra intención" : "Escribir mi intención"}
        </button>
      </div>

      {/* ACCIONES RÁPIDAS */}
      <h3 className="acciones-title">Acciones rápidas</h3>

      <div className="quick-actions">
        <div
          className="quick-card premium-card"
          onClick={() => onNavigate("tasks")}
        >
          Ver tareas
        </div>
        <div
          className="quick-card premium-card"
          onClick={() => onNavigate("historial")}
        >
          Ver historial
        </div>
        <div
          className="quick-card premium-card"
          onClick={() => onNavigate("retos")}
        >
          Ver retos
        </div>
      </div>
    </div>
  );
}

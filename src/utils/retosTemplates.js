// src/utils/retosTemplates.js

// ÁREAS DE LA VIDA
export const LIFE_AREAS = [
  { id: "salud_fisica", label: "Salud física", color: "#22c55e" },
  { id: "salud_mental", label: "Salud mental", color: "#6366f1" },
  { id: "finanzas", label: "Finanzas", color: "#f59e0b" },
  { id: "relaciones", label: "Relaciones", color: "#ec4899" },
  { id: "amor_propio", label: "Amor propio", color: "#a855f7" },
  { id: "emocional", label: "Emocional", color: "#0ea5e9" },
  { id: "productividad", label: "Productividad", color: "#10b981" },
  { id: "habitos", label: "Hábitos", color: "#e11d48" },
];

// PLANTILLAS DE RETOS
// frequency: "diario" | "semanal" | "mensual"
// level: 1 = básico, 2 = intermedio, 3 = avanzado (puedes seguir ampliando)
// suggestedDays: duración estimada del reto

export const RETOS_TEMPLATES = {
  /* ---------------------- SALUD FÍSICA ---------------------- */
  salud_fisica: [
    // DIARIOS
    {
      id: "sf_d1",
      frequency: "diario",
      level: 1,
      title: "Caminar 10 minutos",
      description: "Sal a caminar al menos 10 minutos a ritmo tranquilo.",
      suggestedDays: 7,
    },
    {
      id: "sf_d2",
      frequency: "diario",
      level: 1,
      title: "1 vaso de agua extra",
      description: "Suma un vaso de agua más a lo que normalmente tomas.",
      suggestedDays: 7,
    },
    {
      id: "sf_d3",
      frequency: "diario",
      level: 2,
      title: "15 minutos de estiramientos",
      description: "Realiza una rutina sencilla de estiramientos.",
      suggestedDays: 10,
    },
    {
      id: "sf_d4",
      frequency: "diario",
      level: 2,
      title: "Evitar snacks ultra procesados",
      description: "Elige snacks naturales al menos una vez en el día.",
      suggestedDays: 10,
    },
    {
      id: "sf_d5",
      frequency: "diario",
      level: 3,
      title: "30 minutos de ejercicio",
      description: "Haz una sesión completa de ejercicio ligero o moderado.",
      suggestedDays: 14,
    },

    // SEMANALES
    {
      id: "sf_s1",
      frequency: "semanal",
      level: 1,
      title: "1 caminata larga en la semana",
      description: "Realiza una caminata de 30-40 minutos una vez en la semana.",
      suggestedDays: 7,
    },
    {
      id: "sf_s2",
      frequency: "semanal",
      level: 2,
      title: "Planificar 3 entrenamientos",
      description: "Agenda 3 momentos para entrenar durante esta semana.",
      suggestedDays: 7,
    },
    {
      id: "sf_s3",
      frequency: "semanal",
      level: 3,
      title: "Probar un nuevo tipo de ejercicio",
      description: "Intenta una nueva actividad física (yoga, baile, HIIT, etc).",
      suggestedDays: 7,
    },

    // MENSUALES
    {
      id: "sf_m1",
      frequency: "mensual",
      level: 1,
      title: "Medir progreso físico",
      description:
        "Registra cómo te sientes físicamente al inicio y al final del mes.",
      suggestedDays: 30,
    },
    {
      id: "sf_m2",
      frequency: "mensual",
      level: 2,
      title: "Reducir bebidas azucaradas",
      description:
        "Reduce de forma consciente el consumo de bebidas azucaradas este mes.",
      suggestedDays: 30,
    },
    {
      id: "sf_m3",
      frequency: "mensual",
      level: 3,
      title: "Cumplir una meta física específica",
      description:
        "Elige una meta (por ejemplo: correr X km, bajar X tiempo, ganar fuerza) y trabaja en ella todo el mes.",
      suggestedDays: 30,
    },
  ],

  /* ---------------------- SALUD MENTAL ---------------------- */
  salud_mental: [
    // DIARIOS
    {
      id: "sm_d1",
      frequency: "diario",
      level: 1,
      title: "5 minutos de respiración consciente",
      description: "Detente y respira profundo durante 5 minutos.",
      suggestedDays: 7,
    },
    {
      id: "sm_d2",
      frequency: "diario",
      level: 1,
      title: "Escribir una preocupación",
      description: "Anota algo que te preocupe para sacarlo de tu mente.",
      suggestedDays: 7,
    },
    {
      id: "sm_d3",
      frequency: "diario",
      level: 2,
      title: "Diario de pensamientos",
      description: "Escribe al menos 5 líneas sobre cómo te sientes hoy.",
      suggestedDays: 10,
    },
    {
      id: "sm_d4",
      frequency: "diario",
      level: 2,
      title: "Desconexión digital 20 minutos",
      description: "Tómate 20 minutos sin pantallas antes de dormir.",
      suggestedDays: 10,
    },
    {
      id: "sm_d5",
      frequency: "diario",
      level: 3,
      title: "Ejercicio de gratitud",
      description:
        "Escribe 3 cosas por las que te sientes agradecido cada día.",
      suggestedDays: 14,
    },

    // SEMANALES
    {
      id: "sm_s1",
      frequency: "semanal",
      level: 1,
      title: "1 momento de autocuidado",
      description:
        "Dedícate al menos 30 minutos a algo que te relaje (baño, lectura, música).",
      suggestedDays: 7,
    },
    {
      id: "sm_s2",
      frequency: "semanal",
      level: 2,
      title: "Revisión emocional semanal",
      description:
        "Haz una revisión de cómo te sentiste en la semana y qué aprendiste.",
      suggestedDays: 7,
    },
    {
      id: "sm_s3",
      frequency: "semanal",
      level: 3,
      title: "Limitar comparaciones en redes",
      description:
        "Elige 1 día para evitar redes sociales o usarlas de forma mínima.",
      suggestedDays: 7,
    },

    // MENSUALES
    {
      id: "sm_m1",
      frequency: "mensual",
      level: 1,
      title: "Organizar un espacio físico",
      description:
        "Ordena un pequeño espacio (escritorio, rincón, estante) para despejar tu mente.",
      suggestedDays: 30,
    },
    {
      id: "sm_m2",
      frequency: "mensual",
      level: 2,
      title: "Plan de manejo de estrés",
      description:
        "Crea una lista de 3-5 cosas que te ayudan cuando te sientes saturado.",
      suggestedDays: 30,
    },
    {
      id: "sm_m3",
      frequency: "mensual",
      level: 3,
      title: "Profundizar en autoconocimiento",
      description:
        "Elige un libro, curso o terapia que te acerque a conocerte mejor.",
      suggestedDays: 30,
    },
  ],

  /* ---------------------- FINANZAS ---------------------- */
  finanzas: [
    // DIARIOS
    {
      id: "fi_d1",
      frequency: "diario",
      level: 1,
      title: "Registrar 1 gasto",
      description: "Anota al menos un gasto del día para ganar claridad.",
      suggestedDays: 7,
    },
    {
      id: "fi_d2",
      frequency: "diario",
      level: 2,
      title: "Revisar tu billetera digital",
      description: "Revisa cuánto gastaste ayer y si fue necesario.",
      suggestedDays: 10,
    },
    {
      id: "fi_d3",
      frequency: "diario",
      level: 3,
      title: "Bloquear compras impulsivas",
      description:
        "Evita al menos una compra impulsiva durante el día y anótala.",
      suggestedDays: 14,
    },

    // SEMANALES
    {
      id: "fi_s1",
      frequency: "semanal",
      level: 1,
      title: "Revisar tus gastos de la semana",
      description: "Haz un resumen rápido de en qué se fue tu dinero.",
      suggestedDays: 7,
    },
    {
      id: "fi_s2",
      frequency: "semanal",
      level: 2,
      title: "Definir un pequeño ahorro semanal",
      description:
        "Elige una cantidad fija, aunque sea pequeña, para ahorrar esta semana.",
      suggestedDays: 7,
    },
    {
      id: "fi_s3",
      frequency: "semanal",
      level: 3,
      title: "Eliminar un gasto 'fuga'",
      description:
        "Identifica un gasto que no aporte mucho y redúcelo o elimínalo.",
      suggestedDays: 7,
    },

    // MENSUALES
    {
      id: "fi_m1",
      frequency: "mensual",
      level: 1,
      title: "Revisar tus suscripciones",
      description:
        "Asegúrate de que todas las suscripciones que pagas tengan sentido.",
      suggestedDays: 30,
    },
    {
      id: "fi_m2",
      frequency: "mensual",
      level: 2,
      title: "Definir una meta de ahorro",
      description:
        "Elige una meta de ahorro concreta para los próximos 3 meses.",
      suggestedDays: 30,
    },
    {
      id: "fi_m3",
      frequency: "mensual",
      level: 3,
      title: "Empezar a aprender sobre inversión",
      description:
        "Dedica este mes a informarte sobre alguna forma de inversión básica.",
      suggestedDays: 30,
    },
  ],

  /* ---------------------- RELACIONES ---------------------- */
  relaciones: [
    // DIARIOS
    {
      id: "re_d1",
      frequency: "diario",
      level: 1,
      title: "Enviar un mensaje atento",
      description:
        "Envía un mensaje genuino a alguien para saber cómo está.",
      suggestedDays: 7,
    },
    {
      id: "re_d2",
      frequency: "diario",
      level: 2,
      title: "Escuchar sin interrupciones",
      description:
        "En una conversación hoy, escucha al otro sin interrumpir por unos minutos.",
      suggestedDays: 10,
    },
    {
      id: "re_d3",
      frequency: "diario",
      level: 3,
      title: "Decir gracias con intención",
      description:
        "Agradece de forma específica a alguien por algo que hizo por ti.",
      suggestedDays: 14,
    },

    // SEMANALES
    {
      id: "re_s1",
      frequency: "semanal",
      level: 1,
      title: "Contactar a alguien que aprecias",
      description: "Escribe o llama a una persona con la que hacía tiempo no hablabas.",
      suggestedDays: 7,
    },
    {
      id: "re_s2",
      frequency: "semanal",
      level: 2,
      title: "Planear un momento de calidad",
      description:
        "Organiza una conversación o actividad significativa con alguien cercano.",
      suggestedDays: 7,
    },
    {
      id: "re_s3",
      frequency: "semanal",
      level: 3,
      title: "Practicar un límite sano",
      description:
        "Elige una situación donde puedas expresar un límite de forma respetuosa.",
      suggestedDays: 7,
    },

    // MENSUALES
    {
      id: "re_m1",
      frequency: "mensual",
      level: 1,
      title: "Reflexión sobre tus relaciones",
      description:
        "Escribe sobre qué relaciones te suman y cuáles te drenan energía.",
      suggestedDays: 30,
    },
    {
      id: "re_m2",
      frequency: "mensual",
      level: 2,
      title: "Plan familiar o social",
      description:
        "Organiza una actividad con familiares o amigos que te hagan bien.",
      suggestedDays: 30,
    },
    {
      id: "re_m3",
      frequency: "mensual",
      level: 3,
      title: "Trabajar una conversación pendiente",
      description:
        "Acércate a resolver o avanzar en una conversación que has estado posponiendo.",
      suggestedDays: 30,
    },
  ],

  /* ---------------------- AMOR PROPIO ---------------------- */
  amor_propio: [
    // DIARIOS
    {
      id: "ap_d1",
      frequency: "diario",
      level: 1,
      title: "Decirte algo bonito",
      description:
        "Di en voz alta o escribe una frase amable hacia ti mismo/a.",
      suggestedDays: 7,
    },
    {
      id: "ap_d2",
      frequency: "diario",
      level: 2,
      title: "Un pequeño gesto para ti",
      description:
        "Haz algo intencionalmente solo para cuidarte (un té, una pausa, una ducha consciente).",
      suggestedDays: 10,
    },
    {
      id: "ap_d3",
      frequency: "diario",
      level: 3,
      title: "Hablarte con respeto",
      description:
        "Detecta un pensamiento duro contigo y cámbialo por uno más compasivo.",
      suggestedDays: 14,
    },

    // SEMANALES
    {
      id: "ap_s1",
      frequency: "semanal",
      level: 1,
      title: "Lista de cosas que valoras de ti",
      description:
        "Escribe al menos 5 cosas que agradeces de ti misma/o esta semana.",
      suggestedDays: 7,
    },
    {
      id: "ap_s2",
      frequency: "semanal",
      level: 2,
      title: "Plan de autocuidado profundo",
      description:
        "Regálate un momento especial (spa casero, paseo, tiempo contigo).",
      suggestedDays: 7,
    },
    {
      id: "ap_s3",
      frequency: "semanal",
      level: 3,
      title: "Decir que no a algo",
      description:
        "Elige conscientemente una cosa a la que dirás 'no' para honrar tus límites.",
      suggestedDays: 7,
    },

    // MENSUALES
    {
      id: "ap_m1",
      frequency: "mensual",
      level: 1,
      title: "Revisión de autoimagen",
      description:
        "Escribe cómo te ves hoy y cómo te gustaría verte desde el amor propio.",
      suggestedDays: 30,
    },
    {
      id: "ap_m2",
      frequency: "mensual",
      level: 2,
      title: "Hacer algo que siempre postergas",
      description:
        "Realiza una acción que vienes postergando pero sabes que te haría bien.",
      suggestedDays: 30,
    },
    {
      id: "ap_m3",
      frequency: "mensual",
      level: 3,
      title: "Comprometerte con un nuevo estándar",
      description:
        "Define un nuevo mínimo aceptable para cómo permites que te traten (incluyéndote a ti).",
      suggestedDays: 30,
    },
  ],

  /* ---------------------- EMOCIONAL ---------------------- */
  emocional: [
    // DIARIOS
    {
      id: "em_d1",
      frequency: "diario",
      level: 1,
      title: "Nombrar tu emoción principal",
      description:
        "Ponle nombre a la emoción que más has sentido hoy (ej: tristeza, alegría, miedo).",
      suggestedDays: 7,
    },
    {
      id: "em_d2",
      frequency: "diario",
      level: 2,
      title: "Registrar un disparador emocional",
      description: "Describe algo que haya activado una reacción emocional fuerte.",
      suggestedDays: 10,
    },
    {
      id: "em_d3",
      frequency: "diario",
      level: 3,
      title: "Elegir una respuesta más sana",
      description:
        "En una situación incómoda, intenta responder diferente a como lo haces normalmente.",
      suggestedDays: 14,
    },

    // SEMANALES
    {
      id: "em_s1",
      frequency: "semanal",
      level: 1,
      title: "Resumen emocional de la semana",
      description: "Escribe cómo te sentiste la mayoría del tiempo esta semana.",
      suggestedDays: 7,
    },
    {
      id: "em_s2",
      frequency: "semanal",
      level: 2,
      title: "Compartir cómo te sientes",
      description:
        "Habla con alguien de confianza sobre algo que te haya movido emocionalmente.",
      suggestedDays: 7,
    },
    {
      id: "em_s3",
      frequency: "semanal",
      level: 3,
      title: "Practicar autorregulación",
      description:
        "Elige una técnica (respirar, caminar, escribir) y úsala cuando te sientas cargado.",
      suggestedDays: 7,
    },

    // MENSUALES
    {
      id: "em_m1",
      frequency: "mensual",
      level: 1,
      title: "Detectar patrones emocionales",
      description:
        "Revisa qué emociones se repiten en el mes y qué situaciones las disparan.",
      suggestedDays: 30,
    },
    {
      id: "em_m2",
      frequency: "mensual",
      level: 2,
      title: "Soltar algo que pesa",
      description:
        "Escribe una carta (que puedes o no enviar) sobre algo que necesites soltar.",
      suggestedDays: 30,
    },
    {
      id: "em_m3",
      frequency: "mensual",
      level: 3,
      title: "Diseñar tu caja de herramientas emocionales",
      description:
        "Haz una lista de recursos que puedes usar cuando te sientas mal (personas, actividades, frases).",
      suggestedDays: 30,
    },
  ],

  /* ---------------------- PRODUCTIVIDAD ---------------------- */
  productividad: [
    // DIARIOS
    {
      id: "pr_d1",
      frequency: "diario",
      level: 1,
      title: "Elegir un foco del día",
      description: "Define una sola cosa que sí o sí quieres avanzar hoy.",
      suggestedDays: 7,
    },
    {
      id: "pr_d2",
      frequency: "diario",
      level: 2,
      title: "Bloque de 25 minutos de enfoque",
      description: "Trabaja 25 minutos sin distracciones en una tarea importante.",
      suggestedDays: 10,
    },
    {
      id: "pr_d3",
      frequency: "diario",
      level: 3,
      title: "Revisión rápida del día",
      description:
        "Antes de dormir revisa qué avanzaste y qué quieres mejorar mañana.",
      suggestedDays: 14,
    },

    // SEMANALES
    {
      id: "pr_s1",
      frequency: "semanal",
      level: 1,
      title: "Plan semanal simple",
      description:
        "Escribe las 3 cosas más importantes que quieres lograr esta semana.",
      suggestedDays: 7,
    },
    {
      id: "pr_s2",
      frequency: "semanal",
      level: 2,
      title: "Eliminar una distracción frecuente",
      description: "Detecta algo que te distrae y reduce su tiempo en la semana.",
      suggestedDays: 7,
    },
    {
      id: "pr_s3",
      frequency: "semanal",
      level: 3,
      title: "Bloques de trabajo profundo",
      description:
        "Agenda al menos dos bloques largos (45-60 min) para trabajar en algo clave.",
      suggestedDays: 7,
    },

    // MENSUALES
    {
      id: "pr_m1",
      frequency: "mensual",
      level: 1,
      title: "Revisar tus proyectos",
      description:
        "Haz una lista de tus proyectos actuales y en qué estado están.",
      suggestedDays: 30,
    },
    {
      id: "pr_m2",
      frequency: "mensual",
      level: 2,
      title: "Definir metas del mes",
      description:
        "Elige de 1 a 3 metas claras que quieres avanzar este mes.",
      suggestedDays: 30,
    },
    {
      id: "pr_m3",
      frequency: "mensual",
      level: 3,
      title: "Optimizar tu sistema",
      description:
        "Revisa tu forma de organizarte y ajusta lo que ya no te funciona.",
      suggestedDays: 30,
    },
  ],

  /* ---------------------- HÁBITOS ---------------------- */
  habitos: [
    // DIARIOS
    {
      id: "ha_d1",
      frequency: "diario",
      level: 1,
      title: "Elegir 1 mini hábito",
      description:
        "Elige un hábito tan pequeño que no puedas fallar (ej: 1 flexión, 1 página).",
      suggestedDays: 7,
    },
    {
      id: "ha_d2",
      frequency: "diario",
      level: 2,
      title: "Apilar un hábito a otro",
      description:
        "Agrega tu mini hábito justo después de algo que ya haces todos los días.",
      suggestedDays: 10,
    },
    {
      id: "ha_d3",
      frequency: "diario",
      level: 3,
      title: "Registrar tu cadena de hábitos",
      description:
        "Marca cada día que cumplas tu hábito para ver tu cadena de constancia.",
      suggestedDays: 14,
    },

    // SEMANALES
    {
      id: "ha_s1",
      frequency: "semanal",
      level: 1,
      title: "Elegir un hábito a fortalecer",
      description:
        "Elige un solo hábito en el que te vas a enfocar durante la semana.",
      suggestedDays: 7,
    },
    {
      id: "ha_s2",
      frequency: "semanal",
      level: 2,
      title: "Identificar obstáculos",
      description:
        "Escribe qué te impide cumplir tu hábito y una posible solución.",
      suggestedDays: 7,
    },
    {
      id: "ha_s3",
      frequency: "semanal",
      level: 3,
      title: "Revisión semanal de hábitos",
      description:
        "Evalúa qué hábitos se sostuvieron, cuáles no y por qué.",
      suggestedDays: 7,
    },

    // MENSUALES
    {
      id: "ha_m1",
      frequency: "mensual",
      level: 1,
      title: "Escoger un hábito protagonista",
      description:
        "Elige el hábito más importante que quieres consolidar este mes.",
      suggestedDays: 30,
    },
    {
      id: "ha_m2",
      frequency: "mensual",
      level: 2,
      title: "Diseñar entorno a favor",
      description:
        "Ajusta tu espacio físico para que tu hábito sea más fácil de hacer.",
      suggestedDays: 30,
    },
    {
      id: "ha_m3",
      frequency: "mensual",
      level: 3,
      title: "Revisión de identidad",
      description:
        "Escribe en quién te estás convirtiendo al sostener tus hábitos.",
      suggestedDays: 30,
    },
  ],
};

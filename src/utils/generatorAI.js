// src/utils/generatorAI.js

import { RETOS_BASE } from "../data/retosBase";

/**
 * Elige un reto local desde RETOS_BASE según el perfil del usuario.
 */
function pickLocalTemplate(profile, frecuencia) {
  const areaConfig = RETOS_BASE[profile.area] || RETOS_BASE["Productividad"];
  if (!areaConfig) return null;

  const pool = areaConfig[frecuencia] || [];
  if (!pool || pool.length === 0) return null;

  const estilo = profile.estilo || "suave"; // suave | medio | intenso
  const nivelArea = profile.nivelArea || 1;

  let candidatos = pool;

  if (estilo === "suave") {
    candidatos = pool.filter((r) => r.nivel <= 2);
  } else if (estilo === "intenso") {
    candidatos = pool.filter((r) => r.nivel >= 2);
  }

  if (candidatos.length === 0) candidatos = pool;

  const elegido = candidatos[Math.floor(Math.random() * candidatos.length)];

  return {
    ...elegido,
    area: profile.area,
    frecuencia,
    origen: "local",
    sugerido: true,
  };
}

/**
 * Futuro: cuando conectes tu backend con IA, ya está preparado.
 */
async function askBackendForChallenge(profile, { frecuencia }) {
  // 🔮 Preparado para backend IA
  // try {
  //   const res = await fetch("https://TU_BACKEND/api/generar-reto", {...});
  //   const data = await res.json();
  //   return { ...data, origen: "ia-remota", sugerido: true };
  // } catch (e) {
  //   console.warn("Backend IA no disponible:", e);
  //   return null;
  // }

  return null; // por ahora no existe backend → fallback local
}

/**
 * Generador híbrido IA / local.
 */
export async function generateHybridChallenge(profile, { frecuencia }) {
  const remoto = await askBackendForChallenge(profile, { frecuencia });
  if (remoto) return remoto;

  return pickLocalTemplate(profile, frecuencia);
}

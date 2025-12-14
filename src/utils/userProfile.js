// src/utils/userProfile.js

/**
 * Crea un perfil simple del usuario para un área específica,
 * basado en su progreso actual.
 *
 * - area: string (ej. "Salud física")
 * - progreso: { diario, semanal, mensual, total, xp, nivelArea }
 * - ultimaEmocion: opcional (cuando más adelante conectes emociones)
 */
export function buildUserProfile({ area, progreso, ultimaEmocion = null }) {
  const diario = progreso?.diario || 0;
  const semanal = progreso?.semanal || 0;
  const mensual = progreso?.mensual || 0;
  const xp = progreso?.xp || 0;
  const nivelArea = progreso?.nivelArea || 1;

  const totalArea = diario + semanal + mensual;

  // Estilo: qué tan fuerte podemos empujar
  let estilo = "suave";
  if (totalArea >= 10 || xp >= 25) estilo = "intenso";
  else if (totalArea >= 4 || xp >= 10) estilo = "medio";

  // Frecuencia que más suele completar
  const mapaFrecuencia = { diario, semanal, mensual };
  const frecuenciaFuerte = Object.entries(mapaFrecuencia)
    .sort((a, b) => b[1] - a[1])[0][0];

  return {
    area,
    xpArea: xp,
    nivelArea,
    estilo,           // "suave" | "medio" | "intenso"
    frecuenciaFuerte, // "diario" | "semanal" | "mensual"
    ultimaEmocion: ultimaEmocion || null,
  };
}

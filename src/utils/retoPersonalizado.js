// src/utils/retoPersonalizado.js

import { buildUserProfile } from "./userProfile";
import { generateHybridChallenge } from "./generatorAI";

/**
 * Genera un reto personalizado por IA híbrida.
 */
export async function crearRetoPersonalizado({
  area,
  progreso,
  frecuencia = "diario",
  ultimaEmocion = null,
}) {
  const profile = buildUserProfile({
    area,
    progreso,
    ultimaEmocion,
  });

  const reto = await generateHybridChallenge(profile, { frecuencia });

  return reto;
}

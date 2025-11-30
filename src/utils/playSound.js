// src/utils/playSound.js
const soundCache = {};

export function playSound(name, volume = 0.4) {
  try {
    const file = `${name}.wav`;
    let audio = soundCache[file];

    if (!audio) {
      audio = new Audio(`/sounds/${file}`);
      soundCache[file] = audio;
    }

    audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (e) {
    // silencio si falla, para no romper nada
  }
}

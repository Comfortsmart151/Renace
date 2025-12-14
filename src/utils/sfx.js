export function playCompleteSound() {
  try {
    const audio = new Audio("/sounds/success.mp3");
    audio.volume = 0.12;
    audio.play().catch(() => {});
  } catch (err) {
    console.warn("Error reproduciendo sonido:", err);
  }
}

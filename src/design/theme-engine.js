/* ============================================================
   RENACE — THEME ENGINE v1
   Controla: Dark / Light / System + acentos dinámicos
   ============================================================ */

const ACCENTS = {
  morado: "#9b5cff",
  azul: "#4c9cff",
  rosa: "#ff5fa8",
};

export function applyAccent(accent) {
  const root = document.documentElement;
  root.style.setProperty("--accent-current", ACCENTS[accent]);
  localStorage.setItem("accent", accent);
}

export function applyTheme(mode) {
  const root = document.documentElement;
  localStorage.setItem("theme", mode);

  if (mode === "dark") {
    root.classList.add("theme-dark");
    root.classList.remove("theme-light");
    return;
  }

  if (mode === "light") {
    root.classList.add("theme-light");
    root.classList.remove("theme-dark");
    return;
  }

  // SYSTEM
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.classList.toggle("theme-dark", prefersDark);
  root.classList.toggle("theme-light", !prefersDark);
}

/* Initialize on load */
export function initThemeEngine() {
  const savedTheme = localStorage.getItem("theme") || "system";
  const savedAccent = localStorage.getItem("accent") || "morado";

  applyTheme(savedTheme);
  applyAccent(savedAccent);

  // Listen for OS changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (localStorage.getItem("theme") === "system") applyTheme("system");
  });
}

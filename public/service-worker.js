self.addEventListener("install", () => {
  console.log("Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service Worker activado");
  clients.claim();
});

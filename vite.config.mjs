// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // permite acceso desde otros dispositivos (móvil)
    port: 5173,        // puedes cambiarlo si lo deseas
    strictPort: true,  // evita que Vite cambie el puerto
  },
  preview: {
    host: true,        // también permite acceso a preview
    port: 4173,        // este puerto Vercel lo usa al hacer preview local
    strictPort: true,
  },
});

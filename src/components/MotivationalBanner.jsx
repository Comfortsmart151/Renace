import React, { useMemo, useState, useEffect } from "react";

export default function MotivationalBanner() {

  // 🔥 Imágenes oficiales de Unsplash (seguras)
  const BANNERS = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1503264116251-35a269479413",
  ];

  const PURPOSES = [
    "tu propósito hoy es elegir pensamientos que te sumen.",
    "tu propósito hoy es cuidarte con amor.",
    "tu propósito hoy es darte espacio y calma.",
    "tu propósito hoy es permitirte avanzar con suavidad.",
    "tu propósito hoy es escuchar tu verdad interior.",
    "tu propósito hoy es elegir claridad y paz.",
  ];

  // ✔ Elegir imagen (sin agregar parámetros)
  const randomUrl = useMemo(() => {
    const i = Math.floor(Math.random() * BANNERS.length);
    return `${BANNERS[i]}?auto=format&fit=crop&w=1600&q=80`;
  }, []);

  // ✔ Elegir propósito
  const purpose = useMemo(() => {
    const i = Math.floor(Math.random() * PURPOSES.length);
    return PURPOSES[i];
  }, []);

  // ✔ Estado de carga
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = randomUrl;
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true);
  }, [randomUrl]);

  return (
    <div className="banner-pro">
      {loaded ? (
        <img src={randomUrl} className="banner-pro-img" alt="Banner" />
      ) : (
        <div className="banner-fallback"></div>
      )}

      <div className="banner-pro-overlay"></div>

      <div className="banner-pro-text">
        <h2 className="banner-pro-purpose">{purpose}</h2>
      </div>
    </div>
  );
}

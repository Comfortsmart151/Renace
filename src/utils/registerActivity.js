// src/utils/registerActivity.js
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function registerActivity({
  userId = null,
  tipo = "actividad",
  titulo = "",
  descripcion = "",
  meta = {}
}) {
  try {
    const now = new Date();

    const localMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    await addDoc(collection(db, "historial"), {
      userId,
      tipo,
      titulo: titulo || null,
      descripcion,
      meta,
      fecha: localMidnight,
      createdAt: serverTimestamp(),
    });

  } catch (error) {
    console.error("Error registrando actividad:", error);
  }
}

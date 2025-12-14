// src/utils/saveToHistory.js
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function saveToHistory({ tipo, titulo, descripcion = "", extra = {} }) {
  try {
    await addDoc(collection(db, "historial"), {
      tipo,
      titulo,
      descripcion,
      fecha: Timestamp.now(),
      extra
    });
  } catch (e) {
    console.error("Error guardando en historial:", e);
  }
}

// src/AppContent.jsx
import React from "react";
import { useAuth } from "./context/AuthContext";
import LoadingScreen from "./components/LoadingScreen";
import MainApp from "./MainApp";

export default function AppContent() {
  const { loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return <MainApp />;
}

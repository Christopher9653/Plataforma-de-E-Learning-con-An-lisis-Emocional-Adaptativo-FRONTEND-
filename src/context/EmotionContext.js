"use client";

import { createContext, useContext, useState, useMemo } from "react";

/* ===============================
   CONTEXTO EMOCIONAL GLOBAL
=============================== */
const EmotionContext = createContext(null);

/* ===============================
   PROVIDER
=============================== */
export const EmotionProvider = ({ children }) => {
  const [emotionReport, setEmotionReport] = useState(null);

  // ✅ Función para limpiar el contexto
  const clearEmotionReport = () => {
    setEmotionReport(null);
  };

  // ✅ Evita renders innecesarios
  const value = useMemo(
    () => ({
      emotionReport,
      setEmotionReport,
      clearEmotionReport,
    }),
    [emotionReport]
  );

  return (
    <EmotionContext.Provider value={value}>
      {children}
    </EmotionContext.Provider>
  );
};

/* ===============================
   HOOK DE CONSUMO
=============================== */
export const useEmotion = () => {
  const context = useContext(EmotionContext);

  if (context === null) {
    throw new Error(
      "useEmotion debe usarse dentro de un EmotionProvider"
    );
  }

  return context;
};

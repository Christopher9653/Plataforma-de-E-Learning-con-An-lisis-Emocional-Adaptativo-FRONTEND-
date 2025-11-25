// src/components/emotion/EmotionDetector.js
import { useEffect, useState } from "react";
import WebcamFeed from "./WebcamFeed";
import EmotionStatusBox from "./EmotionStatusBox";

export default function EmotionDetector({ onDetect }) {
  const [emotions, setEmotions] = useState({
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    neutral: 0,
  });

  // 🔥 Simulación temporal (hasta integrar MorphCast real)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomEmotions = {
        joy: Math.floor(Math.random() * 100),
        sadness: Math.floor(Math.random() * 100),
        anger: Math.floor(Math.random() * 100),
        fear: Math.floor(Math.random() * 100),
        surprise: Math.floor(Math.random() * 100),
        neutral: Math.floor(Math.random() * 100),
      };

      setEmotions(randomEmotions);

      if (onDetect) onDetect(randomEmotions);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Cámara */}
      <WebcamFeed width={450} height={320} />

      {/* Estado emocional */}
      <EmotionStatusBox emotions={emotions} />
    </div>
  );
}

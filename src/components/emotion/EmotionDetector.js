import { useEffect, useRef } from "react";

export default function EmotionDetector({ onResult }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let engine;

    const loadMorphcast = async () => {
      if (typeof window === "undefined") return;

      // Cargar script si no existe
      if (!window.CY) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://ai-sdk.morphcast.com/v1.16/ai-sdk.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      const CY = window.CY;

      CY.loader()
        .licenseKey("skb1663adefe272deae8644453bf9e22b4b658995cf752") // ⬅️ Sustituye por la tuya
        .addModule(CY.modules().FACE_DETECTOR.name)
        .addModule(CY.modules().FACE_EMOTION.name)
        .source(videoRef.current)
        .load()
        .then((instance) => {
          engine = instance;

          instance.start();

          window.addEventListener(
            CY.modules().FACE_EMOTION.eventName,
            (evt) => {
              const data = evt.detail.output.emotion;
              if (onResult) onResult(data);
            }
          );
        });
    };

    loadMorphcast();

    return () => {
      if (engine) engine.stop();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      width="1"
      height="1"
      style={{ opacity: 0, pointerEvents: "none" }}
    />
  );
}

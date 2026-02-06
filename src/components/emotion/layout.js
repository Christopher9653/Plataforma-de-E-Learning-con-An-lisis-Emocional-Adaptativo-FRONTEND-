adapta el cambio en EmotionEngine.js: import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";

export default function EmotionEngine({ stop, onDataReady }) {
  const [records, setRecords] = useState([]);
  const stopRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const listenerRefs = useRef([]);
  const [currentEmotion, setCurrentEmotion] = useState("Analizando...");


  // Cargar MorphCast
  useEffect(() => {
    if (window._morphcastLoaded) return;
    window._morphcastLoaded = true;

    const script = document.createElement("script");
    script.src = "https://ai-sdk.morphcast.com/v1.16/ai-sdk.js";
    script.onload = () => initEngine();
    document.body.appendChild(script);
  }, []);

  function initEngine() {
    CY.loader()
      .licenseKey("skb1663adefe272deae8644453bf9e22b4b658995cf752")
      .addModule(CY.modules().FACE_EMOTION.name)
      .load()
      .then(({ start, stop }) => {
        stopRef.current = stop;
        start();
        attachListeners();
      });
  }

  function attachListeners() {
    const emotionListener = (evt) => {
      const rawEmotion = evt.detail.output.dominantEmotion;
      const emotion = rawEmotion || "Sin detección";
      const t = Date.now() - startTimeRef.current;
      setCurrentEmotion(emotion);  // ← ACTUALIZA EN TIEMPO REAL


      setRecords((prev) => [...prev, { emotion, t }]);
    };

    window.addEventListener(CY.modules().FACE_EMOTION.eventName, emotionListener);

    listenerRefs.current.push({
      emotionListener,
    });
  }

  // Detener engine
  useEffect(() => {
    if (stop && stopRef.current) {
      stopRef.current();

      const video = document.getElementById("morphcastCamera");
      const tracks = video?.srcObject?.getTracks();
      tracks?.forEach((t) => t.stop());

      listenerRefs.current.forEach((ref) => {
        window.removeEventListener(CY.modules().FACE_EMOTION.eventName, ref.emotionListener);
      });
    }
  }, [stop]);

  // Exportar PDF simple (la versión que ya funcionaba antes)
const exportPDF = () => {
  const pdf = new jsPDF("p", "mm", "a4");
  const W = pdf.internal.pageSize.getWidth();

  // ============================
  //  ENCABEZADO
  // ============================
  pdf.setFontSize(22);
  pdf.text("INFORME EMOCIONAL — EDUMOTION", W / 2, 20, { align: "center" });

  pdf.setLineWidth(0.5);
  pdf.line(10, 25, W - 10, 25);

  pdf.setFontSize(12);
  pdf.text(`Fecha: ${new Date().toLocaleString()}`, 10, 35);
  pdf.text(`Registros capturados: ${records.length}`, 10, 42);

  const duracion = (records.at(-1)?.t / 1000 || 0).toFixed(1);
  pdf.text(`Duración analizada: ${duracion} s`, 10, 49);

  // ============================
  //  RESUMEN GENERAL
  // ============================
  pdf.setFontSize(16);
  pdf.text("Resumen General", 10, 65);

  pdf.setFontSize(12);

  // Conteo de emociones
  const emotionCount = {};
  records.forEach(r => {
    emotionCount[r.emotion] = (emotionCount[r.emotion] || 0) + 1;
  });

  const topEmotion =
    Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Sin detección";

  pdf.text(`• Emoción predominante: ${topEmotion}`, 10, 78);

  // Cambios de emoción
  let cambios = 0;
  for (let i = 1; i < records.length; i++) {
    if (records[i].emotion !== records[i - 1].emotion) cambios++;
  }

  pdf.text(`• Cambios emocionales detectados: ${cambios}`, 10, 86);

  // Estabilidad simple
  let estabilidad = "Alta";
  if (cambios > 5) estabilidad = "Media";
  if (cambios > 12) estabilidad = "Baja";

  pdf.text(`• Estabilidad emocional: ${estabilidad}`, 10, 94);

  pdf.setLineWidth(0.3);
  pdf.line(10, 105, W - 10, 105);

  // ============================
  //  LISTA DE REGISTROS (sin emojis)
  // ============================
  pdf.setFontSize(16);
  pdf.text("Detalle de Registros", 10, 120);

  pdf.setFontSize(11);

  let y = 130;

  records.slice(0, 20).forEach((r, i) => {
    if (y > 270) {
      pdf.addPage();
      y = 20;
    }

    pdf.text(
      `${i + 1})  Emoción: ${r.emotion}    —    Tiempo: ${(r.t / 1000).toFixed(1)} s`,
      10,
      y
    );

    y += 8;
  });

  // ============================
  //  CONCLUSIÓN
  // ============================
  if (y > 250) {
    pdf.addPage();
    y = 20;
  }

  pdf.setFontSize(16);
  pdf.text("Conclusión", 10, y + 10);
  pdf.setFontSize(12);

  const conclusion =
    cambios <= 4
      ? "El estudiante mantuvo una emoción estable durante la sesión."
      : cambios <= 10
      ? "El estudiante mostró variaciones moderadas en sus emociones."
      : "Se detectó alta variabilidad emocional a lo largo de la sesión.";

  pdf.text(conclusion, 10, y + 20);

  // ============================
  //  PIE DE PÁGINA
  // ============================
  pdf.setFontSize(10);
  pdf.text(
    "Edumotion — Sistema de Análisis Emocional en Clases Virtuales — © 2025",
    10,
    290
  );

  pdf.save("informe_emocional.pdf");
};


  // Exportar JSON
const exportJSON = () => {
  if (records.length === 0) {
    alert("No hay registros para exportar.");
    return;
  }

  // ---------- Construir JSON mejorado ----------
  const emotionCount = {};
  let sumArousal = 0;
  let sumValence = 0;
  let sumAttention = 0;
  let countArousal = 0;
  let countValence = 0;
  let countAttention = 0;

  records.forEach((r) => {
    // Conteo emociones
    if (r.emotion) {
      emotionCount[r.emotion] = (emotionCount[r.emotion] || 0) + 1;
    }

    // Promedios
    if (typeof r.arousal === "number") {
      sumArousal += r.arousal;
      countArousal++;
    }
    if (typeof r.valence === "number") {
      sumValence += r.valence;
      countValence++;
    }
    if (typeof r.attention === "number") {
      sumAttention += r.attention;
      countAttention++;
    }
  });

  // Emoción predominante
  const topEmotion =
    Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Sin detección";

  // Calcular promedios
  const avgArousal = countArousal ? sumArousal / countArousal : null;
  const avgValence = countValence ? sumValence / countValence : null;
  const avgAttention = countAttention ? sumAttention / countAttention : null;

  // ---------- Construcción del informe ----------
  const report = {
    metadata: {
      titulo: "Informe Emocional del Estudiante",
      fecha: new Date().toLocaleString(),
      duracion_segundos: parseFloat((records.at(-1).t / 1000).toFixed(1)),
      total_registros: records.length,
    },

    resumen: {
      emocion_predominante: topEmotion,
      promedios: {
        arousal: avgArousal ? Number(avgArousal.toFixed(3)) : null,
        valencia: avgValence ? Number(avgValence.toFixed(3)) : null,
        atencion: avgAttention ? Number(avgAttention.toFixed(3)) : null,
      },
      distribucion_emociones: emotionCount,
    },

    datos: records.map((r) => ({
      tiempo_s: parseFloat((r.t / 1000).toFixed(2)),
      emocion: r.emotion,
      arousal: r.arousal ?? null,
      valencia: r.valence ?? null,
      atencion: r.attention ?? null,
    })),
  };

  // ---------- Exportar ----------
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "informe_emocional.json";
  a.click();
};


useEffect(() => {
  onDataReady({
    exportJSON,
    exportPDF,
    currentEmotion,      // ← AGREGADO
  });
}, [records, currentEmotion]);


  return (
    <video
      id="morphcastCamera"
      data-cy-video
      autoPlay
      muted
      playsInline
      style={{ width: 0, height: 0, opacity: 0 }}
    ></video>
  );
}

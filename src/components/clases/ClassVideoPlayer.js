import { useState, useEffect, useRef } from "react";
import EmotionEngine from "@/components/emotion/EmotionEngine";
import { useRouter } from "next/router";

export default function ClassVideoPlayer({ curso }) {
  const [videoActual, setVideoActual] = useState({
    titulo: "",
    videoUrl: "",
  });

  const [modulosAbiertos, setModulosAbiertos] = useState({});
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [emocionActual, setEmocionActual] = useState("Analizando...");

  // MORPHCAST
  const [accepted, setAccepted] = useState(false);
  const [stopEmotion, setStopEmotion] = useState(false);
  const [emotionTools, setEmotionTools] = useState(null);

  const videoRef = useRef(null);

  // ================================
  // CARGAR PRIMERA CLASE
  // ================================
  useEffect(() => {
    if (curso?.modulos?.length > 0) {
      const primera = curso.modulos[0].clases[0];
      setVideoActual({
        titulo: primera.titulo,
        videoUrl: primera.videoUrl,
      });
    }
  }, [curso]);

  // ================================
  // CAMBIAR DE CLASE
  // ================================
  const handleClassChange = (clase) => {
    if (videoPlaying) return;

    setVideoActual({
      titulo: clase.titulo,
      videoUrl: clase.videoUrl,
    });

    // reset del análisis
    setAccepted(false);
    setEmotionTools(null);

    setStopEmotion(true); // detener engine actual
    setTimeout(() => setStopEmotion(false), 200); // reiniciar engine
    setVideoPlaying(false);
  };

  // ================================
  // ABRIR / CERRAR MÓDULO
  // ================================
  const toggleModulo = (i) => {
    if (videoPlaying) return;
    setModulosAbiertos((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  // ================================
  // EVITAR PAUSA
  // ================================
useEffect(() => {
  if (!videoRef.current) return;

  const vid = videoRef.current;

  const handlePause = () => {
    // 🔥 Si el video terminó, NO volver a reproducir
    if (vid.ended) return;

    // 🔥 Evitar pausa manual solo mientras está playing
    if (videoPlaying) vid.play();
  };

  vid.addEventListener("pause", handlePause);
  return () => vid.removeEventListener("pause", handlePause);
}, [videoPlaying]);
  // boton Volver
  const router = useRouter();
  //Boton siguiente
  const goToNextClass = () => {
    if (videoPlaying) return; // No avanzar si el video está en reproducción

    const modulos = curso?.modulos || [];

    // 1️⃣ Aplanar todas las clases de todos los módulos en un solo array
    const todasLasClases = [];
    modulos.forEach((mod) => {
      mod.clases.forEach((cl) => {
        todasLasClases.push({
          moduloId: mod.id,
          ...cl,
        });
      });
    });

    // 2️⃣ Encontrar la clase actual
    const indexActual = todasLasClases.findIndex(
      (cl) => cl.videoUrl === videoActual.videoUrl
    );

    if (indexActual === -1) {
      console.warn("Clase actual no encontrada en el curso.");
      return;
    }

    // 3️⃣ Determinar si existe una siguiente clase
    const indexSiguiente = indexActual + 1;

    if (indexSiguiente < todasLasClases.length) {
      const nextClase = todasLasClases[indexSiguiente];

      // Cambiar a la siguiente clase
      setVideoActual({
        titulo: nextClase.titulo,
        videoUrl: nextClase.videoUrl,
      });

      // 🔄 Reiniciar MorphCast sin tocar la UI que ya tienes
      setAccepted(false);
      setEmotionTools(null);
      setStopEmotion(true);
    } else {
      alert("Has llegado al final del curso.");
    }
  };

  // ================================
  // RENDER
  // ================================
  return (
    <div className="w-full h-screen flex flex-col bg-[#f4f4f4]">
      {/* TOP BAR */}
      <div className="w-full bg-[#1c1d1f] text-white px-6 py-3 flex justify-between items-center shadow-lg">
        <div className="text-lg font-medium">
          Curso: {curso?.nombre || "Cargando..."}{" "}
          <span className="text-sm opacity-80">(Progreso: 45%)</span>
        </div>

        <div className="flex gap-6 text-sm">
          <button
            disabled={videoPlaying}
            onClick={() => router.push("/estudiante/clases")}
            className={`${
              videoPlaying
                ? "opacity-40 cursor-not-allowed"
                : "hover:text-blue-300"
            }`}
          >
            ◀ Volver
          </button>

          <button
            disabled={videoPlaying}
            onClick={goToNextClass}
            className={`${
              videoPlaying
                ? "opacity-40 cursor-not-allowed"
                : "hover:text-blue-300"
            }`}
          >
            Siguiente lección ▶
          </button>

          <button
            disabled={videoPlaying}
            className={`${
              videoPlaying
                ? "opacity-40 cursor-not-allowed"
                : "hover:text-blue-300"
            }`}
          >
            Configuración
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* VIDEO */}
        <div className="flex-1 bg-black flex flex-col items-center overflow-y-auto p-6">
          <div className="flex flex-col items-center w-full">
            {/* POPUP ACEPTACIÓN */}
            {!accepted && (
              <div className="bg-white p-6 rounded-lg shadow-lg text-center mb-5 w-[400px]">
                <h2 className="text-xl font-semibold mb-3">
                  Permitir Análisis Emocional
                </h2>
                <p className="text-gray-600 mb-4">
                  Para continuar con esta clase es necesario permitir el
                  análisis emocional.
                </p>

                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  onClick={() => {
                    setAccepted(true);
                    setStopEmotion(false);

                    setTimeout(() => {
                      if (videoRef.current) {
                        videoRef.current
                          .play()
                          .catch(() => console.warn("Autoplay bloqueado"));
                      }
                    }, 300);
                  }}
                >
                  Aceptar y comenzar clase
                </button>
              </div>
            )}

            {/* ENGINE */}
            {accepted && (
              <EmotionEngine
                stop={stopEmotion}
                onDataReady={(tools) => {
                  setEmotionTools(tools);
                  setEmocionActual(tools.currentEmotion);
                }}
              />
            )}

            {/* VIDEO PLAYER */}
            <div className="w-[1200px] h-[720px] rounded-lg overflow-hidden border border-gray-700 shadow-xl">
              <video
                ref={videoRef}
                key={videoActual.videoUrl}
                controls={false}
                className="w-full h-full object-contain bg-black"
                onPlay={() => setVideoPlaying(true)}
                onEnded={() => {
                  setVideoPlaying(false);
                  setStopEmotion(true); // detener análisis
                }}
              >
                <source src={videoActual.videoUrl} type="video/mp4" />
              </video>
            </div>

            <h2 className="text-white text-xl font-semibold mt-4">
              {videoActual.titulo}
            </h2>

            {/* INFO EMOCIONAL */}
            <div className="text-white">
              <strong>Emoción actual:</strong>{" "}
              {emotionTools?.currentEmotion || "Analizando..."}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-[350px] bg-white border-l overflow-y-auto p-6 shadow-inner">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Contenido del Curso
          </h3>

          {curso?.modulos?.map((mod, i) => (
            <div key={i} className="mb-4 border rounded-lg overflow-hidden">
              <div
                onClick={() => toggleModulo(i)}
                className={`cursor-pointer bg-gray-100 px-4 py-3 flex justify-between items-center font-semibold 
                  ${
                    videoPlaying
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
              >
                {mod.nombre}
                <span>{modulosAbiertos[i] ? "▲" : "▼"}</span>
              </div>

              {modulosAbiertos[i] && (
                <div>
                  {mod.clases.map((cl, j) => (
                    <div
                      key={j}
                      onClick={() => handleClassChange(cl)}
                      className={`px-4 py-3 border-t 
                      ${
                        videoPlaying
                          ? "opacity-40 cursor-not-allowed"
                          : "cursor-pointer hover:bg-gray-100"
                      }`}
                    >
                      ▶ {cl.titulo}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            disabled={!emotionTools}
            onClick={() => emotionTools?.exportJSON()}
            className="mt-4 px-4 py-2 bg-gray-800 text-white w-full rounded-lg"
          >
            Exportar JSON
          </button>

          <button
            disabled={!emotionTools}
            onClick={() => emotionTools?.exportPDF()}
            className="mt-2 px-4 py-2 bg-red-600 text-white w-full rounded-lg"
          >
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import EmotionEngine from "@/components/emotion/EmotionEngine";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useEmotion } from "@/context/EmotionContext";


export default function ClassVideoPlayer({ curso }) {
  const router = useRouter();

  const [videoActual, setVideoActual] = useState(null);
  const [modulosAbiertos, setModulosAbiertos] = useState({});
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  // MORPHCAST
  const [accepted, setAccepted] = useState(false);
  const [stopEmotion, setStopEmotion] = useState(false);
  const [emotionTools, setEmotionTools] = useState(null);
  const { user, token } = useContext(AuthContext);

  //Para backend
  const [emotionalReport, setEmotionalReport] = useState(null);
  const [enviandoPrueba, setEnviandoPrueba] = useState(false);

  //Para guardar emotion_report
  const { setEmotionReport } = useEmotion();


  const videoRef = useRef(null);

  // ================================
  // CARGAR PRIMERA CLASE (BACKEND)
  // ================================
  useEffect(() => {
    if (!curso || !Array.isArray(curso.modulos)) return;

    const primerModulo = curso.modulos.find(
      (m) => Array.isArray(m.clases) && m.clases.length > 0
    );

    if (!primerModulo) return;

    const primeraClase = primerModulo.clases[0];

    setVideoActual({
      id: primeraClase.id,
      titulo: primeraClase.title || primeraClase.titulo,
      videoUrl: primeraClase.video_url || primeraClase.videoUrl,
      id_prueba: primeraClase.id_prueba || null,
    });
  }, [curso]);

  // ================================
  // CAMBIAR DE CLASE
  // ================================
  const handleClassChange = (clase) => {
    if (videoPlaying) return;

    if (isClaseBloqueada(clase)) {
      alert("Debes aprobar la prueba de esta clase para continuar.");
      return;
    }

    setVideoActual({
      id: clase.id,
      titulo: clase.title || clase.titulo,
      videoUrl: clase.video_url || clase.videoUrl,
      id_prueba: clase.id_prueba || null,
    });

    setAccepted(false);
    setEmotionTools(null);
    setStopEmotion(true);
    setTimeout(() => setStopEmotion(false), 200);
    setVideoPlaying(false);
    setVideoEnded(false);
  };

  // ================================
  // ABRIR / CERRAR MÓDULO
  // ================================
  const toggleModulo = (i) => {
    if (videoPlaying) return;
    setModulosAbiertos((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  // ================================
  // EVITAR PAUSA DEL VIDEO
  // ================================
  useEffect(() => {
    if (!videoRef.current) return;

    const vid = videoRef.current;

    const handlePause = () => {
      if (vid.ended) return;
      if (videoPlaying) vid.play();
    };

    vid.addEventListener("pause", handlePause);
    return () => vid.removeEventListener("pause", handlePause);
  }, [videoPlaying]);

  // ================================
  // SIGUIENTE CLASE (FIX DEFINITIVO)
  // ================================
  const goToNextClass = () => {
    if (!curso?.modulos?.length || !videoActual) return;

    const todasLasClases = curso.modulos.flatMap((m) =>
      Array.isArray(m.clases) ? m.clases : []
    );

    if (!todasLasClases.length) return;

    const indexActual = todasLasClases.findIndex(
      (c) => c.id === videoActual.id
    );

    const siguiente = todasLasClases[indexActual + 1];

    if (!siguiente) {
      alert("Has llegado al final del curso.");
      return;
    }

    if (isClaseBloqueada(siguiente)) {
      alert("Debes aprobar la prueba antes de avanzar.");
      return;
    }

    setVideoActual({
      id: siguiente.id,
      titulo: siguiente.title || siguiente.titulo,
      videoUrl: siguiente.video_url || siguiente.videoUrl,
      id_prueba: siguiente.id_prueba || null,
    });

    setAccepted(false);
    setEmotionTools(null);
    setStopEmotion(true);
    setVideoEnded(false);
  };

  // ================================
  // BLOQUEO DE CLASES (TEMPORAL)
  // ================================
  const isClaseBloqueada = (clase) => {
    if (!clase?.id_prueba) return false;

    const progreso = JSON.parse(localStorage.getItem("progresoCursos")) || {};

    return !progreso?.[curso.id]?.pruebas?.[clase.id_prueba]?.aprobado;
  };

  // ================================
  // GUARDAR REPORTE EMOCIONAL (LOCAL)
  // ================================
  const guardarReporteEmocional = (report) => {
    if (!report || !curso?.id || !videoActual?.id) return;

    const progreso = JSON.parse(localStorage.getItem("progresoCursos")) || {};
    const cursoId = curso.id;
    const claseId = videoActual.id;

    const current = progreso[cursoId] || {};
    const emociones = current.emociones || {};

    emociones[claseId] = {
      titulo: videoActual.titulo,
      fecha: new Date().toISOString(),
      resumen: report.resumen,
      metadata: report.metadata,
      datos: report.datos,
    };

    progreso[cursoId] = { ...current, emociones };
    localStorage.setItem("progresoCursos", JSON.stringify(progreso));
  };

  // ================================
  // Generador de Prueba
  // ================================
const generarPrueba = async () => {
  try {
    setEnviandoPrueba(true);
    const report = emotionTools?.getReport();
     if (!report) {
    alert("No se ha generado el reporte emocional.");
    console.log("No se ha ggenerado: ",report);
    setEnviandoPrueba(false);
    return;
  }

    // ✅ Guardar en contexto global
    setEmotionReport(report);

    const res = await fetch("https://edumotion-backend1.onrender.com/generate-test-attempt/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        student_id: user.id,
        chapter_id: videoActual.id,
        informe_emocional: emotionalReport,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }

    router.push(`/dashboard/estudiante/quizzes/${videoActual.id}`);
  } catch (err) {
    console.error("Error al generar prueba:", err.message);
    alert("No se pudo generar la prueba");
  } finally {
    setEnviandoPrueba(false);
  }
};


  // ================================
  // LOADING
  // ================================
  if (!curso || !videoActual) {
    return <p className="p-6">Cargando curso...</p>;
  }

  // ================================
  // RENDER
  // ================================
  return (
    <div className="w-full h-screen flex flex-col bg-[#f4f4f4]">
      {/* TOP BAR */}
      <div className="w-full bg-[#1c1d1f] text-white px-6 py-3 flex justify-between items-center shadow-lg">
        <div className="text-lg font-medium">
          Curso: {curso.title || curso.nombre}
        </div>

        <div className="flex gap-6 text-sm">
          <button
            disabled={videoPlaying}
            onClick={() => router.push("/dashboard/estudiante/cursos")}
            className={
              videoPlaying
                ? "opacity-40 cursor-not-allowed"
                : "hover:text-blue-300"
            }
          >
            ◀ Volver
          </button>

          <button
            disabled={videoPlaying}
            onClick={goToNextClass}
            className={
              videoPlaying
                ? "opacity-40 cursor-not-allowed"
                : "hover:text-blue-300"
            }
          >
            Siguiente lección ▶
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* VIDEO */}
        <div className="flex-1 bg-black flex flex-col items-center p-6">
          {!accepted && (
            <div className="bg-white p-6 rounded-lg shadow-lg text-center mb-5 w-[400px]">
              <h2 className="text-xl font-semibold mb-3">
                Permitir Análisis Emocional
              </h2>
              <p className="text-gray-600 mb-4">
                Es necesario permitir el análisis emocional para continuar.
              </p>

              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setAccepted(true);
                  setStopEmotion(false);
                  setTimeout(() => videoRef.current?.play(), 300);
                }}
              >
                Aceptar y comenzar clase
              </button>
            </div>
          )}

          {accepted && (
            <EmotionEngine
              stop={stopEmotion}
              onDataReady={(tools) => setEmotionTools(tools)}
            />
          )}

          <div className="w-[1200px] h-[720px] rounded-lg overflow-hidden border shadow-xl">
            <video
              ref={videoRef}
              key={videoActual.videoUrl}
              className="w-full h-full object-contain bg-black"
              controls={false}
              onPlay={() => {
                setVideoPlaying(true);
                setVideoEnded(false);
              }}
              onEnded={() => {
                setVideoPlaying(false);
                setVideoEnded(true);
                setStopEmotion(true);
                const report = emotionTools?.getReport();
                if (report) {
                  guardarReporteEmocional(report);
                  setEmotionReport(report);
                }

                if (videoActual.id_prueba) {
                  router.push(`/estudiante/pruebas/${videoActual.id_prueba}`);
                }
              }}
            >
              <source src={videoActual.videoUrl} type="video/mp4" />
            </video>
          </div>

          <h2 className="text-white text-xl font-semibold mt-4">
            {videoActual.titulo}
          </h2>

          <button
            onClick={generarPrueba}
            disabled={!emotionTools || enviandoPrueba || !videoEnded}
            className={`mt-4 px-6 py-2 rounded-lg text-white ${
              !emotionTools || enviandoPrueba || !videoEnded
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {enviandoPrueba ? "Generando..." : "Generar prueba"}
          </button>
          {accepted && videoPlaying && !videoEnded && (
            <p className="mt-2 text-sm text-gray-300">
              Debes terminar la clase para generar la prueba.
            </p>
          )}
          {enviandoPrueba && (
            <div className="mt-3 w-[320px] h-2 bg-gray-200 rounded overflow-hidden">
              <div className="h-full bg-green-600 animate-pulse" />
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="w-[350px] bg-white border-l p-6 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Contenido del Curso</h3>

          {curso.modulos.map((mod, i) => (
            <div key={i} className="mb-4 border rounded-lg">
              <div
                onClick={() => toggleModulo(i)}
                className="cursor-pointer bg-gray-100 px-4 py-3 flex justify-between font-semibold"
              >
                {mod.title || mod.nombre}
                <span>{modulosAbiertos[i] ? "▲" : "▼"}</span>
              </div>

              {modulosAbiertos[i] &&
                mod.clases?.map((cl) => (
                  <div
                    key={cl.id}
                    onClick={() => handleClassChange(cl)}
                    className="px-4 py-3 border-t cursor-pointer hover:bg-gray-100"
                  >
                    ▶ {cl.title || cl.titulo}
                  </div>
                ))}
            </div>
          ))}

          <button
            disabled={!emotionTools}
            onClick={() => emotionTools?.exportJSON()}
            className="mt-4 w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
          >
            Exportar JSON
          </button>

          <button
            disabled={!emotionTools}
            onClick={() => emotionTools?.exportPDF()}
            className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

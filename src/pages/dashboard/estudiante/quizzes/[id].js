"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";
import { useEmotion } from "@/context/EmotionContext";
import jsPDF from "jspdf";

const API = "https://edumotion-backend1.onrender.com/api";

export default function ResolverQuizEstudiante() {
  const router = useRouter();
  const attemptId = router.query.id;
  const { user, token } = useContext(AuthContext);
  const { emotionReport, clearEmotionReport } = useEmotion();

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [rawTest, setRawTest] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const curso = attempt?.student_config?.course;


  /* ===============================
     1️⃣ CARGAR INTENTO
  =============================== */
  useEffect(() => {
    if (!router.isReady || !attemptId || !user) return;

    const loadAttempt = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API}/test-attempts/?student_id=${user.id}&chapter_id=${attemptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("No se pudo listar intentos");

        const data = await res.json();
        const intento = Array.isArray(data) ? data[0] : null;

        if (!intento) throw new Error("No se encontró intento");

        setAttempt(intento);

        if (intento.generated_test) {
          setRawTest(intento.generated_test);
        }
      } catch (err) {
        console.error("❌ Error cargando intento:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAttempt();
  }, [attemptId, user, token, router.isReady]);

  /* ===============================
     2️⃣ ENVIAR RESPUESTA
  =============================== */
  const enviarRespuesta = async () => {
    if (!answerText.trim()) {
      setStatusMessage("⚠️ Debes escribir tus respuestas antes de enviar.");
      return;
    }

    const emotionalData = attempt?.emotional_report || emotionReport;

    if (!emotionalData) {
      setStatusMessage("⚠️ No se encontró reporte emocional.");
      return;
    }

    try {
      setSending(true);
      setStatusMessage("");

      const url = `${API}/test-attempts/${attempt.id}/grade/`;
      const combinedText = `PRUEBA:
${rawTest}

RESPUESTAS DEL ESTUDIANTE:
${answerText}`;

      const payload = {
        emotional_report: emotionalData,
        generated_test: rawTest,
        student_answers: combinedText,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setAttempt(data.test_attempt);
      setStatusMessage("✅ Respuesta enviada y calificada.");

      clearEmotionReport();
    } catch (err) {
      console.error("❌ Error enviando respuesta:", err);
      setStatusMessage("❌ Error al enviar la respuesta.");
    } finally {
      setSending(false);
    }
  };

  /* ===============================
     3️⃣ DESCARGAR PDF
  =============================== */
  const descargarPDF = () => {
    if (!attempt || attempt.status !== "graded") return;

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Retroalimentación de la Evaluación", 10, 15);

    doc.setFontSize(10);
    doc.text(`Estudiante: ${user?.fullname || user?.email}`, 10, 25);
    doc.text(
      `Capítulo: ${attempt?.student_config?.chapter?.title || ""}`,
      10,
      32
    );
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 10, 39);

    doc.setFontSize(11);
    doc.text("Resultado:", 10, 50);

    doc.setFontSize(10);
    doc.text(
      doc.splitTextToSize(attempt.grade_result, 180),
      10,
      58
    );

    doc.save(`retroalimentacion_intento_${attempt.id}.pdf`);
  };

  /* ===============================
     LOADING
  =============================== */
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500 animate-pulse">Cargando prueba...</p>
        </div>
      </MainLayout>
    );
  }

  /* ===============================
     RENDER
  =============================== */
  return (
    <AuthGuard role="estudiante">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">
          {/* ENCABEZADO */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Evaluación: {attempt?.student_config?.chapter?.title || "Clase"}
            </h1>
            <p className="text-gray-600">
              Estudiante: {user?.fullname || user?.email} | Intento ID:{" "}
              {attempt?.id}
            </p>
          </div>

          {attempt && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* PRUEBA */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Cuestionario
                </h2>

                <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
                  {rawTest}
                </pre>
              </div>

              {/* RESULTADO / RESPUESTA */}
              <div className="bg-white p-6 rounded-lg shadow flex flex-col">
                <h2 className="text-xl font-semibold mb-4">
                  {attempt.status === "graded"
                    ? "📊 Retroalimentación"
                    : "Tu respuesta"}
                </h2>

                {attempt.status === "graded" ? (
                  <>
                    <div className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
                      {attempt.grade_result}
                    </div>

                    <div className="mt-6 flex gap-4">
                      <button
                      
                        onClick={() =>
                          router.push(
                            
                            `/dashboard/estudiante/cursos`
                          )
                        }
                        className="flex-1 bg-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition"
                      >
                        ⬅ Regresar al curso
                      </button>

                      {/* <button
                        onClick={descargarPDF}
                        className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
                      >
                        📄 Descargar PDF
                      </button> */}
                    </div>
                  </>
                ) : (
                  <>
                    <textarea
                      className="w-full flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                      rows={12}
                      placeholder="Esto es un ejemplo de cómo debe colocar tu respuesta: 
                      1.- Respuesta 
                      2.- Respuesta"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                    />

                    {statusMessage && (
                      <p className="mt-3 text-sm text-gray-600">
                        {statusMessage}
                      </p>
                    )}

                    <button
                      disabled={sending}
                      onClick={enviarRespuesta}
                      className="mt-5 w-full bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {sending ? "Enviando..." : "Enviar Evaluación"}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

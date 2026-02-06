"use client";

import { useEffect, useState, useContext } from "react";
import jsPDF from "jspdf";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";
import ReportAnalysis from "@/components/reports/ReportAnalysis";

const API = "https://edumotion-backend1.onrender.com/api/";

export default function ProgresoEstudiante() {
  const { user } = useContext(AuthContext);

  const [cursos, setCursos] = useState([]);
  const [progreso, setProgreso] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReport, setModalReport] = useState(null);
  const [modalMeta, setModalMeta] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackModalData, setFeedbackModalData] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState({});
  const [feedbackError, setFeedbackError] = useState({});

  useEffect(() => {
    if (!user || user.role !== "estudiante") {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // 1️⃣ Cursos reales del backend
        const res = await fetch(
          `${API}/fetch-enrolled-courses/${user.id}`
        );

        if (!res.ok) throw new Error("Error cursos");

        const cursosData = await res.json();
        const listaCursos = (cursosData || [])
          .map((item) => item.course || item)
          .filter(Boolean);

        const cursosConModulos = await Promise.all(
          listaCursos.map(async (curso) => {
            const resMod = await fetch(`${API}/course/${curso.id}/modules/`);
            const modulos = resMod.ok ? await resMod.json() : [];
            const modulosConClases = await Promise.all(
              modulos.map(async (mod) => {
                const resVid = await fetch(`${API}/modules/${mod.id}/videos/`);
                const clases = resVid.ok ? await resVid.json() : [];
                return { ...mod, clases };
              })
            );
            return { ...curso, modulos: modulosConClases };
          })
        );

        setCursos(cursosConModulos);

        // 2️⃣ Progreso (localStorage por ahora)
        const progresoLocal =
          JSON.parse(localStorage.getItem("progresoCursos")) || {};

        setProgreso(progresoLocal);
      } catch (err) {
        console.error("Error progreso:", err);
        setCursos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-10">Cargando progreso...</div>
      </MainLayout>
    );
  }

  return (
    <AuthGuard role="estudiante">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Mi Progreso
          </h1>

          {cursos.length === 0 ? (
            <p className="text-gray-500">
              No tienes cursos inscritos.
            </p>
          ) : (
            <div className="space-y-6">
              {cursos.map((curso) => {
                const prog = progreso[curso.id] || {};
                const porcentaje = prog.porcentaje || 0;
                const emociones = prog.emociones || {};

                return (
                  <div
                    key={curso.id}
                    className="bg-white p-6 rounded-lg shadow"
                  >
                    <h2 className="text-xl font-semibold text-gray-800">
                      {curso.title}
                    </h2>

                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        Progreso: {porcentaje}%
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Clases completadas:{" "}
                        {prog.clasesCompletadas || 0}
                      </p>
                    </div>

                    {/* Reportes emocionales por curso / módulo / clase */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Reportes emocionales
                      </h3>

                      {curso.modulos && curso.modulos.length > 0 ? (
                        <div className="space-y-4">
                          {curso.modulos.map((mod) => (
                            <div key={mod.id} className="border rounded-lg bg-gray-50">
                              <div className="px-4 py-3 font-semibold text-gray-700">
                                Sección: {mod.title}
                              </div>
                              <div className="px-4 pb-4">
                                {mod.clases && mod.clases.length > 0 ? (
                                  <div className="space-y-3">
                                    {mod.clases.map((clase) => {
                                      const reporte = emociones?.[clase.id];

                                      const descargarReportePDF = () => {
                                        if (!reporte) return;
                                        const pdf = new jsPDF("p", "mm", "a4");
                                        const W = pdf.internal.pageSize.getWidth();

                                        const titulo =
                                          reporte?.metadata?.titulo ||
                                          "INFORME EMOCIONAL — EDUMOTION";
                                        const fecha =
                                          reporte?.fecha ||
                                          reporte?.metadata?.fecha ||
                                          new Date().toLocaleString();
                                        const totalRegistros =
                                          reporte?.metadata?.total_registros ?? 0;
                                        const duracion =
                                          reporte?.metadata?.duracion_segundos ?? 0;

                                        // Encabezado
                                        pdf.setFontSize(22);
                                        pdf.text(titulo, W / 2, 20, { align: "center" });
                                        pdf.setLineWidth(0.5);
                                        pdf.line(10, 25, W - 10, 25);

                                        pdf.setFontSize(12);
                                        pdf.text(`Curso: ${curso.title}`, 10, 35);
                                        pdf.text(
                                          `Clase: ${clase.title || clase.titulo || clase.id}`,
                                          10,
                                          42
                                        );
                                        pdf.text(`Fecha: ${fecha}`, 10, 49);
                                        pdf.text(`Registros capturados: ${totalRegistros}`, 10, 56);
                                        pdf.text(`Duración analizada: ${duracion} s`, 10, 63);

                                        // Resumen general
                                        pdf.setFontSize(16);
                                        pdf.text("Resumen General", 10, 78);
                                        pdf.setFontSize(12);

                                        const distribucion =
                                          reporte?.resumen?.distribucion_emociones || {};
                                        const emocionPred =
                                          reporte?.resumen?.emocion_predominante ||
                                          "Sin detección";

                                        pdf.text(`• Emoción predominante: ${emocionPred}`, 10, 90);

                                        // Cambios emocionales (derivados de datos)
                                        const datos = Array.isArray(reporte?.datos)
                                          ? reporte.datos
                                          : [];
                                        let cambios = 0;
                                        for (let i = 1; i < datos.length; i++) {
                                          if (datos[i].emocion !== datos[i - 1].emocion) cambios++;
                                        }
                                        pdf.text(
                                          `• Cambios emocionales detectados: ${cambios}`,
                                          10,
                                          98
                                        );

                                        let estabilidad = "Alta";
                                        if (cambios > 5) estabilidad = "Media";
                                        if (cambios > 12) estabilidad = "Baja";
                                        pdf.text(`• Estabilidad emocional: ${estabilidad}`, 10, 106);

                                        pdf.setLineWidth(0.3);
                                        pdf.line(10, 116, W - 10, 116);

                                        // Distribución emocional
                                        pdf.setFontSize(16);
                                        pdf.text("Distribución Emocional", 10, 132);
                                        pdf.setFontSize(11);
                                        let y = 142;
                                        Object.entries(distribucion).forEach(([emo, count]) => {
                                          if (y > 270) {
                                            pdf.addPage();
                                            y = 20;
                                          }
                                          pdf.text(`• ${emo}: ${count}`, 10, y);
                                          y += 8;
                                        });

                                        // Conclusión
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

                                        pdf.setFontSize(10);
                                        pdf.text(
                                          "Edumotion — Sistema de Análisis Emocional en Clases Virtuales — © 2025",
                                          10,
                                          290
                                        );

                                        pdf.save(`reporte_emocional_${curso.id}_${clase.id}.pdf`);
                                      };

                                      const abrirModal = () => {
                                        setModalReport(reporte);
                                        setModalMeta({
                                          curso: curso.title,
                                          clase: clase.title || clase.titulo || `Clase ${clase.id}`,
                                        });
                                        setModalOpen(true);
                                      };

                                      const descargarRetroIA = async () => {
                                        if (!user?.id) return;
                                        setFeedbackLoading((prev) => ({ ...prev, [clase.id]: true }));
                                        setFeedbackError((prev) => ({ ...prev, [clase.id]: "" }));
                                        try {
                                          const res = await fetch(
                                            `${API}/test-attempts/?student_id=${user.id}&chapter_id=${clase.id}`
                                          );
                                          if (!res.ok) throw new Error("No se pudo obtener retroalimentación");
                                          const data = await res.json();
                                          const attempt = Array.isArray(data) && data.length > 0 ? data[0] : null;
                                          if (!attempt) {
                                            setFeedbackError((prev) => ({
                                              ...prev,
                                              [clase.id]: "No hay retroalimentación disponible.",
                                            }));
                                            return;
                                          }

                                          const feedback = attempt.grade_result || "Sin retroalimentación.";

                                          const pdf = new jsPDF("p", "mm", "a4");
                                          const W = pdf.internal.pageSize.getWidth();
                                          const H = pdf.internal.pageSize.getHeight();

                                          pdf.setFontSize(18);
                                          pdf.text("Retroalimentación IA", W / 2, 20, { align: "center" });
                                          pdf.setFontSize(12);
                                          pdf.text(`Curso: ${curso.title}`, 10, 32);
                                          pdf.text(
                                            `Clase: ${clase.title || clase.titulo || clase.id}`,
                                            10,
                                            40
                                          );
                                          pdf.text(`Fecha: ${new Date(attempt.created_at).toLocaleString()}`, 10, 48);

                                          pdf.setFontSize(11);
                                          const marginX = 10;
                                          const startY = 60;
                                          const lineHeight = 6;
                                          const maxWidth = W - marginX * 2;
                                          const lines = pdf.splitTextToSize(String(feedback), maxWidth);

                                          let y = startY;
                                          lines.forEach((line) => {
                                            if (y > H - 15) {
                                              pdf.addPage();
                                              y = 20;
                                            }
                                            pdf.text(line, marginX, y);
                                            y += lineHeight;
                                          });

                                          pdf.save(`retroalimentacion_ia_${curso.id}_${clase.id}.pdf`);
                                        } catch (e) {
                                          setFeedbackError((prev) => ({
                                            ...prev,
                                            [clase.id]: "No se pudo descargar la retroalimentación.",
                                          }));
                                        } finally {
                                          setFeedbackLoading((prev) => ({ ...prev, [clase.id]: false }));
                                        }
                                      };

                                      const verRetroIA = async () => {
                                        if (!user?.id) return;
                                        setFeedbackLoading((prev) => ({ ...prev, [clase.id]: true }));
                                        setFeedbackError((prev) => ({ ...prev, [clase.id]: "" }));
                                        try {
                                          const res = await fetch(
                                            `${API}/test-attempts/?student_id=${user.id}&chapter_id=${clase.id}`
                                          );
                                          if (!res.ok) throw new Error("No se pudo obtener retroalimentación");
                                          const data = await res.json();
                                          const attempt = Array.isArray(data) && data.length > 0 ? data[0] : null;
                                          if (!attempt || !attempt.grade_result) {
                                            setFeedbackError((prev) => ({
                                              ...prev,
                                              [clase.id]: "No hay retroalimentación disponible.",
                                            }));
                                            return;
                                          }
                                          setFeedbackModalData({
                                            curso: curso.title,
                                            clase: clase.title || clase.titulo || clase.id,
                                            fecha: attempt.created_at,
                                            feedback: attempt.grade_result,
                                          });
                                          setFeedbackModalOpen(true);
                                        } catch (e) {
                                          setFeedbackError((prev) => ({
                                            ...prev,
                                            [clase.id]: "No se pudo cargar la retroalimentación.",
                                          }));
                                        } finally {
                                          setFeedbackLoading((prev) => ({ ...prev, [clase.id]: false }));
                                        }
                                      };

                                      return (
                                        <div
                                          key={clase.id}
                                          className="p-3 border rounded-lg bg-white"
                                        >
                                          <p className="font-medium text-gray-800">
                                            Clase: {clase.title || clase.titulo}
                                          </p>
                                          {reporte ? (
                                            <>
                                              <p className="text-sm text-gray-500">
                                                Fecha:{" "}
                                                {reporte.fecha
                                                  ? new Date(reporte.fecha).toLocaleString()
                                                  : "Sin fecha"}
                                              </p>
                                              <p className="text-sm text-gray-600 mt-1">
                                                Emoción predominante:{" "}
                                                <span className="font-semibold">
                                                  {reporte?.resumen?.emocion_predominante || "Sin detección"}
                                                </span>
                                              </p>
                                              <button
                                                onClick={descargarReportePDF}
                                                className="mt-2 me-2 px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                                              >
                                                Descargar PDF
                                              </button>
                                              <button
                                                onClick={abrirModal}
                                                className="mt-2 px-3 py-1 text-sm rounded bg-gray-800 text-white hover:bg-gray-900"
                                              >
                                                Ver reporte completo
                                              </button>
                                              <button
                                                onClick={descargarRetroIA}
                                                disabled={feedbackLoading[clase.id]}
                                                className="mt-2 ms-2 px-3 py-1 text-sm rounded bg-green-700 text-white hover:bg-green-800 disabled:opacity-60"
                                              >
                                                {feedbackLoading[clase.id]
                                                  ? "Descargando..."
                                                  : "Descargar retroalimentación IA"}
                                              </button>
                                              <button
                                                onClick={verRetroIA}
                                                disabled={feedbackLoading[clase.id]}
                                                className="mt-2 ms-2 px-3 py-1 text-sm rounded bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-60"
                                              >
                                                Ver retroalimentación IA
                                              </button>
                                              {feedbackError[clase.id] && (
                                                <p className="text-sm text-red-500 mt-2">
                                                  {feedbackError[clase.id]}
                                                </p>
                                              )}
                                            </>
                                          ) : (
                                            <p className="text-sm text-gray-500 mt-1">
                                              Sin reporte emocional.
                                            </p>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    Este módulo no tiene clases.
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Este curso no tiene módulos/clases.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </MainLayout>
      {modalOpen && modalReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Reporte emocional completo</h3>
                <p className="text-sm text-gray-500">
                  {modalMeta?.curso} — {modalMeta?.clase}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-auto space-y-6">
              {/* Resumen legible */}
              <div className="bg-gray-50 border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Resumen</h4>
                <p className="text-sm text-gray-600">
                  Emoción predominante:{" "}
                  <span className="font-semibold">
                    {modalReport?.resumen?.emocion_predominante || "Sin detección"}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Duración:{" "}
                  {modalReport?.metadata?.duracion_segundos
                    ? `${modalReport.metadata.duracion_segundos} s`
                    : "Sin duración"}
                </p>
                <p className="text-sm text-gray-600">
                  Registros:{" "}
                  {modalReport?.metadata?.total_registros ?? "N/A"}
                </p>
              </div>

              {/* Gráficos */}
              <ReportAnalysis
                data={{
                  titulo: modalReport?.metadata?.titulo || "Informe Emocional del Estudiante",
                  fecha:
                    modalReport?.fecha ||
                    modalReport?.metadata?.fecha ||
                    new Date().toISOString(),
                  emociones: modalReport?.resumen?.distribucion_emociones || {},
                  atencion: modalReport?.resumen?.promedios?.atencion ?? 0,
                  analisis:
                    modalReport?.resumen?.emocion_predominante
                      ? `La emoción predominante detectada fue ${modalReport.resumen.emocion_predominante}.`
                      : "No se detectaron datos suficientes para un análisis.",
                  recomendaciones: [
                    "Refuerza los puntos clave de la clase si la emoción predominante fue neutral.",
                    "Incluye pausas activas si se percibe baja atención.",
                    "Introduce ejemplos prácticos para mejorar la participación.",
                  ],
                }}
              />

              {/* JSON completo */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Reporte completo (JSON)</h4>
                <pre className="text-sm whitespace-pre-wrap bg-gray-100 p-4 rounded">
                  {JSON.stringify(modalReport, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
      {feedbackModalOpen && feedbackModalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Retroalimentación IA</h3>
                <p className="text-sm text-gray-500">
                  {feedbackModalData.curso} — {feedbackModalData.clase}
                </p>
              </div>
              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-auto">
              <p className="text-sm text-gray-500 mb-3">
                Fecha:{" "}
                {feedbackModalData.fecha
                  ? new Date(feedbackModalData.fecha).toLocaleString()
                  : "Sin fecha"}
              </p>
              <div className="whitespace-pre-wrap text-gray-800">
                {feedbackModalData.feedback}
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}

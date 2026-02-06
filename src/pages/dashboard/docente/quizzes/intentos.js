"use client";

import { useEffect, useState, useContext } from "react";
import jsPDF from "jspdf";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";

const API = "https://edumotion-backend1.onrender.com/api/";

export default function IntentosDocente() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const { chapter, student } = router.query;

  const [intentos, setIntentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // ===============================
  // FETCH INTENTOS
  // ===============================
  useEffect(() => {
    if (!user || user.role !== "docente") return;
    if (!chapter) return;

    const fetchIntentos = async () => {
      try {
        let url = `${API}/test-attempts/?chapter_id=${chapter}`;

        if (student) {
          url += `&student_id=${student}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setIntentos(data.results || data || []);
      } catch {
        alert("No se pudieron cargar los intentos");
        setIntentos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIntentos();
  }, [user, chapter, student]);

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <MainLayout>
        <div className="p-10 text-gray-500">Cargando intentos...</div>
      </MainLayout>
    );
  }

  // ===============================
  // RENDER
  // ===============================
  return (
    <AuthGuard role="docente">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">

          {/* ENCABEZADO */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Intentos de Evaluación
            </h1>
            <p className="text-gray-600 mt-1">
              Resultados de estudiantes por clase
            </p>
          </div>

          {/* LISTA */}
          {intentos.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-gray-500">
              No existen intentos registrados.
            </div>
          ) : (
            <div className="space-y-4">
              {intentos.map((i) => {
                const feedback =
                  i.grade_result ||
                  i.generated_test ||
                  i.emotional_report ||
                  "Sin retroalimentación.";

                const descargarPDF = () => {
                  const pdf = new jsPDF("p", "mm", "a4");
                  const W = pdf.internal.pageSize.getWidth();
                  const H = pdf.internal.pageSize.getHeight();

                  pdf.setFontSize(18);
                  pdf.text("Retroalimentación IA", W / 2, 20, { align: "center" });
                  pdf.setFontSize(12);
                  pdf.text(`Estudiante: ${i.student_name || `ID ${i.student}`}`, 10, 32);
                  pdf.text(
                    `Fecha: ${new Date(i.created_at).toLocaleString()}`,
                    10,
                    40
                  );

                  pdf.setFontSize(11);
                  const marginX = 10;
                  const startY = 52;
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

                  pdf.save(`retroalimentacion_${i.student || i.id}.pdf`);
                };

                return (
                  <div key={i.id} className="bg-white rounded-xl shadow p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-500">Estudiante</p>
                        <p className="font-semibold text-gray-800">
                          {i.student_name || `ID ${i.student}`}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(i.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={descargarPDF}
                          className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Descargar PDF
                        </button>
                        <button
                          onClick={() =>
                            (setModalData({
                              estudiante: i.student_name || `ID ${i.student}`,
                              fecha: i.created_at,
                              feedback,
                            }), setModalOpen(true))
                          }
                          className="px-3 py-1.5 text-sm rounded bg-gray-800 text-white hover:bg-gray-900"
                        >
                          Ver retroalimentación
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Retroalimentación:</p>
                      <pre className="text-sm bg-gray-50 border rounded p-3 whitespace-pre-wrap">
                        {typeof feedback === "string"
                          ? feedback
                          : JSON.stringify(feedback, null, 2)}
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </MainLayout>
      {modalOpen && modalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Retroalimentación IA</h3>
                <p className="text-sm text-gray-500">
                  {modalData.estudiante}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-auto">
              <p className="text-sm text-gray-500 mb-3">
                Fecha:{" "}
                {modalData.fecha
                  ? new Date(modalData.fecha).toLocaleString()
                  : "Sin fecha"}
              </p>
              <div className="whitespace-pre-wrap text-gray-800">
                {typeof modalData.feedback === "string"
                  ? modalData.feedback
                  : JSON.stringify(modalData.feedback, null, 2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}

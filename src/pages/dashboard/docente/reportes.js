"use client";

import { useEffect, useState, useContext } from "react";
import jsPDF from "jspdf";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import { AuthContext } from "@/context/AuthContext";

const API = "http://localhost:8000/api";

export default function ReportesDocente() {
  const router = useRouter();
  const { user, token } = useContext(AuthContext);

  const [cursos, setCursos] = useState([]);
  const [reportes, setReportes] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
      PROTECCIÓN
  =============================== */
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "docente") {
      router.push("/");
      return;
    }

    fetchCursos();
  }, [user, token]);

  /* ===============================
      CURSOS DEL DOCENTE
  =============================== */
  const fetchCursos = async () => {
    try {
      const res = await fetch(`${API}/teacher-course/${user.id}`);
      const data = await res.json();
      const lista = data.results || data || [];
      setCursos(lista);

      await Promise.all(
        lista.map((curso) => generarReporteCurso(curso.id))
      );
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
      REPORTE POR CURSO
  =============================== */
  const generarReporteCurso = async (courseId) => {
    try {
      // Módulos y clases reales
      const modRes = await fetch(`${API}/course/${courseId}/modules/`);
      const modData = modRes.ok ? await modRes.json() : [];
      const modulos = modData.results || modData || [];

      let totalClases = 0;
      await Promise.all(
        modulos.map(async (mod) => {
          const resVid = await fetch(`${API}/modules/${mod.id}/videos/`);
          const vids = resVid.ok ? await resVid.json() : [];
          const lista = vids.results || vids || [];
          totalClases += lista.length;
        })
      );

      // Estudiantes inscritos por curso
      const estRes = await fetch(`${API}/fetch-enrolled-students/${courseId}`);
      const estData = estRes.ok ? await estRes.json() : [];
      const estudiantes = Array.isArray(estData) ? estData.length : 0;
      setReportes((prev) => ({
        ...prev,
        [courseId]: {
          estudiantes,
          totalCapitulos: totalClases,
          totalModulos: modulos.length,
        },
      }));
    } catch (error) {
      console.warn("Reporte incompleto", error);
      setReportes((prev) => ({
        ...prev,
        [courseId]: {
          estudiantes: 0,
          totalCapitulos: 0,
          totalModulos: 0,
          progresoPromedio: null,
        },
      }));
    }
  };

  /* ===============================
      LOADING
  =============================== */
  if (loading) {
    return (
      <MainLayout>
        <div className="p-10">Generando reportes...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">
          Reportes Académicos
        </h1>

        {cursos.length === 0 ? (
          <p className="text-gray-500">
            No tienes cursos creados.
          </p>
        ) : (
          <div className="space-y-6">
            {cursos.map((curso) => {
              const r = reportes[curso.id] || {};

              return (
                <div
                  key={curso.id}
                  className="bg-white p-6 rounded shadow"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {curso.title}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Estudiantes
                      </p>
                      <p className="text-2xl font-bold">
                        {r.estudiantes ?? 0}
                      </p>
                      <div className="w-full bg-gray-200 rounded h-2 mt-2">
                        <div
                          className="h-2 bg-green-600 rounded"
                          style={{
                            width: `${Math.min(100, (r.estudiantes || 0) * 10)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Módulos
                      </p>
                      <p className="text-2xl font-bold">
                        {r.totalModulos ?? 0}
                      </p>
                      <div className="w-full bg-gray-200 rounded h-2 mt-2">
                        <div
                          className="h-2 bg-blue-600 rounded"
                          style={{
                            width: `${Math.min(100, (r.totalModulos || 0) * 10)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Clases
                      </p>
                      <p className="text-2xl font-bold">
                        {r.totalCapitulos ?? 0}
                      </p>
                      <div className="w-full bg-gray-200 rounded h-2 mt-2">
                        <div
                          className="h-2 bg-purple-600 rounded"
                          style={{
                            width: `${Math.min(100, (r.totalCapitulos || 0) * 10)}%`,
                          }}
                        />
                      </div>
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={() => router.push(`/dashboard/docente/clases/${curso.id}`)}
                      className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Ver clases
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/docente/estudiantes?course=${curso.id}`)}
                      className="px-4 py-2 text-sm rounded bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Ver estudiantes
                    </button>
                    <button
                      onClick={() => {
                        const pdf = new jsPDF("p", "mm", "a4");
                        const W = pdf.internal.pageSize.getWidth();
                        pdf.setFontSize(18);
                        pdf.text("Reporte Académico del Curso", W / 2, 18, { align: "center" });
                        pdf.setFontSize(12);
                        pdf.text(`Curso: ${curso.title}`, 10, 30);
                        pdf.text(`Docente: ${user?.full_name || user?.fullname || "Docente"}`, 10, 38);
                        pdf.text(`Fecha: ${new Date().toLocaleString()}`, 10, 46);
                        pdf.setLineWidth(0.3);
                        pdf.line(10, 52, W - 10, 52);

                        pdf.setFontSize(13);
                        pdf.text("Métricas", 10, 62);
                        pdf.setFontSize(11);
                        pdf.text(`Estudiantes: ${r.estudiantes ?? 0}`, 10, 72);
                        pdf.text(`Módulos: ${r.totalModulos ?? 0}`, 10, 80);
                        pdf.text(`Clases: ${r.totalCapitulos ?? 0}`, 10, 88);

                        // Barras simples
                        const maxBar = 120;
                        const barY = 100;
                        const est = Math.min(1, (r.estudiantes ?? 0) / 10);
                        const mod = Math.min(1, (r.totalModulos ?? 0) / 10);
                        const cla = Math.min(1, (r.totalCapitulos ?? 0) / 10);
                        pdf.setFillColor(16, 185, 129);
                        pdf.rect(10, barY, maxBar * est, 6, "F");
                        pdf.text("Estudiantes", 10 + maxBar + 5, barY + 5);

                        pdf.setFillColor(59, 130, 246);
                        pdf.rect(10, barY + 10, maxBar * mod, 6, "F");
                        pdf.text("Módulos", 10 + maxBar + 5, barY + 15);

                        pdf.setFillColor(139, 92, 246);
                        pdf.rect(10, barY + 20, maxBar * cla, 6, "F");
                        pdf.text("Clases", 10 + maxBar + 5, barY + 25);

                        pdf.save(`reporte_curso_${curso.id}.pdf`);
                      }}
                      className="px-4 py-2 text-sm rounded bg-gray-800 text-white hover:bg-gray-900"
                    >
                      Descargar PDF
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-6">
            Última actualización: {lastUpdated.toLocaleString()}
          </p>
        )}
      </div>
    </MainLayout>
  );
}

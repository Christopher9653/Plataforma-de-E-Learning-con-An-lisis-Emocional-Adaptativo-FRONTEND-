"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import { AuthContext } from "@/context/AuthContext";

const API = "http://localhost:8000/api";

export default function ReportesDocente() {
  const router = useRouter();
  const { user, token } = useContext(AuthContext);

  const [cursos, setCursos] = useState([]);
  const [reportes, setReportes] = useState({});
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
  }, [user]);

  /* ===============================
      CURSOS DEL DOCENTE
  =============================== */
  const fetchCursos = async () => {
    try {
      const res = await fetch(
        `${API}/course/?teacher=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      const lista = data.results || data;
      setCursos(lista);

      for (const curso of lista) {
        await generarReporteCurso(curso.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
      REPORTE POR CURSO
  =============================== */
  const generarReporteCurso = async (courseId) => {
    try {
      // Total capítulos
      const capRes = await fetch(
        `${API}/course-chapters/?module__course=${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const capData = await capRes.json();
      const totalCapitulos = (capData.results || capData).length;

      // Estudiantes inscritos
      const estRes = await fetch(
        `${API}/student-courses/?course=${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const estData = await estRes.json();
      const estudiantes = (estData.results || estData).length;

      // Progreso total
      const progRes = await fetch(
        `${API}/chapter-progress/?course=${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const progData = await progRes.json();
      const completados = (progData.results || progData).length;

      const progresoPromedio =
        totalCapitulos && estudiantes
          ? Math.round(
              (completados / (totalCapitulos * estudiantes)) * 100
            )
          : 0;

      setReportes((prev) => ({
        ...prev,
        [courseId]: {
          estudiantes,
          totalCapitulos,
          progresoPromedio,
        },
      }));
    } catch (error) {
      console.warn("Reporte incompleto", error);
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

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Estudiantes
                      </p>
                      <p className="text-2xl font-bold">
                        {r.estudiantes ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Clases
                      </p>
                      <p className="text-2xl font-bold">
                        {r.totalCapitulos ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Progreso Promedio
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {r.progresoPromedio ?? 0}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

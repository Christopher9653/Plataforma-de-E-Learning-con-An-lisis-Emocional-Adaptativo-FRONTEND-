"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";

const API = "http://localhost:8000/api";

export default function IntentosDocente() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const { chapter, student } = router.query;

  const [intentos, setIntentos] = useState([]);
  const [loading, setLoading] = useState(true);

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

          {/* TABLA */}
          {intentos.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-gray-500">
              No existen intentos registrados.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left">Estudiante</th>
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-center">Puntaje</th>
                    <th className="p-3 text-center">Estado</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {intentos.map((i) => (
                    <tr
                      key={i.id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-3">
                        {i.student_name || `ID ${i.student}`}
                      </td>

                      <td className="p-3">
                        {new Date(i.created_at).toLocaleString()}
                      </td>

                      <td className="p-3 text-center">
                        {i.score ?? "—"}
                      </td>

                      <td className="p-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium
                            ${
                              i.passed
                                ? "bg-green-100 text-green-700"
                                : i.finished
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {i.passed
                            ? "Aprobado"
                            : i.finished
                            ? "Reprobado"
                            : "Pendiente"}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/docente/quizzes/calificar?id=${i.id}`
                            )
                          }
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Calificar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";

const API = "http://localhost:8000/api";

export default function VerResultadoIntento() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { id } = router.query;

  const [intento, setIntento] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH RESULTADO
  // ===============================
  useEffect(() => {
    if (!id || !user || user.role !== "docente") return;

    const fetchResultado = async () => {
      try {
        const res = await fetch(`${API}/test-attempts/${id}/grade`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setIntento(data);
      } catch {
        alert("No se pudo cargar el resultado");
        router.push("/dashboard/docente/quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchResultado();
  }, [id, user]);

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <MainLayout>
        <div className="p-10 text-gray-500">Cargando resultado...</div>
      </MainLayout>
    );
  }

  if (!intento) return null;

  // ===============================
  // RENDER
  // ===============================
  return (
    <AuthGuard role="docente">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen max-w-4xl mx-auto">

          {/* ENCABEZADO */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Resultado de Evaluación
            </h1>
            <p className="text-gray-600 mt-1">
              Detalle del intento del estudiante
            </p>
          </div>

          {/* RESUMEN */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <p><strong>Estudiante:</strong> {intento.student_name || intento.student}</p>
              <p><strong>Clase:</strong> {intento.chapter_title || intento.chapter}</p>
              <p><strong>Fecha:</strong> {new Date(intento.created_at).toLocaleString()}</p>
              <p><strong>Duración:</strong> {intento.duration || "—"} min</p>
            </div>
          </div>

          {/* RESULTADO */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Puntaje obtenido</p>
                <p className="text-3xl font-bold">
                  {intento.score ?? "—"}
                </p>
              </div>

              <span
                className={`px-5 py-2 rounded-full font-semibold text-sm
                  ${
                    intento.passed
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {intento.passed ? "APROBADO" : "REPROBADO"}
              </span>
            </div>
          </div>

          {/* RESPUESTAS (SI EXISTEN) */}
          {Array.isArray(intento.answers) && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Respuestas del Estudiante
              </h2>

              <div className="space-y-4">
                {intento.answers.map((a, index) => (
                  <div key={index} className="border rounded p-4">
                    <p className="font-medium mb-1">
                      {index + 1}. {a.question}
                    </p>

                    <p className="text-sm">
                      Respuesta: <strong>{a.selected_answer}</strong>
                    </p>

                    <p
                      className={`text-sm mt-1 font-medium
                        ${
                          a.is_correct
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                    >
                      {a.is_correct ? "Correcta" : "Incorrecta"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VOLVER */}
          <button
            onClick={() => router.back()}
            className="mt-6 text-blue-600 hover:underline"
          >
            ← Volver
          </button>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

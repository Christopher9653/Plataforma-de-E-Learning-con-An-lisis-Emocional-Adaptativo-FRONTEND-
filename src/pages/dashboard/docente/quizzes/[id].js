"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";

const API = "http://localhost:8000/api";

export default function ConfigurarQuizDocente() {
  const router = useRouter();
  const { id: chapterId } = router.query;
  const { user, token } = useContext(AuthContext);

  const [configs, setConfigs] = useState([]);
  const [studentConfigForm, setStudentConfigForm] = useState({});
  const [loading, setLoading] = useState(true);

  // Configuración masiva
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [numQuestions, setNumQuestions] = useState(10);
  const [gradingScale, setGradingScale] = useState(20);

  /* ===============================
     OBTENER ID REAL DEL ESTUDIANTE
  =============================== */
  const getStudentId = (cfg) => {
    if (typeof cfg.student === "object" && cfg.student !== null) {
      return cfg.student.id;
    }
    return cfg.student_id || cfg.student;
  };

  /* ===============================
     CARGAR CONFIGURACIONES
  =============================== */
  const fetchConfigs = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/chapter/${chapterId}/configs/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      const list = data.results || data;
      setConfigs(list);
      const formMap = {};
      (list || []).forEach((cfg) => {
        const studentId = getStudentId(cfg);
        if (!studentId) return;
        formMap[studentId] = {
          max_attempts: cfg.max_attempts,
          num_questions: cfg.num_questions,
          grading_scale: cfg.grading_scale,
        };
      });
      setStudentConfigForm(formMap);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar las configuraciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!chapterId || !user) return;
    fetchConfigs();
  }, [chapterId, user]);

  /* ===============================
     CONFIGURACIÓN MASIVA
  =============================== */
  const aplicarConfigMasiva = async () => {
    if (!confirm("¿Aplicar configuración a todos los estudiantes?")) return;

    try {
      const res = await fetch(
        `${API}/chapter/${chapterId}/bulk-update-configs/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            max_attempts: Number(maxAttempts),
            num_questions: Number(numQuestions),
            grading_scale: Number(gradingScale),
          }),
        }
      );

      if (!res.ok) throw new Error();

      alert("Configuración aplicada correctamente");
      fetchConfigs();
    } catch (error) {
      console.error(error);
      alert("Error al aplicar configuración masiva");
    }
  };

  /* ===============================
     ACTUALIZAR CONFIG INDIVIDUAL
  =============================== */
  const actualizarConfigIndividual = async (
    studentId,
    newAttempts,
    newNumQuestions,
    newScale
  ) => {
    if (!studentId) {
      alert("ID de estudiante inválido");
      return;
    }

    try {
      const res = await fetch(
        `${API}/student/${studentId}/chapter/${chapterId}/config/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            max_attempts: Number(newAttempts),
            num_questions: Number(newNumQuestions),
            grading_scale: Number(newScale),
          }),
        }
      );

      if (!res.ok) throw new Error();

      fetchConfigs();
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar la configuración");
    }
  };

  /* ===============================
     LOADING
  =============================== */
  if (loading) {
    return (
      <MainLayout>
        <div className="p-10 text-gray-500">
          Cargando configuraciones...
        </div>
      </MainLayout>
    );
  }

  /* ===============================
     RENDER
  =============================== */
  return (
    <AuthGuard role="docente">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">

          {/* ENCABEZADO */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Configuración de Quiz
            </h1>
            <p className="text-gray-600">
              Clase (Chapter ID): {chapterId}
            </p>
          </div>

          {/* CONFIGURACIÓN MASIVA */}
          <div className="bg-white p-6 rounded-xl shadow mb-10">
            <h2 className="text-xl font-semibold mb-4">
              Configuración masiva
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Intentos máximos
                </label>
                <input
                  type="number"
                  min={1}
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Número de intentos permitidos por estudiante.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Número de preguntas
                </label>
                <input
                  type="number"
                  min={1}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cantidad de preguntas que generará la evaluación.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Escala de calificación
                </label>
                <input
                  type="number"
                  min={1}
                  value={gradingScale}
                  onChange={(e) => setGradingScale(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Puntaje máximo de la prueba (ej. 20 o 100).
                </p>
              </div>
            </div>

            <button
              onClick={aplicarConfigMasiva}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Aplicar a todos
            </button>
          </div>

          {/* CONFIGURACIÓN POR ESTUDIANTE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-6">
              Configuración por estudiante
            </h2>

            {configs.length === 0 ? (
              <p className="text-gray-500">
                No hay estudiantes inscritos.
              </p>
            ) : (
              <div className="space-y-4">
                {configs.map((cfg, index) => {
                  const studentId = getStudentId(cfg);
                  const values = studentConfigForm[studentId] || {
                    max_attempts: cfg.max_attempts,
                    num_questions: cfg.num_questions,
                    grading_scale: cfg.grading_scale,
                  };

                  return (
                    <div
                      key={studentId || index}
                      className="border p-4 rounded-lg"
                    >
                      <p className="font-semibold">
                        {cfg.student_name || "Estudiante"}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Intentos
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={values.max_attempts}
                            onChange={(e) =>
                              setStudentConfigForm((prev) => ({
                                ...prev,
                                [studentId]: {
                                  ...prev[studentId],
                                  max_attempts: e.target.value,
                                },
                              }))
                            }
                            className="border p-2 rounded w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Preguntas
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={values.num_questions}
                            onChange={(e) =>
                              setStudentConfigForm((prev) => ({
                                ...prev,
                                [studentId]: {
                                  ...prev[studentId],
                                  num_questions: e.target.value,
                                },
                              }))
                            }
                            className="border p-2 rounded w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Escala
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={values.grading_scale}
                            onChange={(e) =>
                              setStudentConfigForm((prev) => ({
                                ...prev,
                                [studentId]: {
                                  ...prev[studentId],
                                  grading_scale: e.target.value,
                                },
                              }))
                            }
                            className="border p-2 rounded w-full"
                          />
                        </div>

                        <button
                          onClick={() =>
                            actualizarConfigIndividual(
                              studentId,
                              values.max_attempts,
                              values.num_questions,
                              values.grading_scale
                            )
                          }
                          className="bg-green-600 text-white px-4 rounded"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </MainLayout>
    </AuthGuard>
  );
}

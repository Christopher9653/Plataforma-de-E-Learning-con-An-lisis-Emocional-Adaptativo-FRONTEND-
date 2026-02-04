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
  const [loading, setLoading] = useState(true);

  // Configuración masiva
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [duration, setDuration] = useState(30);

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
      setConfigs(data.results || data);
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
            duration: Number(duration),
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
    newDuration
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
            duration: Number(newDuration),
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

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="number"
                min={1}
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(e.target.value)}
                className="border p-2 rounded"
                placeholder="Intentos máximos"
              />

              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="border p-2 rounded"
                placeholder="Duración (min)"
              />
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

                  return (
                    <div
                      key={studentId || index}
                      className="border p-4 rounded-lg"
                    >
                      <p className="font-semibold">
                        {cfg.student_name || "Estudiante"}
                      </p>

                      <div className="flex gap-4 mt-3">
                        <input
                          type="number"
                          min={1}
                          defaultValue={cfg.max_attempts}
                          className="border p-2 rounded w-40"
                          id={`att-${studentId}`}
                        />

                        <input
                          type="number"
                          min={1}
                          defaultValue={cfg.duration}
                          className="border p-2 rounded w-40"
                          id={`dur-${studentId}`}
                        />

                        <button
                          onClick={() =>
                            actualizarConfigIndividual(
                              studentId,
                              document.getElementById(`att-${studentId}`).value,
                              document.getElementById(`dur-${studentId}`).value
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

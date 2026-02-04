"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";

import PasoModulos from "./crear-clase/PasoModulos";
import PasoClases from "./crear-clase/PasoClases";

const API = "http://localhost:8000/api";

export default function CursoDetalleDocente() {
  const router = useRouter();
  const { id, step } = router.query;
  const { user } = useContext(AuthContext);

  const [curso, setCurso] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [videosPorModulo, setVideosPorModulo] = useState({});
  const [editandoVideo, setEditandoVideo] = useState(null);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [loading, setLoading] = useState(true);

  /* ===============================
     CARGAR CURSO + MÓDULOS + CLASES
  =============================== */
  const fetchCursoCompleto = async () => {
    try {
      setLoading(true);

      const cursoRes = await fetch(`${API}/course/${id}/`);
      if (!cursoRes.ok) throw new Error();
      const cursoData = await cursoRes.json();
      setCurso(cursoData);

      const modRes = await fetch(`${API}/course/${id}/modules/`);
      const modData = modRes.ok ? await modRes.json() : [];
      const listaModulos = modData.results || modData || [];
      setModulos(listaModulos);

      const videosMap = {};
      for (const mod of listaModulos) {
        const res = await fetch(`${API}/modules/${mod.id}/videos/`);
        const data = res.ok ? await res.json() : [];
        videosMap[mod.id] = data.results || data || [];
      }

      setVideosPorModulo(videosMap);
    } catch (err) {
      console.error(err);
      alert("No se pudo cargar el curso");
      router.push("/dashboard/docente/clases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || !user) return;
    fetchCursoCompleto();
  }, [id, user]);

  /* ===============================
     EDITAR TÍTULO DE CLASE
  =============================== */
  const guardarTituloVideo = async (videoId) => {
    try {
      const res = await fetch(`${API}/videos/${videoId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nuevoTitulo }),
      });

      if (!res.ok) throw new Error();

      setVideosPorModulo((prev) => {
        const copy = { ...prev };
        Object.keys(copy).forEach((modId) => {
          copy[modId] = copy[modId].map((v) =>
            v.id === videoId ? { ...v, title: nuevoTitulo } : v
          );
        });
        return copy;
      });

      setEditandoVideo(null);
      setNuevoTitulo("");
    } catch {
      alert("No se pudo actualizar el título");
    }
  };

  /* ===============================
     ELIMINAR MÓDULO
  =============================== */
  const eliminarModulo = async (moduloId) => {
    if (!confirm("¿Eliminar este módulo y todas sus clases?")) return;

    try {
      const res = await fetch(`${API}/modules/${moduloId}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setModulos((prev) => prev.filter((m) => m.id !== moduloId));
      setVideosPorModulo((prev) => {
        const copy = { ...prev };
        delete copy[moduloId];
        return copy;
      });
    } catch {
      alert("No se pudo eliminar el módulo");
    }
  };

  /* ===============================
     PASOS (MODULOS / CLASES)
  =============================== */
  if (step === "modulos") {
    return (
      <AuthGuard role="docente">
        <MainLayout>
          <PasoModulos
            courseId={id}
            setModulos={setModulos}
            onNext={() =>
              router.push(`/dashboard/docente/clases/${id}?step=clases`)
            }
          />
        </MainLayout>
      </AuthGuard>
    );
  }

  if (step === "clases") {
    return (
      <AuthGuard role="docente">
        <MainLayout>
          <PasoClases
            courseId={id}
            modulos={modulos}
            onFinish={() => {
              router.push(`/dashboard/docente/clases/${id}`);
              fetchCursoCompleto();
            }}
          />
        </MainLayout>
      </AuthGuard>
    );
  }

  if (loading) {
    return (
      <AuthGuard role="docente">
        <MainLayout>
          <div className="p-10 text-gray-500">Cargando curso...</div>
        </MainLayout>
      </AuthGuard>
    );
  }

  if (!curso) return null;

  /* ===============================
     RENDER NORMAL
  =============================== */
  return (
    <AuthGuard role="docente">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">
          {/* ENCABEZADO */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{curso.title}</h1>
              <p className="text-gray-600 mt-2">{curso.description}</p>
            </div>

            <button
              onClick={() =>
                router.push(`/dashboard/docente/clases/${id}?step=modulos`)
              }
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              + Agregar módulo / clases
            </button>
          </div>

          {/* MÓDULOS */}
          {modulos.map((mod) => (
            <div key={mod.id} className="mb-10 bg-white p-6 rounded shadow">
              <div className="flex justify-between mb-3">
                <div>
                  <h2 className="text-xl font-semibold">{mod.title}</h2>
                  <p className="text-gray-600 text-sm">{mod.description}</p>
                </div>

                <button
                  onClick={() => eliminarModulo(mod.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Eliminar módulo
                </button>
              </div>

              {/* CLASES */}
              <div className="space-y-6">
                {videosPorModulo[mod.id]?.map((clase) => (
                  <div key={clase.id} className="border p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{clase.title}</h3>

                      <div className="flex gap-4 text-sm">
                        <button
                          onClick={() => {
                            setEditandoVideo(clase.id);
                            setNuevoTitulo(clase.title);
                          }}
                          className="text-blue-600"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/docente/quizzes/intentos?chapter=${clase.id}`
                            )
                          }
                          className="text-green-600"
                        >
                          Intentos
                        </button>

                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/docente/quizzes/calificar?chapter=${clase.id}`
                            )
                          }
                          className="text-purple-600"
                        >
                          Calificar
                        </button>
                        {/* Configuraciones por clase */}
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/docente/quizzes/${clase.id}`
                            )
                          }
                          className="text-indigo-600"
                        >
                          Config. Quizz
                        </button>
                      </div>
                    </div>

                    {editandoVideo === clase.id && (
                      <div className="flex gap-2 mb-3">
                        <input
                          value={nuevoTitulo}
                          onChange={(e) => setNuevoTitulo(e.target.value)}
                          className="border px-3 py-1 rounded flex-1"
                        />
                        <button
                          onClick={() => guardarTituloVideo(clase.id)}
                          className="bg-blue-600 text-white px-3 rounded"
                        >
                          Guardar
                        </button>
                      </div>
                    )}

                    {clase.video_url && (
                      <video
                        controls
                        className="w-full max-w-3xl border rounded"
                        src={clase.video_url}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

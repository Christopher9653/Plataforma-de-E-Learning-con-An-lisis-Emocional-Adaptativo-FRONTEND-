"use client";

import { useEffect, useState, useContext } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

const API_BASE = "https://edumotion-backend1.onrender.com/api";

export default function DocenteClases() {
  const { user } = useContext(AuthContext);

  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // CARGAR CURSOS DEL DOCENTE
  // ===============================
  useEffect(() => {
    if (!user || user.role !== "docente") {
      setLoading(false);
      return;
    }

    const fetchCursos = async () => {
      try {
        const res = await fetch(
          `https://edumotion-backend1.onrender.com/apiteacher-course/${user.id}`
        );

        if (!res.ok) {
          throw new Error("Error al obtener cursos del docente");
        }

        const data = await res.json();
        setCursos(data.results || data || []);
      } catch (error) {
        console.error("Cursos docente:", error);
        setCursos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, [user]);

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Cargando cursos...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <AuthGuard role="docente">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">

          {/* ENCABEZADO */}
          <div className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Mis Cursos
              </h1>
              <p className="text-gray-600 mt-2">
                Administra los cursos que has creado
              </p>
            </div>

            <Link
              href="/dashboard/docente/clases/crear-clase"
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Crear curso
            </Link>
          </div>

          {/* LISTA DE CURSOS */}
          {cursos.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-gray-500">
              Aún no has creado ningún curso.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cursos.map((curso) => (
                <Link
                  key={curso.id}
                  href={`/dashboard/docente/clases/${curso.id}`}
                  className="group block bg-white rounded-xl border hover:shadow-lg transition overflow-hidden"
                >
                  {/* IMAGEN */}
                  <div className="h-40 bg-gray-200 overflow-hidden">
                    {curso.featured_img ? (
                      <img
                        src={curso.featured_img}
                        alt={curso.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600">
                        <span className="text-white font-semibold text-lg text-center px-4">
                          {curso.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CONTENIDO */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                      {curso.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mt-2 mb-4">
                      {curso.description || "Este curso no tiene descripción."}
                    </p>

                    <span className="inline-block text-sm font-medium text-blue-600 group-hover:underline">
                      Administrar curso →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </MainLayout>
    </AuthGuard>
  );
}

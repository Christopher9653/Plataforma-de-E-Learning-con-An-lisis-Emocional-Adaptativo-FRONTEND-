"use client";

import { useEffect, useState, useContext } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

const API = "https://edumotion-backend1.onrender.com/api";

export default function EstudianteDashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);

  // ===============================
  // OBTENER CURSOS DEL ESTUDIANTE
  // ===============================
  useEffect(() => {
    if (!user || user.role !== "estudiante") {
      setLoading(false);
      return;
    }
    if (!user || user.role !== "estudiante") return;

    fetch(`${API}/student/${user.id}/`)
      .then((res) => res.json())
      .then((data) => setPerfil(data))
      .catch((err) => console.error("Perfil:", err));
    const fetchCursos = async () => {
      try {
        const res = await fetch(`${API}/fetch-enrolled-courses/${user.id}`);

        if (!res.ok) {
          throw new Error("Error al cargar cursos");
        }

        const data = await res.json();

        // El endpoint ya devuelve cursos
        setCursos(data.results || data || []);
      } catch (err) {
        console.error("Cursos estudiante:", err);
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
        <div className="p-10 bg-gray-50 min-h-screen">Cargando cursos...</div>
      </MainLayout>
    );
  }

  return (
    <AuthGuard role="estudiante">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">
          {/* ENCABEZADO */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Bienvenido, {perfil?.fullname || perfil?.username || user?.email}
            </h1>
            <p className="text-gray-600 mt-1">¿Qué quieres aprender hoy?</p>
          </div>

          {/* ESTADÍSTICAS */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 border-r">
                <p className="text-3xl font-bold text-blue-600">
                  {cursos.length}
                </p>
                <h3 className="text-lg font-semibold text-gray-700 mt-2">
                  Cursos Inscritos
                </h3>
              </div>

              <div className="text-center p-4 border-r">
                <p className="text-3xl font-bold text-green-600">—</p>
                <h3 className="text-lg font-semibold text-gray-700 mt-2">
                  Clases Completadas
                </h3>
              </div>

              <div className="text-center p-4">
                <p className="text-3xl font-bold text-purple-600">—</p>
                <h3 className="text-lg font-semibold text-gray-700 mt-2">
                  Progreso Total
                </h3>
              </div>
            </div>
          </div>

          {/* ACCESOS RÁPIDOS */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Accesos Rápidos
            </h3>

            <div className="flex space-x-6">
              <Link
                href="/dashboard/estudiante/cursos"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Mis Cursos
              </Link>

              <Link
                href="/dashboard/estudiante/inscripciones"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Inscribirme en Cursos
              </Link>

              <Link
                href="/dashboard/estudiante/progreso"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Mi Progreso
              </Link>
            </div>
          </div>

          {/* MIS CURSOS */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Mis Cursos
            </h2>
            <p className="text-gray-600 mb-6">
              Continúa aprendiendo desde donde lo dejaste
            </p>
            <div className="flex justify-rigth items-center mb-6">
              <Link
                href="/dashboard/estudiante/cursos"
                className="text-blue-600 hover:underline font-medium "
              >
                Ver todos →
              </Link>
            </div>
            {cursos.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-gray-500">
                No estás inscrito en ningún curso.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {cursos.map((item) => {
                  const curso = item.course || item; // 🔑 compatibilidad

                  if (!curso) return null;

                  return (
                    <Link
                      key={curso.id}
                      href={`/dashboard/estudiante/cursos/${curso.id}`}
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
                          <div className="h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600">
                            <span className="text-white font-semibold text-lg text-center px-4 line-clamp-2">
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
                          {curso.description ||
                            "Este curso no tiene descripción."}
                        </p>

                        <span className="inline-block text-sm font-medium text-blue-600 group-hover:underline">
                          Continuar curso →
                        </span>
                      </div>
                    </Link>
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

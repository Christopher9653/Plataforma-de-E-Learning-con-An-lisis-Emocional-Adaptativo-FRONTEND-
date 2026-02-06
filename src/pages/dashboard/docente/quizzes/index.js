"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import { AuthContext } from "@/context/AuthContext";

const API = "https://edumotion-backend1.onrender.com/api";

export default function DocenteQuizzes() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     PROTECCIÓN DE RUTA
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

    fetchChapters();
  }, [user]);

  /* ===============================
     FETCH CLASES (QUIZZES)
  =============================== */
const fetchChapters = async () => {
  try {
    const courseRes = await fetch(
      `${API}/teacher-course/${user.id}`
    );

    if (!courseRes.ok) {
      throw new Error("No se pudieron cargar los cursos");
    }

    const courses = await courseRes.json();

    const allChapters = [];

    for (const course of courses) {
      const modRes = await fetch(
        `${API}/course/${course.id}/modules/`
      );
      const mods = await modRes.json();

      for (const mod of mods.results || mods) {
        const vidRes = await fetch(
          `${API}/modules/${mod.id}/videos/`
        );
        const vids = await vidRes.json();

        vids.results?.forEach((v) =>
          allChapters.push({
            ...v,
            course_title: course.title,
          })
        );
      }
    }

    setChapters(allChapters);
  } catch (err) {
    console.error(err);
    alert("Error cargando clases");
  } finally {
    setLoading(false);
  }
};


  /* ===============================
     LOADING
  =============================== */
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Cargando quizzes...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Quizzes por Clase
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona intentos y evaluaciones por cada clase
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard/docente/quizzes/crear")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Crear Quiz
          </button>
        </div>

        {/* LISTADO */}
        {chapters.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center text-gray-500">
            No existen clases con quizzes aún.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                className="bg-white p-6 rounded shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {ch.title}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Curso: {ch.course_title}
                </p>

                <p className="text-sm text-gray-500">
                  Módulo: {ch.module_title}
                </p>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/docente/quizzes/${ch.id}`)
                    }
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Configurar Quiz →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

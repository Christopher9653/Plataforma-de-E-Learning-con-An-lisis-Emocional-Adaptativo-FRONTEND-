import MainLayout from "@/components/layout/MainLayout";
import CourseGrid from "@/components/cursos/CourseGrid";
import { useEffect, useState } from "react";

export default function CursosIndex() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const cursosGuardados =
      JSON.parse(localStorage.getItem("cursos")) || [];
    setCursos(cursosGuardados);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-bold text-gray-800">
              Todos los cursos
            </h1>
            <p className="text-gray-600 mt-2">
              Explora los cursos creados por nuestros docentes.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {cursos.length > 0 ? (
            <CourseGrid cursos={cursos} />
          ) : (
            <p className="text-center text-gray-500">
              Aún no hay cursos creados.
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

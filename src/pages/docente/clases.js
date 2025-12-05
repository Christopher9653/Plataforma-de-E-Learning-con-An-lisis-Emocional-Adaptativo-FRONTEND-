// src/pages/docente/clases.js
import MainLayout from "@/components/layout/MainLayout";
import ClassCard from "@/components/clases/ClassCard";
import Link from "next/link";

export default function DocenteClases() {
  const misClases = [
    {
      id: 1,
      titulo: "Introducción a la Programación",
      descripcion: "Curso básico para aprender los fundamentos de la lógica y sintaxis.",
      estudiantes: 32,
      imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    },
    {
      id: 2,
      titulo: "Matemáticas Aplicadas",
      descripcion: "Curso práctico de matemáticas para ingeniería y ciencia.",
      estudiantes: 21,
      imagen: "https://images.unsplash.com/photo-1537432376769-00a4f1a8c1c7",
    },
    {
      id: 3,
      titulo: "Biología General",
      descripcion: "Fundamentos biológicos explicados de manera visual e interactiva.",
      estudiantes: 15,
      imagen: "https://images.unsplash.com/photo-1559757175-5700dde67548",
    },
  ];

  return (
    <MainLayout>
      <div className="p-10 min-h-screen bg-gray-100 dark:bg-zinc-900">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Mis Clases</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gestiona tus cursos, estudiantes y materiales.
            </p>
          </div>

          <Link
            href="/docente/crear-clase"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            + Crear Nueva Clase
          </Link>
        </div>

        {/* Grid de clases */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {misClases.map((clase) => (
            <ClassCard key={clase.id} clase={clase} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import ClassList from "@/components/clases/ClassList";

export default function DocenteDashboard() {
  const { user } = useAuth("docente"); 
  const { logout } = useContext(AuthContext);

  // 🔥 Ejemplo de clases del docente (simulación temporal)
  const misClases = [
    {
      id: 1,
      title: "Introducción a la Programación",
      description: "Conceptos básicos y primeros pasos en la programación.",
      students: 12,
    },
    {
      id: 2,
      title: "Matemáticas Básicas",
      description: "Repaso de fundamentos matemáticos.",
      students: 18,
    },
    {
      id: 3,
      title: "Lógica Computacional",
      description: "Pensamiento lógico aplicado a algoritmos.",
      students: 9,
    },
  ];

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Hola de Nuevo, {user?.name || "Estudiante"}</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus clases, estudiantes y revisa los reportes de progreso aquí.
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border-r border-gray-200">
              <p className="text-3xl font-bold text-blue-600">{misClases.length}</p>
              <h3 className="text-lg font-semibold text-gray-700 mt-2">Clases Activas</h3>
            </div>

            <div className="text-center p-4 border-r border-gray-200">
              <p className="text-3xl font-bold text-green-600">29</p>
              <h3 className="text-lg font-semibold text-gray-700 mt-2">Estudiantes</h3>
            </div>

            <div className="text-center p-4">
              <p className="text-3xl font-bold text-purple-600">87%</p>
              <h3 className="text-lg font-semibold text-gray-700 mt-2">Progreso Promedio</h3>
            </div>
          </div>
        </div>

        {/* Enlaces Rápidos */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex space-x-6">
            <a href="/docente/clases" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Mis Clases
            </a>

            <a href="/docente/crear-clase" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              Crear Nueva Clase
            </a>

            <a href="/docente/estudiantes" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
              Seguimiento Emocional
            </a>

            <a href="/docente/reportes" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
              Reportes
            </a>
          </div>
        </div>

        {/* Mis clases */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mis Clases</h3>

          <ClassList classes={misClases} />
        </div>
      </div>
    </MainLayout>
  );
}

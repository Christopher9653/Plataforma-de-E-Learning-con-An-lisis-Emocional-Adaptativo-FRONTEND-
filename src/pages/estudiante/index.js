import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function EstudianteDashboard() {
  const { user } = useAuth("estudiante"); // Protección por rol
  const { logout } = useContext(AuthContext);

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">EduAdapt</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mt-2">
            Bienvenido, {user?.name || "Estudiante"}
          </h2>
          <p className="text-gray-600 mt-1">
            Tu espacio personal de aprendizaje adaptativo
          </p>
        </div>

        {/* Estadísticas */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-3 gap-4">

            <div className="text-center p-4 border-r border-gray-200">
              <p className="text-3xl font-bold text-blue-600">4</p>
              <h3 className="text-lg font-semibold text-gray-700 mt-2">
                Cursos Inscritos
              </h3>
            </div>

            <div className="text-center p-4 border-r border-gray-200">
              <p className="text-3xl font-bold text-green-600">12</p>
              <h3 className="text-lg font-semibold text-gray-700 mt-2">
                Clases Completadas
              </h3>
            </div>

            <div className="text-center p-4">
              <p className="text-3xl font-bold text-purple-600">76%</p>
              <h3 className="text-lg font-semibold text-gray-700 mt-2">
                Progreso Total
              </h3>
            </div>

          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Accesos Rápidos
          </h3>

          <div className="flex space-x-6">

            <a
              href="/estudiante/clases"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Mis Clases
            </a>

            <a
              href="/estudiante/inscripciones"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Inscribirme en Cursos
            </a>

            <a
              href="/estudiante/mi-progreso"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Mi Progreso
            </a>

            <a
              href="/estudiante/pruebas"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
            >
              Pruebas Adaptativas
            </a>

          </div>
        </div>

        {/* Últimas clases */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Últimas clases que viste
          </h3>

          <div className="grid grid-cols-2 gap-6">

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700">
                Introducción a la Programación
              </h4>
              <p className="text-sm text-gray-500 mt-1">Clase 1: Variables</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Continuar
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700">
                Matemáticas Básicas
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Clase 3: Fracciones
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Continuar
              </button>
            </div>

          </div>
        </div>

        {/* Cerrar sesión */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Cerrar Sesión
          </button>
        </div>

      </div>
    </MainLayout>
  );
}

import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { useRouter } from "next/router";

export default function EstudianteDashboard() {
  const { user } = useAuth("estudiante"); // Protección por rol
  const { logout } = useContext(AuthContext);
    const router = useRouter();
   const irAlReproductor = (cursoId) => {
    router.push(`/estudiante/clase/${cursoId}`);
  };

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido, {user?.name || "Estudiante"}</h1>
          <p className="text-gray-600 mt-1">
            Que quieres aprender hoy?
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
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Últimas clases que viste
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tarjeta 1 */}
          <div className="p-4 border border-gray-200 rounded-xl hover:shadow-lg transition duration-200 cursor-pointer">
            <div className="flex items-center gap-4">
              <img 
                src="/img/curso1.jpg"
                className="w-20 h-20 rounded-lg object-cover"
                alt="Curso"
              />

              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-lg">
                  Introducción a la Programación
                </h4>

                <p className="text-sm text-gray-500 mt-1">
                  Última clase: <span className="font-medium">Variables</span>
                </p>

                {/* Progreso */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: "45%" }}
                  ></div>
                </div>

                <button 
                  onClick={() => irAlReproductor("curso-programacion")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>

          {/* Tarjeta 2 */}
          <div className="p-4 border border-gray-200 rounded-xl hover:shadow-lg transition duration-200 cursor-pointer">
            <div className="flex items-center gap-4">
              <img 
                src="/img/curso2.jpg"
                className="w-20 h-20 rounded-lg object-cover"
                alt="Curso"
              />

              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-lg">
                  Matemáticas Básicas
                </h4>

                <p className="text-sm text-gray-500 mt-1">
                  Última clase: <span className="font-medium">Fracciones</span>
                </p>

                {/* Progreso */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: "25%" }}
                  ></div>
                </div>

                <button 
                  onClick={() => irAlReproductor("curso-matematicas")}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </MainLayout>
  );
}

import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function AdminDashboard() {
  const { user } = useAuth("admin"); // Protección por rol
  const { logout } = useContext(AuthContext);

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        {/* Encabezado */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mt-2">
            Panel Administrativo
          </h2>
          <p className="text-gray-600 mt-1">
            Gestión completa de la plataforma
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 border-r border-gray-200">
              <p className="text-3xl font-bold text-blue-600">9</p>
              <h3 className="text-lg font-semibold text-gray-700 mt-2">
                Usuarios Registrados
              </h3>
            </div>
            <div className="text-center p-4 border-r border-gray-200">
              <p className="text-3xl font-bold text-green-600">2</p>
              <h3 className="text-lg font-semibold text-gray-700 mt-2">
                Cursos Activos
              </h3>
            </div>
            <div className="text-center p-4 border-r border-gray-200">
              <p className="text-3xl font-bold text-purple-600">1</p>
              <h3 className="text-lg font-semibold text-gray-700 mt-2">
                Profesores
              </h3>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-orange-600">3</p>
              <h3 className="text-lg font-semibold text-gray-700 mt-2">
                Estudiantes
              </h3>
            </div>
          </div>
        </div>

        {/* Enlaces de gestión */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex space-x-6">
            <a
              href="/admin/usuarios"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Gestión de Usuarios
            </a>
            <a
              href="/admin/cursos"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Gestión de Cursos
            </a>
            <a
              href="/admin/estadisticas"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Estadísticas
            </a>
            <a
              href="/admin/reportes"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
            >
              Reportes
            </a>
          </div>
        </div>

        <div className="mb-8">
          <hr className="border-gray-300" />
        </div>

        {/* Gestión de Cursos */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Gestión de Cursos
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Introducción a la Programación
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Profesor Ejemplo
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    PROG101
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="space-x-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href="#"
                      className="px-4 py-2 bg-blue-500 text-white border-blue-600 rounded-lg  font-medium"
                    >
                      Editar
                    </a>
                    <a
                      href="#"
                      className="px-3 py-2  bg-red-400 text-white border-red-600 rounded-lg  font-medium"
                    >
                      Eliminar
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Biología
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Profesor Ejemplo
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    CRSQ4TQZG
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    1
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="space-x-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href="#"
                      className="px-4 py-2 bg-blue-500 text-white border-blue-600 rounded-lg  font-medium"
                    >
                      Editar
                    </a>
                    <a
                      href="#"
                      className="px-3 py-2  bg-red-400 text-white border-red-600 rounded-lg  font-medium"
                    >
                      Eliminar
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Crear Nuevo Curso
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Gestión de Usuarios
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Administrador General
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    admin@mail.com
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Administrador
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="space-x-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href="#"
                      className="px-4 py-2 bg-blue-500 text-white border-blue-600 rounded-lg  font-medium"
                    >
                      Editar
                    </a>
                    <a
                      href="#"
                      className="px-3 py-2  bg-red-400 text-white border-red-600 rounded-lg  font-medium"
                    >
                      Eliminar
                    </a>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    María Pérez
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    docente@mail.com
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Docente
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="space-x-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href="#"
                      className="px-4 py-2 bg-blue-500 text-white border-blue-600 rounded-lg  font-medium"
                    >
                      Editar
                    </a>
                    <a
                      href="#"
                      className="px-3 py-2  bg-red-400 text-white border-red-600 rounded-lg  font-medium"
                    >
                      Eliminar
                    </a>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Luis Torres
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    estudiante@mail.com
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Estudiante
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Inactivo
                    </span>
                  </td>
                  <td className="space-x-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href="#"
                      className="px-4 py-2 bg-blue-500 text-white border-blue-600 rounded-lg  font-medium"
                    >
                      Editar
                    </a>
                    <a
                      href="#"
                      className="px-3 py-2  bg-red-400 text-white border-red-600 rounded-lg  font-medium"
                    >
                      Eliminar
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Crear Nuevo Usuario
            </button>
          </div>
        </div>

        {/* Estadísticas de Cursos */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Estadísticas de Cursos
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {/* Tarjeta Curso 1 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Introducción a la Programación
              </h4>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">2</p>
                  <p className="text-sm text-gray-600">Estudiantes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">3</p>
                  <p className="text-sm text-gray-600">Módulos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">3</p>
                  <p className="text-sm text-gray-600">Clases</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">50%</p>
                  <p className="text-sm text-gray-600">Completación</p>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Ver Detalles
              </button>
            </div>

            {/* Tarjeta Curso 2 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Biología
              </h4>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">1</p>
                  <p className="text-sm text-gray-600">Estudiantes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-600">Módulos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-600">Clases</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">0%</p>
                  <p className="text-sm text-gray-600">Completación</p>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

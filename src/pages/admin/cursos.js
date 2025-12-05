import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";

export default function CursosAdmin() {
  useAuth("admin");

  return (
    <MainLayout>
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4">Administración de Cursos</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3">Curso</th>
                <th className="px-6 py-3">Profesor</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                  Introducción a la Programación
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                  Docente Ejemplo
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                  Activo
                </td>
                <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center space-x-6">
                  <a
                    href="#"
                    className="px-4 py-2 bg-blue-500 text-white border-blue-600 rounded-lg  font-medium"
                  >
                    Ver
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
      </div>
    </MainLayout>
  );
}

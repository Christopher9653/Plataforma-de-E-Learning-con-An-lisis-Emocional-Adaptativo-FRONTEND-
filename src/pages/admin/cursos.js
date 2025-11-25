import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";

export default function CursosAdmin() {
  useAuth("admin");

  return (
    <MainLayout>
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4">Administración de Cursos</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md">
            Crear curso
          </button>

          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3">Curso</th>
                <th className="px-6 py-3">Profesor</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4">Introducción a la Programación</td>
                <td className="px-6 py-4">Docente Ejemplo</td>
                <td className="px-6 py-4">Activo</td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600">Ver</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

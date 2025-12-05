import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";

export default function UsuariosAdmin() {
  useAuth("admin");

  return (
    <MainLayout>
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">Lista de usuarios registrados:</p>

          <table className="min-w-full divide-y divide-gray-200">
  <thead>
    <tr className="bg-gray-50">
      <th className="px-6 py-3 text-center">Nombre</th>
      <th className="px-6 py-3 text-center">Email</th>
      <th className="px-6 py-3 text-center">Rol</th>
      <th className="px-6 py-3 text-center">Acciones</th>
    </tr>
  </thead>

  <tbody className="bg-white divide-y divide-gray-200">
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
        Administrador
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 text-center">
        admin@mail.com
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 text-center">
        Admin
      </td>

      <td className="space-x-6 py-4 whitespace-nowrap text-sm font-medium text-center">
        <a
          href="#"
          className="px-4 py-2 bg-blue-500 text-white border-blue-600 rounded-lg font-medium"
        >
          Editar
        </a>
        <a
          href="#"
          className="px-3 py-2 bg-red-400 text-white border-red-600 rounded-lg font-medium"
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

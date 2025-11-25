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
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4">Administrador</td>
                <td className="px-6 py-4">admin@mail.com</td>
                <td className="px-6 py-4">Admin</td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600">Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

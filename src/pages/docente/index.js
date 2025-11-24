import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function DocenteDashboard() {
  const { user } = useAuth("docente");
  const { logout } = useContext(AuthContext);

  return (
    <MainLayout>
      <div className="p-10">
        <h1 className="text-3xl font-bold">Dashboard Docente</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, {user?.name || "Profesor"}.
        </p>

        <div className="mt-6 space-y-4">
          <a href="/docente/clases" className="block p-4 bg-white shadow rounded-lg">
            Mis Clases
          </a>

          <a href="/docente/crear-clase" className="block p-4 bg-white shadow rounded-lg">
            Crear / Subir Clase
          </a>

          <a href="/docente/estudiantes" className="block p-4 bg-white shadow rounded-lg">
            Seguimiento Emocional
          </a>

          <a href="/docente/reportes" className="block p-4 bg-white shadow rounded-lg">
            Reportes del Docente
          </a>
        </div>

        <button
          onClick={logout}
          className="mt-8 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>
    </MainLayout>
  );
}

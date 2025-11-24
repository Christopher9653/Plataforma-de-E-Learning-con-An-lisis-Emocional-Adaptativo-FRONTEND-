import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function EstudianteDashboard() {
  const { user } = useAuth("estudiante");
  const { logout } = useContext(AuthContext);

  return (
    <MainLayout>
      <div className="p-10">
        <h1 className="text-3xl font-bold">Dashboard Estudiante</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, {user?.name || "Estudiante"}.
        </p>

        <div className="mt-6 space-y-4">
          <a href="/estudiante/clases" className="block p-4 bg-white shadow rounded-lg">
            Clases Disponibles
          </a>

          <a href="/estudiante/inscripciones" className="block p-4 bg-white shadow rounded-lg">
            Mis Inscripciones
          </a>

          <a href="/estudiante/mi-progreso" className="block p-4 bg-white shadow rounded-lg">
            Mi Progreso
          </a>

          <a href="/estudiante/pruebas" className="block p-4 bg-white shadow rounded-lg">
            Pruebas Adaptativas
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

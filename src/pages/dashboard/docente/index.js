import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";
import ClassList from "@/components/clases/ClassList";

const API = "http://localhost:8000/api";

export default function DocenteDashboard() {
  const { user } = useAuth("docente");
  const { token } = useContext(AuthContext);

  const [misClases, setMisClases] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =============================
      OBTENER CLASES DEL DOCENTE
  ============================== */
  useEffect(() => {
    if (!user || !token) return;

    const fetchClases = async () => {
      try {
        const res = await fetch(
          `${API}/course/?teacher=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Error al obtener clases");

        const data = await res.json();

        const clases =
          Array.isArray(data) ? data :
          Array.isArray(data.results) ? data.results :
          [];

        setMisClases(clases);
      } catch (error) {
        console.error("Dashboard docente:", error);
        setMisClases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClases();
  }, [user, token]);

  /* =============================
      MÉTRICAS (ROBUSTAS)
  ============================== */

  // Clases activas (si existe is_active, se filtra)
  const clasesActivas = misClases.filter(
    (c) => c.is_active !== false
  );

  // Total estudiantes (soporta distintos nombres)
  const totalEstudiantes = misClases.reduce((acc, c) => {
    return (
      acc +
      (c.students_count ||
        c.total_students ||
        c.enrolled_students ||
        0)
    );
  }, 0);

  return (
    <MainLayout>
      <div className="p-10 min-h-screen bg-gray-100">

        {/* ===== ENCABEZADO ===== */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenido, {user?.name || "Docente"}
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus cursos, estudiantes y contenido académico.
          </p>
        </div>

        {/* ===== ESTADÍSTICAS ===== */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {clasesActivas.length}
              </p>
              <p className="text-gray-600 mt-1">
                Clases Activas
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {totalEstudiantes}
              </p>
              <p className="text-gray-600 mt-1">
                Estudiantes Inscritos
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">—</p>
              <p className="text-gray-600 mt-1">
                Progreso Promedio
              </p>
            </div>

          </div>
        </div>

        {/* ===== ACCIONES RÁPIDAS ===== */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-wrap gap-4">

            <Link
              href="/dashboard/docente/clases"
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Mis Clases
            </Link>

            <Link
              href="/dashboard/docente/clases/crear"
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Crear Curso
            </Link>

            <Link
              href="/dashboard/docente/estudiantes"
              className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Estudiantes
            </Link>

            <Link
              href="/dashboard/docente/reportes"
              className="px-5 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Reportes
            </Link>

          </div>
        </div>

        {/* ===== LISTA DE CLASES (MISMO DISEÑO QUE /CLASES) ===== */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Mis Clases
          </h2>

          {loading ? (
            <p className="text-gray-500">
              Cargando clases...
            </p>
          ) : misClases.length === 0 ? (
            <p className="text-gray-500">
              Aún no tienes clases creadas.
            </p>
          ) : (
            <ClassList classes={misClases} />
          )}
        </div>

      </div>
    </MainLayout>
  );
}

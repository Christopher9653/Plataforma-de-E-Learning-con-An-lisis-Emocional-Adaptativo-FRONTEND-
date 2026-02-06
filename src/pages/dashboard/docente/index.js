import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { AuthContext } from "@/context/AuthContext";
import ClassList from "@/components/clases/ClassList";

const API = "https://edumotion-backend1.onrender.com/api/";

export default function DocenteDashboard() {
  const { user } = useAuth("docente");
  const { token } = useContext(AuthContext);

  const [misClases, setMisClases] = useState([]);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [teacherName, setTeacherName] = useState("");
  const [loading, setLoading] = useState(true);

  /* =============================
      OBTENER CLASES DEL DOCENTE
  ============================== */
  useEffect(() => {
    if (!user) return;

    const fetchClases = async () => {
      try {
        const teacherRes = await fetch(`${API}/teacher/${user.id}/`);
        if (teacherRes.ok) {
          const teacherData = await teacherRes.json();
          setTeacherName(teacherData.fullname || teacherData.full_name || "");
        }

        const res = await fetch(`${API}/teacher-course/${user.id}`);

        if (!res.ok) throw new Error("Error al obtener clases");

        const data = await res.json();

        const clases =
          Array.isArray(data) ? data :
          Array.isArray(data.results) ? data.results :
          [];

        setMisClases(clases);

        const resStudents = await fetch(
          `${API}/fetch-all-enrolled-students/${user.id}`
        );
        if (resStudents.ok) {
          const studentsData = await resStudents.json();
          setTotalEstudiantes(Array.isArray(studentsData) ? studentsData.length : 0);
        }
      } catch (error) {
        console.error("Dashboard docente:", error);
        setMisClases([]);
        setTotalEstudiantes(0);
      } finally {
        setLoading(false);
      }
    };

    fetchClases();
  }, [user]);

  /* =============================
      MÉTRICAS (ROBUSTAS)
  ============================== */

  // Clases activas (si existe is_active, se filtra)
  const clasesActivas = misClases.filter(
    (c) => c.is_active !== false
  );

  // Total estudiantes (soporta distintos nombres)
  const totalEstudiantesFallback = misClases.reduce((acc, c) => {
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
            Bienvenido, {teacherName || user?.fullname || user?.full_name || user?.name || "Docente"}
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
                {totalEstudiantes || totalEstudiantesFallback}
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

        {/* ===== LISTA DE CURSOS (MISMO DISEÑO QUE /DOCENTE/CLASES) ===== */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Mis Cursos
          </h2>

          {loading ? (
            <p className="text-gray-500">
              Cargando cursos...
            </p>
          ) : misClases.length === 0 ? (
            <p className="text-gray-500">
              Aún no tienes cursos creados.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {misClases.map((curso) => (
                <Link
                  key={curso.id}
                  href={`/dashboard/docente/clases/${curso.id}`}
                  className="group block bg-white rounded-xl border hover:shadow-lg transition overflow-hidden"
                >
                  <div className="h-40 bg-gray-200 overflow-hidden">
                    {curso.featured_img ? (
                      <img
                        src={curso.featured_img}
                        alt={curso.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600">
                        <span className="text-white font-semibold text-lg text-center px-4">
                          {curso.title}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                      {curso.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mt-2 mb-4">
                      {curso.description || "Este curso no tiene descripción."}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>
                        👥 {curso.total_enrolled_students || 0} estudiantes
                      </span>
                      <span>
                        📚 {curso.course_modules?.length || 0} módulos
                      </span>
                    </div>

                    <span className="inline-block text-sm font-medium text-blue-600 group-hover:underline">
                      Administrar curso →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}

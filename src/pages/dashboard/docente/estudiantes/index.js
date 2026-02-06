import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

export default function Estudiantes() {
  const { user } = useAuth("docente");
  const router = useRouter();
  const { course } = router.query;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (!course) {
          setStudents([]);
          return;
        }
        const res = await fetch(
          `https://edumotion-backend1.onrender.com/apifetch-enrolled-students/${course}`
        );
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];

        const mapped = list.map((row) => row.student || row.student_id || row);
        setStudents(mapped);
      } catch (e) {
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStudents();
  }, [user, course]);

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Seguimiento Emocional de Estudiantes
          </h2>
          <Link
            href="/dashboard/docente/reportes"
            className="px-4 py-2 rounded border text-sm hover:bg-white"
          >
            Volver a reportes
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Estudiantes inscritos
            </h3>
            {loading ? (
              <p className="text-gray-500">Cargando estudiantes...</p>
            ) : !course ? (
              <p className="text-gray-500">
                Selecciona un curso desde Reportes para ver sus estudiantes.
              </p>
            ) : students.length === 0 ? (
              <p className="text-gray-500">No hay estudiantes inscritos.</p>
            ) : (
              <ul className="space-y-2">
                {students.map((s) => {
                  const id = s.id || s;
                  const name = s.fullname || s.email || `Estudiante ${id}`;
                  return (
                    <li key={id}>
                      <button
                        onClick={() => router.push(`/dashboard/docente/estudiantes/${id}`)}
                        className="w-full text-left px-3 py-2 rounded border hover:bg-gray-50"
                      >
                        {name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

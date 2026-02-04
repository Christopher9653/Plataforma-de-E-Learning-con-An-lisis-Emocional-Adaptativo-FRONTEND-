"use client";

import { useEffect, useState, useContext } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";

const API = "http://localhost:8000/api";

export default function ProgresoEstudiante() {
  const { user } = useContext(AuthContext);

  const [cursos, setCursos] = useState([]);
  const [progreso, setProgreso] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "estudiante") {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // 1️⃣ Cursos reales del backend
        const res = await fetch(
          `${API}/fetch-enrolled-courses/${user.id}`
        );

        if (!res.ok) throw new Error("Error cursos");

        const cursosData = await res.json();
        setCursos(cursosData || []);

        // 2️⃣ Progreso (localStorage por ahora)
        const progresoLocal =
          JSON.parse(localStorage.getItem("progresoCursos")) || {};

        setProgreso(progresoLocal);
      } catch (err) {
        console.error("Error progreso:", err);
        setCursos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-10">Cargando progreso...</div>
      </MainLayout>
    );
  }

  return (
    <AuthGuard role="estudiante">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Mi Progreso
          </h1>

          {cursos.length === 0 ? (
            <p className="text-gray-500">
              No tienes cursos inscritos.
            </p>
          ) : (
            <div className="space-y-6">
              {cursos.map((curso) => {
                const prog = progreso[curso.id] || {};
                const porcentaje = prog.porcentaje || 0;

                return (
                  <div
                    key={curso.id}
                    className="bg-white p-6 rounded-lg shadow"
                  >
                    <h2 className="text-xl font-semibold text-gray-800">
                      {curso.title}
                    </h2>

                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        Progreso: {porcentaje}%
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Clases completadas:{" "}
                        {prog.clasesCompletadas || 0}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

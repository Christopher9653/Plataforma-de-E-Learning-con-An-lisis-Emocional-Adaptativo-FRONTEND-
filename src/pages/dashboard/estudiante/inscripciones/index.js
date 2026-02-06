"use client";

import { useEffect, useState, useContext } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import Swal from "sweetalert2";

const API = "https://edumotion-backend1.onrender.com";

export default function InscribirseCursos() {
  const { user } = useContext(AuthContext);

  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollStatus, setEnrollStatus] = useState({});

  // PAGINACION
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // ===============================
  // CARGAR CURSOS PAGINADOS
  // ===============================
  useEffect(() => {
    if (!user) return;

    const cargarDatos = async () => {
      setLoading(true);

      try {
        // CURSOS (paginados)
        const resCursos = await fetch(
          `${API}/course/?page=${page}&student_id=${user.id}`
        );
        const dataCursos = await resCursos.json();

        const listaCursos = dataCursos.results || dataCursos || [];

        setCursos(listaCursos);
        setHasNext(Boolean(dataCursos.next));
        setHasPrev(Boolean(dataCursos.previous));

        // ESTADO DE INSCRIPCION (si backend incluye is_enrolled)
        const estados = {};

        for (const curso of listaCursos) {
          if (typeof curso.is_enrolled === "boolean") {
            estados[curso.id] = curso.is_enrolled === true;
            continue;
          }

          try {
            const res = await fetch(
              `${API}/fetch-enroll-status/${user.id}/${curso.id}`
            );
            const data = await res.json();
            estados[curso.id] = data.enrolled === true;
          } catch {
            estados[curso.id] = false;
          }
        }

        setEnrollStatus(estados);
      } catch (error) {
        console.error("Error cargando cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user, page]);

  // ===============================
  // INSCRIBIRSE EN CURSO
  // ===============================
  const inscribirse = async (courseId) => {
    try {
      // Verificar inscripcion real
      const check = await fetch(
        `${API}/fetch-enroll-status/${user.id}/${courseId}`
      );
      const checkData = await check.json();

      if (checkData.enrolled === true) {
        await Swal.fire(
          "Ya inscrito",
          "El estudiante ya esta inscrito en este curso",
          "info"
        );
        setEnrollStatus((prev) => ({
          ...prev,
          [courseId]: true,
        }));
        return;
      }

      // Inscripcion
      const res = await fetch(`${API}/student-enroll-course/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student: user.id,
          course: courseId,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok || data.ok === false || data.bool === false) {
        const detail =
          data?.details?.non_field_errors?.[0] ||
          data?.message ||
          data?.error ||
          "Error al inscribirse";
        await Swal.fire("Error", detail, "error");
        return;
      }

      setEnrollStatus((prev) => ({
        ...prev,
        [courseId]: true,
      }));

      await Swal.fire("OK", "Inscripcion realizada con exito", "success");
    } catch (error) {
      console.error("Inscripcion:", error);
      await Swal.fire(
        "Error",
        "No se pudo completar la inscripcion",
        "error"
      );
    }
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">
          Cargando cursos disponibles...
        </div>
      </MainLayout>
    );
  }

  return (
    <AuthGuard role="estudiante">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">
          {/* ENCABEZADO */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Inscribirme en Cursos
            </h1>
            <p className="text-gray-600 mt-1">
              Descubre nuevos cursos y amplia tus conocimientos
            </p>
          </div>

          {/* LISTA DE CURSOS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((curso) => {
              const inscrito = enrollStatus[curso.id];

              return (
                <div
                  key={curso.id}
                  className="bg-white border rounded-lg p-5 shadow hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-lg text-gray-800">
                    {curso.title}
                  </h3>

                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {curso.description}
                  </p>

                  {inscrito ? (
                    <Link
                      href={`/dashboard/estudiante/cursos/${curso.id}`}
                      className="mt-4 block w-full py-2 rounded-lg font-medium text-center bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Ver curso
                    </Link>
                  ) : (
                    <button
                      onClick={() => inscribirse(curso.id)}
                      className="mt-4 w-full py-2 rounded-lg font-medium transition bg-green-600 text-white hover:bg-green-700"
                    >
                      Inscribirme
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* PAGINACION */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              disabled={!hasPrev}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`px-4 py-2 rounded-lg ${
                hasPrev
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              ← Anterior
            </button>

            <span className="font-medium text-gray-700">Pagina {page}</span>

            <button
              disabled={!hasNext}
              onClick={() => setPage((p) => p + 1)}
              className={`px-4 py-2 rounded-lg ${
                hasNext
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Siguiente →
            </button>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

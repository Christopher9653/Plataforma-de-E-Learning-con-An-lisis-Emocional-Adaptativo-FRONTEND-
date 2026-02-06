"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";
import ClassVideoPlayer from "@/components/clases/ClassVideoPlayer";

const API = "https://edumotion-backend1.onrender.com/api";

export default function CursoReproductor() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);

  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;

    const fetchCursoCompleto = async () => {
      try {
        // 1️⃣ Curso
        const resCurso = await fetch(`${API}/course/${id}/`);
        if (!resCurso.ok) throw new Error("Curso no encontrado");

        const cursoData = await resCurso.json();

        // 2️⃣ Módulos
        const resMod = await fetch(`${API}/course/${id}/modules/`);
        const modulos = resMod.ok ? await resMod.json() : [];

        // 3️⃣ Clases por módulo
        const modulosConClases = await Promise.all(
          modulos.map(async (mod) => {
            const resVideos = await fetch(
              `${API}/modules/${mod.id}/videos/`
            );

            const clases = resVideos.ok ? await resVideos.json() : [];

            return {
              ...mod,
              clases,
            };
          })
        );

        setCurso({
          ...cursoData,
          modulos: modulosConClases,
        });
      } catch (error) {
        console.error("Error cargando curso:", error);
        router.push("/dashboard/estudiante/cursos");
      } finally {
        setLoading(false);
      }
    };

    fetchCursoCompleto();
  }, [id, user, router]);

  if (loading) {
    return (
      <MainLayout>
        <p className="p-10">Cargando curso...</p>
      </MainLayout>
    );
  }

  if (!curso) return null;

  return (
    <AuthGuard role="estudiante">
      {/* 👇 AQUÍ SE USA TU REPRODUCTOR */}
      <ClassVideoPlayer curso={curso} />
    </AuthGuard>
  );
}

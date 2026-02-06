"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthGuard from "@/components/auth/AuthGuard";
import ClassVideoPlayer from "@/components/clases/ClassVideoPlayer";

const API = "https://edumotion-backend1.onrender.com/api";

export default function ReproductorClase() {
  const router = useRouter();
  const { id } = router.query;

  const [curso, setCurso] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchClase = async () => {
      try {
        // 1️⃣ Clase
        const resClase = await fetch(`${API}/chapter-videos/${id}/`);
        const clase = await resClase.json();

        const courseId = clase.module.course.id;

        // 2️⃣ Curso
        const resCurso = await fetch(`${API}/course/${courseId}/`);
        const cursoData = await resCurso.json();

        // 3️⃣ Módulos
        const resMod = await fetch(`${API}/course/${courseId}/modules/`);
        const modulos = await resMod.json();

        // 4️⃣ Clases
        const modulosFinal = await Promise.all(
          modulos.map(async (mod) => {
            const resVid = await fetch(
              `${API}/modules/${mod.id}/videos/`
            );
            const clases = resVid.ok ? await resVid.json() : [];
            return { ...mod, clases };
          })
        );

        setCurso({
          ...cursoData,
          modulos: modulosFinal,
        });
      } catch (e) {
        console.error(e);
        router.push("/dashboard/estudiante/cursos");
      }
    };

    fetchClase();
  }, [id, router]);

  if (!curso) return null;

  return (
    <AuthGuard role="estudiante">
      <ClassVideoPlayer curso={curso} />
    </AuthGuard>
  );
}

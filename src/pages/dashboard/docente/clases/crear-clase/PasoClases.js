"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const API = "https://edumotion-backend1.onrender.com/api";

export default function PasoClases({ courseId, modulos, onFinish }) {
  const router = useRouter();

  const cursoId = courseId || router.query.course;
  const moduloUnico = router.query.modulo;

  const baseModulos = useMemo(() => {
    const safeModulos = Array.isArray(modulos) ? modulos : [];
    return moduloUnico
      ? safeModulos.filter((m) => m.id == moduloUnico)
      : safeModulos;
  }, [moduloUnico, modulos]);

  const [clases, setClases] = useState([]);

  useEffect(() => {
    if (baseModulos.length === 0) {
      setClases([]);
      return;
    }

    setClases(
      baseModulos.map((m) => ({
        moduleId: m.id,
        moduleTitle: m.title,
        lessons: [{ title: "", video: null }],
      }))
    );
  }, [baseModulos]);

  const addClase = (mIndex) => {
    const copy = [...clases];
    copy[mIndex].lessons.push({ title: "", video: null });
    setClases(copy);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      for (const modulo of clases) {
        for (const lesson of modulo.lessons) {
          if (!lesson.video) continue;

          const fd = new FormData();
          fd.append("module", modulo.moduleId);
          fd.append("course", cursoId);
          fd.append("title", lesson.title);
          fd.append("video", lesson.video);

          const res = await fetch(
            `${API}/modules/${modulo.moduleId}/videos/`,
            { method: "POST", body: fd }
          );

          if (!res.ok) throw new Error(await res.text());
        }
      }

      await Swal.fire(
        "Clases creadas",
        "Las clases se subieron correctamente",
        "success"
      );

      onFinish?.();
      router.push(`/dashboard/docente/clases/${cursoId}`);
    } catch (err) {
      console.error(err);
      await Swal.fire(
        "Error",
        "No se pudieron subir las clases",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Clases</h2>

      {clases.map((mod, mIndex) => (
        <div key={mod.moduleId} className="mb-6 border p-4 rounded">
          <h3 className="font-semibold mb-3">
            {mod.moduleTitle}
          </h3>

          {mod.lessons.map((lesson, lIndex) => (
            <div key={lIndex} className="mb-4">
              <input
                placeholder="Título de la clase"
                className="w-full border px-3 py-2 rounded mb-2"
                onChange={(e) => {
                  const copy = [...clases];
                  copy[mIndex].lessons[lIndex].title =
                    e.target.value;
                  setClases(copy);
                }}
              />

              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const copy = [...clases];
                  copy[mIndex].lessons[lIndex].video =
                    e.target.files[0];
                  setClases(copy);
                }}
              />
            </div>
          ))}

          <button
            onClick={() => addClase(mIndex)}
            className="text-sm text-blue-600 hover:underline"
          >
            + Agregar otra clase
          </button>
        </div>
      ))}


      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Subiendo..." : "Finalizar"}
      </button>
    </div>
  );
}

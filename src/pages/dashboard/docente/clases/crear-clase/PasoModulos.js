"use client";

import { useState } from "react";
import { useRouter } from "next/router";

const API = "https://edumotion-backend1.onrender.com/api";

export default function PasoModulos({ courseId, onNext, setModulos }) {
  const router = useRouter();
  const cursoId = courseId || router.query.course;

  const [modulos, setLocalModulos] = useState([
    { title: "", description: "" },
  ]);
  const [loading, setLoading] = useState(false);

  const addModulo = () => {
    setLocalModulos([...modulos, { title: "", description: "" }]);
  };

  const handleChange = (i, field, value) => {
    const copy = [...modulos];
    copy[i][field] = value;
    setLocalModulos(copy);
  };

  const handleSubmit = async () => {
    if (!cursoId) {
      alert("Curso no definido");
      return;
    }

    setLoading(true);

    try {
      const creados = [];

      for (const m of modulos) {
        const res = await fetch(`${API}/modules/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: m.title,
            description: m.description,
            course: cursoId,
          }),
        });

        if (!res.ok) throw new Error(await res.text());
        creados.push(await res.json());
      }

      setModulos?.(creados);
      onNext?.();

      // 👉 si venimos desde [id].js
      if (!onNext) {
        router.push(`/dashboard/docente/clases/${cursoId}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error al crear módulo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Módulos</h2>

      {modulos.map((m, i) => (
        <div key={i} className="mb-4 space-y-2">
          <input
            placeholder="Título del módulo"
            className="w-full border px-4 py-2 rounded"
            onChange={(e) => handleChange(i, "title", e.target.value)}
          />
          <textarea
            placeholder="Descripción"
            className="w-full border px-4 py-2 rounded"
            onChange={(e) =>
              handleChange(i, "description", e.target.value)
            }
          />
        </div>
      ))}

      <div className="flex justify-between">
        <button
          onClick={addModulo}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          + Agregar módulo
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}

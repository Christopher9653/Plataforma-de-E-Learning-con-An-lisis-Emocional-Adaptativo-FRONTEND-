"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";

const API = "http://localhost:8000/api";

export default function PasoCurso({ onNext, setCourseId }) {
  const { user } = useAuth("docente");

  const [curso, setCurso] = useState({
    title: "",
    description: "",
    techs: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔐 Header de autenticación
  const authHeader = {
    Authorization: `Bearer ${user?.token}`,
  };

  const handleChange = (e) => {
    setCurso({
      ...curso,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      // 🔴 CAMPOS EXACTOS DEL BACKEND
      fd.append("title", curso.title);
      fd.append("description", curso.description);
      fd.append("techs", curso.techs);
      fd.append("category", 5);              // ✅ FIJO
      fd.append("teacher", user.id);          // ✅ OBLIGATORIO
      fd.append("featured_img", "");          // ✅ null / vacío

      const res = await fetch(`${API}/course/`, {
        method: "POST",
        headers: authHeader,
        body: fd,
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      const courseCreated = await res.json();

      // Guardamos el ID del curso
      setCourseId(courseCreated.id);

      // Avanzamos al siguiente paso
      onNext();
    } catch (err) {
      console.error("Error creando curso:", err);
      alert("❌ Error al crear el curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Paso 1: Información del Curso
      </h2>

      <input
        type="text"
        name="title"
        placeholder="Título del curso"
        value={curso.title}
        onChange={handleChange}
        required
        className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring"
      />

      <textarea
        name="description"
        placeholder="Descripción del curso"
        value={curso.description}
        onChange={handleChange}
        required
        rows={4}
        className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring"
      />

      <input
        type="text"
        name="techs"
        placeholder="Tecnologías (ej: Python,Web,Backend)"
        value={curso.techs}
        onChange={handleChange}
        className="w-full mb-6 p-3 border rounded focus:outline-none focus:ring"
      />

      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creando curso..." : "Continuar"}
      </button>
    </form>
  );
}

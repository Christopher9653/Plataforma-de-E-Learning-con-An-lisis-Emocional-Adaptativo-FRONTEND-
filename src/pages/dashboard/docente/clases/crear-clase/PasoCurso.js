"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";

const API = "https://edumotion-backend1.onrender.com/api";

export default function PasoCurso({ onNext, setCourseId }) {
  const { user } = useAuth("docente");

  const [curso, setCurso] = useState({
    title: "",
    description: "",
    techs: "",
    featured_img: null,
  });

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCurso({
      ...curso,
      featured_img: file,
    });
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
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
      if (curso.featured_img) {
        fd.append("featured_img", curso.featured_img);
      }

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

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Imagen del curso
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-3 w-full max-w-sm rounded border object-cover"
          />
        )}
      </div>

      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creando curso..." : "Continuar"}
      </button>
    </form>
  );
}

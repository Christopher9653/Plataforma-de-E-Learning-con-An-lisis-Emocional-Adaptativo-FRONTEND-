"use client";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const API = "https://edumotion-backend1.onrender.com";

export default function ClassForm({ moduleId, courseId, onCreated }) {
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !video) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", video);
    formData.append("module", moduleId);
    formData.append("course", courseId);

    setLoading(true);
    try {
      const res = await fetch(`${API}/course-chapters/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw err;
      }

      setTitle("");
      setVideo(null);
      onCreated(); // 🔥 refresca clases
    } catch (err) {
      console.error("Error creando clase:", err);
      alert("Error al subir el video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <input
        type="text"
        placeholder="Título de la clase"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
      />

      <button
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Subiendo..." : "Agregar Clase"}
      </button>
    </form>
  );
}

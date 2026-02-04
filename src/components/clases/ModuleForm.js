"use client";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const API = "http://localhost:8000/api";

export default function ModuleForm({ courseId, onCreated }) {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}/modules/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          course: courseId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw err;
      }

      setTitle("");
      onCreated(); // 🔥 refresca módulos
    } catch (err) {
      console.error("Error creando módulo:", err);
      alert("No se pudo crear el módulo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <input
        type="text"
        placeholder="Nombre del módulo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 border px-3 py-2 rounded"
      />
      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 rounded"
      >
        {loading ? "Creando..." : "Agregar"}
      </button>
    </form>
  );
}

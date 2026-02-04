"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";

const API_BASE = "http://localhost:8000/api";

export default function PerfilDocente() {
  const { user, loading: authLoading } = useAuth("docente");
  const router = useRouter();

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    fetchPerfil();
  }, [user, authLoading]);

  const fetchPerfil = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📡 Cargando perfil docente:", user.id);

      // ✅ ENDPOINT CORRECTO SEGÚN TU BACKEND
      const res = await fetch(`${API_BASE}/teacher/${user.id}/`);

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Backend error:", text);
        throw new Error("No se pudo cargar el perfil");
      }

      const data = await res.json();
      console.log("✅ Perfil cargado:", data);

      setPerfil(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     ESTADOS
  =============================== */
  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Cargando perfil...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-600">{error}</p>
        </div>
      </MainLayout>
    );
  }

  if (!perfil) return null;

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Perfil del Docente</h1>

        <div className="bg-white p-6 rounded shadow max-w-3xl">
          <div className="flex items-center gap-6 mb-6">
            <img
              src="https://ui-avatars.com/api/?background=0D8ABC&color=fff"
              className="w-24 h-24 rounded-full"
              alt="avatar"
            />

            <div>
              <h2 className="text-2xl font-semibold">{perfil.name}</h2>
              <p className="text-gray-600">{perfil.email}</p>
              <p className="text-sm text-gray-500 mt-1">Docente</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Especialidad</p>
              <p className="font-medium">
                {perfil.specialty || "No definida"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Cursos creados</p>
              <p className="font-medium">{perfil.courses_count ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

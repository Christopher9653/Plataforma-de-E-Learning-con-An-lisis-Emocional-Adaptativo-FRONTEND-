"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";

const API = "http://localhost:8000/api";

export default function PerfilEstudiante() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [emotionSummary, setEmotionSummary] = useState(null);

  // ===============================
  // CARGAR PERFIL DESDE BACKEND
  // ===============================
  useEffect(() => {
    if (!user) return;

    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${API}/student/${user.id}`);
        if (!res.ok) throw new Error("Error al cargar perfil");

        const data = await res.json();
        setPerfil(data);

        // Cursos inscritos
        const resCursos = await fetch(`${API}/fetch-enrolled-courses/${user.id}`);
        if (resCursos.ok) {
          const cursosData = await resCursos.json();
          setEnrolledCount(Array.isArray(cursosData) ? cursosData.length : 0);
        }

        // Resumen emocional desde localStorage
        const progresoLocal =
          JSON.parse(localStorage.getItem("progresoCursos")) || {};
        const emociones = progresoLocal?.[data.id]?.emociones || {};
        const todas = Object.values(emociones)
          .map((r) => r?.resumen?.emocion_predominante)
          .filter(Boolean);
        if (todas.length > 0) {
          const counts = {};
          todas.forEach((e) => {
            counts[e] = (counts[e] || 0) + 1;
          });
          const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
          setEmotionSummary({
            predominante: top,
            totalReportes: todas.length,
          });
        }
      } catch (err) {
        console.error("Perfil estudiante:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Cargando perfil...
        </div>
      </MainLayout>
    );
  }

  if (!perfil) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center text-red-500">
          No se pudo cargar el perfil
        </div>
      </MainLayout>
    );
  }

  const profilePhoto = perfil.profile_img || perfil.photo || null;

  return (
    <AuthGuard role="estudiante">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">

          {/* ENCABEZADO */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Mi Perfil
            </h1>
            <p className="text-gray-600 mt-1">
              Información personal de tu cuenta
            </p>
          </div>

          {/* RESUMEN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-sm text-gray-500">Cursos inscritos</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {enrolledCount}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-sm text-gray-500">Reportes emocionales</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {emotionSummary?.totalReportes || 0}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-sm text-gray-500">Emoción predominante</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {emotionSummary?.predominante || "Sin datos"}
              </p>
            </div>
          </div>

          {/* TARJETA PERFIL */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

              {/* FOTO */}
              <div className="flex flex-col items-center">
                <div className="w-36 h-36 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shadow">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-gray-500">
                      {perfil.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <button
                  disabled
                  className="mt-4 px-4 py-2 text-sm rounded-lg bg-gray-300 text-gray-600 cursor-not-allowed"
                >
                  Cambiar foto (próximamente)
                </button>
              </div>

              {/* DATOS */}
              <div className="flex-1 w-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Datos del Estudiante
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Nombre
                    </label>
                    <p className="mt-1 text-gray-800 font-medium">
                      {perfil.fullname || "—"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="mt-1 text-gray-800 font-medium">
                      {perfil.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Rol
                    </label>
                    <p className="mt-1 text-gray-800 font-medium capitalize">
                      {perfil.role}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Estado
                    </label>
                    <span className="inline-block mt-1 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
                      Activo
                    </span>
                  </div>
                </div>

                {/* BOTONES */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() =>
                      router.push("/dashboard/estudiante/editar-perfil")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Editar Perfil
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </MainLayout>
    </AuthGuard>
  );
}

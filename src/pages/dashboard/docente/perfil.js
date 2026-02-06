"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";

const API_BASE = "https://edumotion-backend1.onrender.com";

export default function PerfilDocente() {
  const { user, loading: authLoading } = useAuth("docente");
  const router = useRouter();

  const [perfil, setPerfil] = useState(null);
  const [dashboard, setDashboard] = useState(null);
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

      const cacheKey = `teacher_dashboard_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const ageMs = Date.now() - (parsed.timestamp || 0);
          if (ageMs < 5 * 60 * 1000 && parsed.data) {
            setDashboard(parsed.data);
            return;
          }
        } catch {
          // ignore cache errors
        }
      }

      const dashRes = await fetch(`${API_BASE}/teacher/dashboard/${user.id}/`);
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setDashboard(dashData);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data: dashData })
        );
      } else {
        // Fallback: calcular métricas desde otros endpoints
        const coursesRes = await fetch(`${API_BASE}/teacher-course/${user.id}`);
        const coursesData = coursesRes.ok ? await coursesRes.json() : [];
        const coursesList = coursesData.results || coursesData || [];

        const studentsRes = await fetch(`${API_BASE}/fetch-all-enrolled-students/${user.id}`);
        const studentsData = studentsRes.ok ? await studentsRes.json() : [];
        const totalStudents = Array.isArray(studentsData) ? studentsData.length : 0;

        let totalChapters = 0;
        await Promise.all(
          coursesList.map(async (curso) => {
            const modRes = await fetch(`${API_BASE}/course/${curso.id}/modules/`);
            const modData = modRes.ok ? await modRes.json() : [];
            const modulos = modData.results || modData || [];
            await Promise.all(
              modulos.map(async (mod) => {
                const resVid = await fetch(`${API_BASE}/modules/${mod.id}/videos/`);
                const vids = resVid.ok ? await resVid.json() : [];
                const lista = vids.results || vids || [];
                totalChapters += lista.length;
              })
            );
          })
        );

        const fallbackData = {
          total_teacher_course: coursesList.length,
          total_teacher_chapters: totalChapters,
          total_teacher_students: totalStudents,
        };
        setDashboard(fallbackData);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data: fallbackData })
        );
      }
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

  const profilePhoto = perfil.profile_img || null;

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">

        {/* ENCABEZADO */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Mi Perfil
          </h1>
          <p className="text-gray-600 mt-1">
            Información profesional del docente
          </p>
        </div>

        {/* RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Cursos creados</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {dashboard?.total_teacher_course ?? 0}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Clases creadas</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {dashboard?.total_teacher_chapters ?? 0}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Estudiantes inscritos</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {dashboard?.total_teacher_students ?? 0}
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
                    {perfil.fullname?.charAt(0).toUpperCase()}
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
                Datos del Docente
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
                    Teléfono
                  </label>
                  <p className="mt-1 text-gray-800 font-medium">
                    {perfil.mobile_no || "—"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Especialidad
                  </label>
                  <p className="mt-1 text-gray-800 font-medium">
                    {perfil.qualification || "—"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Habilidades
                  </label>
                  <p className="mt-1 text-gray-800 font-medium">
                    {perfil.skills || "—"}
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
                    router.push("/dashboard/docente/editar-perfil")
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Editar Perfil
                </button>
              </div>

              {/* REDES */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Redes sociales
                </label>
                <div className="flex flex-wrap gap-3">
                  {perfil.face_url && /^https?:\/\//i.test(perfil.face_url) && (
                    <a
                      href={perfil.face_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-sm rounded bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.3c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.7.8-1.7 1.6v1.9H16l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/>
                      </svg>
                      Facebook
                    </a>
                  )}
                  {perfil.insta_url && /^https?:\/\//i.test(perfil.insta_url) && (
                    <a
                      href={perfil.insta_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-sm rounded bg-pink-50 text-pink-700 hover:bg-pink-100 flex items-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm6.2-3.2a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1z"/>
                      </svg>
                      Instagram
                    </a>
                  )}
                  {perfil.twit_url && /^https?:\/\//i.test(perfil.twit_url) && (
                    <a
                      href={perfil.twit_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-sm rounded bg-sky-50 text-sky-700 hover:bg-sky-100 flex items-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M18.9 2H22l-7 8 8.4 12H17l-4.9-7-6.2 7H2l7.6-8.6L1.6 2h6.2l4.4 6.4L18.9 2zm-1.1 18h1.7L6.3 4H4.5l13.3 16z"/>
                      </svg>
                      Twitter/X
                    </a>
                  )}
                  {perfil.web_url && /^https?:\/\//i.test(perfil.web_url) && (
                    <a
                      href={perfil.web_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-sm rounded bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm7.9 9h-3.2a15.4 15.4 0 0 0-1.4-5A8 8 0 0 1 19.9 11zM12 4a13.4 13.4 0 0 1 1.8 6H10.2A13.4 13.4 0 0 1 12 4zM4.1 13h3.2a15.4 15.4 0 0 0 1.4 5A8 8 0 0 1 4.1 13zm3.2-2H4.1a8 8 0 0 1 4.6-5 15.4 15.4 0 0 0-1.4 5zm2.9 2h3.6A13.4 13.4 0 0 1 12 20a13.4 13.4 0 0 1-1.8-7zm5.1 5a15.4 15.4 0 0 0 1.4-5h3.2a8 8 0 0 1-4.6 5z"/>
                      </svg>
                      Website
                    </a>
                  )}
                  {perfil.you_url && /^https?:\/\//i.test(perfil.you_url) && (
                    <a
                      href={perfil.you_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-sm rounded bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M23 7.5a4.6 4.6 0 0 0-3.2-3.2C17.9 4 12 4 12 4s-5.9 0-7.8.3A4.6 4.6 0 0 0 1 7.5 47.7 47.7 0 0 0 .7 12 47.7 47.7 0 0 0 1 16.5a4.6 4.6 0 0 0 3.2 3.2C6.1 20 12 20 12 20s5.9 0 7.8-.3a4.6 4.6 0 0 0 3.2-3.2A47.7 47.7 0 0 0 23.3 12 47.7 47.7 0 0 0 23 7.5zM10 15.5v-7l6 3.5z"/>
                      </svg>
                      YouTube
                    </a>
                  )}
                  {!perfil.face_url &&
                    !perfil.insta_url &&
                    !perfil.twit_url &&
                    !perfil.web_url &&
                    !perfil.you_url && (
                      <p className="text-sm text-gray-500">
                        No hay redes sociales registradas.
                      </p>
                    )}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

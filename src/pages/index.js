// src/pages/index.js
import MainLayout from "@/components/layout/MainLayout";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <MainLayout>
      <div
        className={`${geistSans.className} ${geistMono.variable} min-h-screen bg-white dark:bg-zinc-900`}
      >
        {/* Hero Section */}
        <section id="inicio" className="relative overflow-hidden mt-16">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-indigo-600 to-fuchsia-700" />
          <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />
          <div className="relative max-w-6xl mx-auto px-4 py-20">
            <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
              <div className="text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold tracking-wide backdrop-blur">
                  Nuevo 2026 - Educación sensible a emociones
                </span>
                <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                  Plataforma de E-Learning con Análisis Emocional
                </h1>
                <p className="mt-6 text-lg md:text-xl text-white/90 max-w-xl">
                  Revolucionamos la educación con IA adaptativa que entiende,
                  acompaña y potencia el aprendizaje en tiempo real.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a href="/register" className="bg-white text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-100 transition duration-300">
                Comenzar Ahora
              </a>
                </div>
                <div className="mt-6 text-sm text-white/80">
                  Sin tarjeta - Configuración en minutos
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 rounded-[32px] bg-white/20 blur-xl" />
                <div className="relative rounded-[28px] bg-white/15 border border-white/30 p-6 backdrop-blur shadow-2xl">
                  <div className="rounded-2xl bg-gradient-to-br from-white/90 to-white/60 p-5 text-slate-900">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-600">
                        Panel emocional
                      </div>
                      <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        En vivo
                      </div>
                    </div>
                    <div className="mt-5 grid gap-3">
                      <div className="h-12 rounded-xl bg-slate-100/80" />
                      <div className="h-12 rounded-xl bg-slate-100/80" />
                      <div className="h-24 rounded-xl bg-gradient-to-r from-sky-200 to-indigo-200" />
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="text-sm font-semibold">
                        Motivación: 82%
                      </div>
                      <div className="text-xs text-slate-500">
                        Últimos 7 días
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-white">
                    <div className="rounded-xl bg-white/10 p-3">
                      <div className="text-xs uppercase tracking-wide text-white/70">
                        Emoción
                      </div>
                      <div className="mt-2 text-lg font-semibold">Calma</div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                      <div className="text-xs uppercase tracking-wide text-white/70">
                        Enfoque
                      </div>
                      <div className="mt-2 text-lg font-semibold">Alto</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Informacion Section */}
        <section id="informacion" className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              ¿Qué Ofrecemos?
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-800/80 dark:border-zinc-700">
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-200/40 blur-2xl" />
                <div className="relative">
                  <div className="bg-sky-100 dark:bg-sky-900 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl">
                    ??
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                    Aprendizaje Personalizado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Contenidos adaptados al ritmo y estilo de cada estudiante.
                  </p>
                  <div className="mt-4 text-sm font-semibold text-sky-700 dark:text-sky-300">
                    Rutas inteligentes por nivel
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-800/80 dark:border-zinc-700">
                <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl" />
                <div className="relative">
                  <div className="bg-emerald-100 dark:bg-emerald-900 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl">
                    ??
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                    An?lisis Emocional
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Monitoreo inteligente del estado emocional del estudiante.
                  </p>
                  <div className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Alertas y recomendaciones
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-800/80 dark:border-zinc-700">
                <div className="absolute -right-12 -bottom-8 h-24 w-24 rounded-full bg-fuchsia-200/40 blur-2xl" />
                <div className="relative">
                  <div className="bg-fuchsia-100 dark:bg-fuchsia-900 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl">
                    <span className="text-purple-600 dark:text-purple-400 text-xl">
                    👁️
                  </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                    Seguimiento Integral
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Dashboard con m?tricas de progreso y desarrollo emocional.
                  </p>
                  <div className="mt-4 text-sm font-semibold text-fuchsia-700 dark:text-fuchsia-300">
                    Reportes con insights
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre Nosotros */}
        <section id="nosotros" className="py-16 px-4 bg-gray-50 dark:bg-zinc-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              Sobre Nosotros
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="bg-gray-300 dark:bg-zinc-700 h-80 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-gray-500 dark:text-gray-400 text-lg">
                    Imagen del equipo
                  </span>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                  Innovando en Educación con Inteligencia Emocional
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  Somos un equipo multidisciplinario de educadores, psicólogos y
                  tecnólogos comprometidos con transformar la educación.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Creamos soluciones que entienden las necesidades reales de
                  estudiantes y docentes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full">
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      +5 Años de Experiencia
                    </span>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full">
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      +10,000 Estudiantes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section id="mision" className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              Nuestros Propósitos
            </h2>
            <div className="grid md:grid-cols-2 gap-12">

              <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">
                    🎯
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                  Misión
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Democratizar el acceso a una educación adaptativa basada en IA
                  y análisis emocional.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-6">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">
                    👁️
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">
                  Visión
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Convertirnos en la plataforma educativa líder en aprendizaje
                  emocionalmente inteligente.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-16 px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900" />
          <div className="absolute -top-24 left-10 h-56 w-56 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-cyan-400/30 blur-3xl" />
          <div className="relative max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Listo para transformar tu experiencia educativa?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/85">
              Únete a miles de estudiantes y educadores que ya usan nuestra plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="bg-white text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-100 transition duration-300">
                Crear Cuenta Gratis
              </a>
            </div>
            <div className="mt-6 text-sm text-white/70">
              Atención personalizada en menos de 24 horas
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}

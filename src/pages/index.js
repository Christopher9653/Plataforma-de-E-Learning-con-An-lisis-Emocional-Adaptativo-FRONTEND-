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
        <section
          id="inicio"
          className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4 mt-16"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Plataforma de E-Learning con Análisis Emocional
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Revolucionamos la educación mediante tecnología adaptativa que
              comprende y responde a las emociones de los estudiantes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300">
                Comenzar Ahora
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300">
                Ver Demo
              </button>
            </div>
          </div>
        </section>

        {/* Información Section */}
        <section id="informacion" className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              ¿Qué Ofrecemos?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  Aprendizaje Personalizado
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Contenidos adaptados al ritmo y estilo de cada estudiante.
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">😊</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  Análisis Emocional
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitoreo inteligente del estado emocional del estudiante.
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  Seguimiento Integral
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Dashboard con métricas de progreso y desarrollo emocional.
                </p>
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
        <section className="py-16 px-4 bg-blue-600 dark:bg-blue-700">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              ¿Listo para transformar tu experiencia educativa?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a miles de estudiantes y educadores que ya usan nuestra plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300">
                Crear Cuenta Gratis
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300">
                Solicitar Demo
              </button>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}

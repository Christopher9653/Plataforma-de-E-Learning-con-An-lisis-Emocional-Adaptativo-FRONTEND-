// src/pages/index.js
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <section className="p-20 text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          Plataforma E-Learning Adaptativa
        </h1>
        <p className="mt-4 text-gray-700 text-xl">
          Aprende con análisis emocional en tiempo real.
        </p>
      </section>
    </MainLayout>
  );
}

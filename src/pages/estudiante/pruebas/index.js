import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

export default function PruebasAdaptativas() {
  useAuth("estudiante");

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Pruebas Adaptativas
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Selecciona una prueba
          </h3>

          <div className="space-y-4">

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold">Evaluación de Programación</h4>
              <p className="text-sm text-gray-600 mt-1">
                La dificultad se adapta a tus emociones y desempeño.
              </p>
              <Link
                href="/estudiante/pruebas/resultado"
                className="inline-block mt-4 bg-blue-600 px-4 py-2 text-white rounded-lg hover:bg-blue-700"
              >
                Iniciar
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold">Prueba de Matemáticas</h4>
              <p className="text-sm text-gray-600 mt-1">
                Problemas personalizados según tu nivel emocional.
              </p>
              <Link
                href="/estudiante/pruebas/resultado"
                className="inline-block mt-4 bg-blue-600 px-4 py-2 text-white rounded-lg hover:bg-blue-700"
              >
                Iniciar
              </Link>
            </div>

          </div>
        </div>

      </div>
    </MainLayout>
  );
}

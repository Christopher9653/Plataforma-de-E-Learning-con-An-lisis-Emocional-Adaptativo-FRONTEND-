import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import EmotionRadarChart from "@/components/charts/EmotionRadarChart";
import AttentionChart from "@/components/charts/AttentionCharts";

export default function MiProgreso() {
  useAuth("estudiante");

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Progreso</h1>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Nivel Emocional Promedio
            </h3>
            <EmotionRadarChart />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Atención Durante las Clases
            </h3>
            <AttentionChart />
          </div>
        </div>

        {/* Progreso académico */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Progreso Académico
          </h3>

          <div className="space-y-4">

            <div>
              <p className="font-medium">Programación Básica</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>

            <div>
              <p className="font-medium">Matemáticas</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div className="bg-green-600 h-3 rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
}

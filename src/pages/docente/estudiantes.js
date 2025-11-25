import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import EmotionRadarChart from "@/components/charts/EmotionRadarChart";
import AttentionChart from "@/components/charts/AttentionCharts";

export default function Estudiantes() {
  const { user } = useAuth("docente");

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Seguimiento Emocional de Estudiantes
        </h2>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Emociones</h3>
            <EmotionRadarChart />
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Atención</h3>
            <AttentionChart />
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

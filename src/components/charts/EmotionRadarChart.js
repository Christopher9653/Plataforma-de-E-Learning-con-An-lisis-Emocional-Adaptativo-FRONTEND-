import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function EmotionRadarChart({ data }) {
  // Datos por defecto si no se recibe información
  const defaultData = {
    labels: ["Alegría", "Tristeza", "Ira", "Miedo", "Sorpresa", "Neutral"],
    datasets: [
      {
        label: "Estado emocional",
        data: data || [20, 10, 40, 15, 30, 60],
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Radar de Emociones
      </h3>
      <Radar data={defaultData} />
    </div>
  );
}

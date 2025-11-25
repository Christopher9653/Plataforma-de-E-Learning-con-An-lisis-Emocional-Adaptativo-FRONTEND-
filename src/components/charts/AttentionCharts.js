import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function AttentionChart({ values }) {
  const defaultValues =
    values || [70, 60, 75, 80, 65, 85, 90, 70, 65, 60, 75, 88];

  const data = {
    labels: [
      "00:00",
      "00:10",
      "00:20",
      "00:30",
      "00:40",
      "00:50",
      "01:00",
      "01:10",
      "01:20",
      "01:30",
      "01:40",
      "01:50",
    ],
    datasets: [
      {
        label: "Nivel de Atención (%)",
        data: defaultValues,
        fill: false,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgb(34, 197, 94)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Nivel de Atención
      </h3>
      <Line data={data} options={options} />
    </div>
  );
}

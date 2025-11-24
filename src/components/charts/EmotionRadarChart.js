// src/components/charts/EmotionRadarChart.js
import { Radar } from "react-chartjs-2";

export default function EmotionRadarChart({ data }) {
  const chartData = {
    labels: ["Felicidad", "Tristeza", "Miedo", "Enojo", "Atención"],
    datasets: [
      {
        label: "Estado emocional",
        data,
        borderColor: "blue",
        backgroundColor: "rgba(30,144,255,0.2)",
      },
    ],
  };

  return <Radar data={chartData} />;
}

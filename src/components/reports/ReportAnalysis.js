import EmotionRadarChart from "@/components/charts/EmotionRadarChart";
import AttentionChart from "@/components/charts/AttentionCharts";

export default function ReportAnalysis({ data }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-8 border border-gray-200">

      {/* TÍTULO DEL REPORTE */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {data.titulo}
      </h2>

      <p className="text-gray-600 mb-6">
        Fecha del análisis:{" "}
        <span className="font-medium">{data.fecha}</span>
      </p>

      {/* SECCIÓN DE GRÁFICOS */}
      <div className="grid grid-cols-2 gap-8 mb-10">

        {/* RADAR EMOCIONAL */}
        <div className="bg-gray-50 p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Distribución Emocional
          </h3>
          <EmotionRadarChart emociones={data.emociones} />
        </div>

        {/* ATENCIÓN */}
        <div className="bg-gray-50 p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Nivel de Atención
          </h3>
          <AttentionChart atencion={data.atencion} />
        </div>

      </div>

      {/* ANÁLISIS DETALLADO */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Análisis del Estado Emocional
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {data.analisis}
        </p>
      </div>

      {/* RECOMENDACIONES */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-600 mb-2">
          Recomendaciones para el docente
        </h3>
        <ul className="list-disc ml-6 text-blue-700">
          {data.recomendaciones.map((item, i) => (
            <li key={i} className="mb-1">{item}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}

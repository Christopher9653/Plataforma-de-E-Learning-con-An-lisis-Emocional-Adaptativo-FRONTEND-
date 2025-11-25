export default function ReportCard({ reporte }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {reporte.titulo}
      </h3>

      <p className="text-gray-600 mb-4">
        Fecha: <span className="font-medium">{reporte.fecha}</span>
      </p>

      <a
        href="#"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
      >
        Ver Reporte
      </a>
    </div>
  );
}

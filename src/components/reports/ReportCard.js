export default function ReportCard({ reporte }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {reporte.titulo}
      </h3>

      <p className="text-gray-600 mb-4">
        Fecha: <span className="font-medium">{reporte.fecha}</span>
      </p>

      <div className="space-x-6 py-4 whitespace-nowrap text-sm">
                <a
          href="#"
          className="px-4 py-2 bg-blue-500 text-white border-blue-600 rounded-lg font-medium"
        >
          Ver reporte
        </a>
        <a
          href="#"
          className="px-3 py-2 bg-red-400 text-white border-red-600 rounded-lg font-medium"
        >
          Descargar PDF
        </a>
      </div>
    </div>
  );
}

import MainLayout from "@/components/layout/MainLayout";
import ReportCard from "@/components/reports/ReportCard";
import useAuth from "@/hooks/useAuth";

export default function ReportesAdmin() {
  useAuth("admin");

  const reportes = [
    { titulo: "Reporte Emocional - Programación I", fecha: "2025-01-10" },
    { titulo: "Progreso Estudiantil - Matemáticas", fecha: "2025-01-11" },
  ];

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Reportes</h2>

        <div className="grid grid-cols-2 gap-6">
          {reportes.map((r, i) => (
            <ReportCard key={i} reporte={r} />
          ))}
        </div>

      </div>
    </MainLayout>
  );
}

import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";

export default function EstadisticasAdmin() {
  useAuth("admin");

  return (
    <MainLayout>
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4">Estadísticas Avanzadas</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Aquí irán gráficos del progreso general, emociones y actividad.</p>
        </div>
      </div>
    </MainLayout>
  );
}

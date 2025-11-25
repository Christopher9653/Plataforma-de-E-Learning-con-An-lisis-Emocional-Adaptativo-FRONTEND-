import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";

export default function ResultadoPrueba() {
  useAuth("estudiante");

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Resultado de la Prueba
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md">

          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Tu desempeño
          </h3>

          <p className="text-gray-600 mb-4">
            Puntaje obtenido: <span className="font-bold">85/100</span>
          </p>

          <p className="text-gray-600 mb-4">
            Estado emocional promedio:  
            <span className="font-bold text-blue-700"> Neutro / Concentrado</span>
          </p>

          <h4 className="text-lg font-semibold mt-6 text-gray-800">
            Recomendaciones personalizadas
          </h4>

          <ul className="list-disc ml-6 text-gray-600 mt-2">
            <li>Repasa los temas de condicionales.</li>
            <li>Practica ejercicios más avanzados.</li>
            <li>Buen nivel de atención, sigue así.</li>
          </ul>

        </div>
      </div>
    </MainLayout>
  );
}

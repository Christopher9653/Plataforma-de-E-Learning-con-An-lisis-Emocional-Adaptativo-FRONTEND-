import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import ClassCard from "@/components/clases/ClassCard";

export default function EstudianteClases() {
  useAuth("estudiante");

  const clases = [
    {
      id: 1,
      titulo: "Introducción a la Programación",
      profesor: "Ing. Juan Pérez",
      descripcion: "Aprende los fundamentos de la programación paso a paso.",
      imagen: "/programacion.jpg",
    },
    {
      id: 2,
      titulo: "Biología General",
      profesor: "Dra. Ana Torres",
      descripcion: "Comprende la vida desde la célula hasta los ecosistemas.",
      imagen: "/biologia.jpg",
    },
  ];

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Clases Disponibles
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clases.map((clase) => (
            <ClassCard key={clase.id} clase={clase} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

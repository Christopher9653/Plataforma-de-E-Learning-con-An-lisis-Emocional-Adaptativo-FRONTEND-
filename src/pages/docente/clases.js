import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import ClassCard from "@/components/clases/ClassCard";

export default function DocenteClases() {
  const { user } = useAuth("docente");

  const clases = [
    { nombre: "Programación I", codigo: "PROG101", estudiantes: 15 },
    { nombre: "Matemáticas Básicas", codigo: "MAT201", estudiantes: 10 },
    { nombre: "Pensamiento Lógico", codigo: "LOGIC301", estudiantes: 8 },
  ];

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Mis Clases</h2>

        <div className="grid grid-cols-3 gap-6">
          {clases.map((clase, i) => (
            <ClassCard key={i} clase={clase} />
          ))}
        </div>

      </div>
    </MainLayout>
  );
}

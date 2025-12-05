import ClassCard from "@/components/clases/ClassCard";
import MainLayout from "@/components/layout/MainLayout";
import { useRouter } from "next/router";

export default function ClasesEstudiante() {
  const router = useRouter();

  const cursos = [
    {
      id: "prog101",
      titulo: "Introducción a la Programación",
      profesor: "Juan Pérez",
      imagen: "/img/curso1.jpg"
    },
    {
      id: "bio202",
      titulo: "Biología General",
      profesor: "Laura Ruiz",
      imagen: "/img/curso2.jpg"
    },
  ];

  return (
    <MainLayout>
    <div className="p-8 grid md:grid-cols-3 gap-6">
      {cursos.map((curso) => (
        <ClassCard
          key={curso.id}
          clase={curso}
          onClick={() => router.push(`/estudiante/clase/${curso.id}`)}
        />
      ))}
    </div>
    </MainLayout>
  );
}

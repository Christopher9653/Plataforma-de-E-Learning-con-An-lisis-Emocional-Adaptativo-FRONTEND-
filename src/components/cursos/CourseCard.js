import { useRouter } from "next/router";

export default function CourseCard({ curso }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition">
      <img
        src={curso.imagen || "/img/curso-default.jpg"}
        className="h-40 w-full object-cover rounded-t-xl"
      />

      <div className="p-5">
        <h3 className="font-bold text-lg">{curso.titulo}</h3>
        <p className="text-sm text-gray-600">{curso.profesor}</p>

        <button
          onClick={() =>
            router.push(`/estudiante/clase/${curso.id}`)
          }
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Ver curso
        </button>
      </div>
    </div>
  );
}

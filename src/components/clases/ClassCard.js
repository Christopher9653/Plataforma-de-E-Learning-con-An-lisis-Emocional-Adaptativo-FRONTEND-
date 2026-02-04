import Link from "next/link";

export default function ClassCard({ clase }) {
  if (!clase) return null;

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow hover:shadow-lg transition overflow-hidden">

      {/* Imagen */}
      <div className="h-40 bg-gray-200 dark:bg-zinc-700">
        <img
          src={clase.imagen}
          alt={clase.titulo}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
          {clase.titulo}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
          {clase.descripcion}
        </p>

        {/* Estadísticas */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          <span>👥 {clase.estudiantes} estudiantes</span>
        </div>

        {/* Acciones */}
        <div className="mt-5 flex gap-2">
          <Link
            href={`/dashboard/docente/clases/${clase.id}`}
            className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Ver curso
          </Link>

          {/* FUTURO */}
          {/* 
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Editar
          </button>
          */}
        </div>
      </div>
    </div>
  );
}

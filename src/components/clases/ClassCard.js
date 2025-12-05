// src/components/classes/ClassCard.js

export default function ClassCard({ clase = {},onClick  }) {
  const {
    titulo = "Sin título",
    descripcion = "Sin descripción",
    estudiantes = 0,
    imagen = "https://via.placeholder.com/600x400?text=Curso",
  } = clase;
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
    >
      <img
        src={clase.imagen || "/img/placeholder.jpg"}
        className="h-40 w-full object-cover"
        alt="Vista del curso"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{clase.titulo}</h3>
        <p className="text-gray-600 text-sm mt-1">{clase.profesor}</p>
    
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">
          {descripcion}
        </p>

        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Ver clase
        </button>
      </div>
    </div>
  );
}

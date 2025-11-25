// src/components/classes/ClassCard.js
// src/components/classes/ClassCard.js
export default function ClassCard({ title, description, teacher, students }) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>

      {teacher && (
        <p className="text-sm text-gray-600 mt-1">
          Profesor: <span className="font-medium">{teacher}</span>
        </p>
      )}

      {description && (
        <p className="text-gray-700 mt-3 text-sm">{description}</p>
      )}

      {students !== undefined && (
        <p className="text-gray-600 mt-3 text-sm">
          Estudiantes inscritos:{" "}
          <span className="font-semibold">{students}</span>
        </p>
      )}

      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Ver Clase
      </button>
    </div>
  );
}

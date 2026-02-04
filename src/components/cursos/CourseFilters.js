export default function CourseFilters() {
  return (
    <div className="mb-6 flex gap-4">
      <select className="border px-3 py-2 rounded">
        <option>Todos los niveles</option>
        <option>Básico</option>
        <option>Intermedio</option>
        <option>Avanzado</option>
      </select>

      <select className="border px-3 py-2 rounded">
        <option>Todas las categorías</option>
        <option>Programación</option>
        <option>Matemáticas</option>
      </select>
    </div>
  );
}

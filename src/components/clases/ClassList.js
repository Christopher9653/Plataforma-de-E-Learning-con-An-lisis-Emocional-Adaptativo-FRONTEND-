import ClassCard from "./ClassCard";

export default function ClassList({ classes }) {
  if (!classes || classes.length === 0) {
    return (
      <p className="text-gray-500">
        Aún no tienes clases creadas.
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((clase) => (
        <ClassCard
          key={clase.id}
          clase={{
            id: clase.id,
            title: clase.title,
            description: clase.description,
            students: clase.students_count || 0,
          }}
        />
      ))}
    </div>
  );
}

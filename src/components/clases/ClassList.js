import ClassCard from "./ClassCard";

export default function ClassList({ classes, onSelect }) {
  if (!classes || classes.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6">
        No existen clases registradas.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((cls) => (
        <ClassCard
          key={cls.id}
          title={cls.title}
          description={cls.description}
          teacher={cls.teacher}
          students={cls.students}
          onClick={() => onSelect && onSelect(cls)}
        />
      ))}
    </div>
  );
}

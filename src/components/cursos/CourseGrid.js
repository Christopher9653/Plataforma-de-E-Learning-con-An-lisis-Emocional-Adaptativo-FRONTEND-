import CourseCard from "./CourseCard";

export default function CourseGrid({ cursos }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cursos.map((curso) => (
        <CourseCard key={curso.id} curso={curso} />
      ))}
    </div>
  );
}

import { API_BASE } from "@/utils/constants";

export async function marcarClaseCompletada({
  studentId,
  courseId,
  classId,
  token,
}) {
  const res = await fetch(`${API_BASE}/student-progress/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      student: studentId,
      course: courseId,
      clase: classId,
      completed: true,
    }),
  });

  if (!res.ok) throw new Error("Error al guardar progreso");
  return await res.json();
}

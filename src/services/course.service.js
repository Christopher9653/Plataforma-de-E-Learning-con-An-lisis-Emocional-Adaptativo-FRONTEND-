import { API_BASE } from "@/utils/constants";

/* ===============================
   DOCENTE
=============================== */

/**
 * Obtener cursos creados por un docente
 */
export async function getTeacherCourses(teacherId, token) {
  const res = await fetch(
    `${API_BASE}/course/?teacher=${teacherId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener cursos del docente");
  }

  const data = await res.json();
  return data.results || data;
}

/* ===============================
   ESTUDIANTE
=============================== */

/**
 * Obtener cursos inscritos por un estudiante
 */
export async function getStudentCourses(studentId, token) {
  const res = await fetch(
    `${API_BASE}/student-courses/?student=${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener cursos del estudiante");
  }

  const data = await res.json();
  return data.results || data;
}

/* ===============================
   COMÚN
=============================== */

/**
 * Obtener curso por ID (docente o estudiante)
 */
export async function getCourseById(courseId, token) {
  const res = await fetch(
    `${API_BASE}/course/${courseId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Curso no encontrado");
  }

  return await res.json();
}

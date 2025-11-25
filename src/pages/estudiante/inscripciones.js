import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import Link from "next/link";

export default function Inscripciones() {
  useAuth("estudiante");

  // Cursos inscritos (simulación)
  const [misCursos, setMisCursos] = useState([]);

  // Lista de cursos disponibles (simulación global)
  const cursosDisponibles = [
    {
      id: 101,
      code: "ABC123",
      title: "Programación Básica",
      description: "Curso introductorio a la programación con ejemplos prácticos.",
      teacher: "Ing. Marta Rivas",
      classes: 12
    },
    {
      id: 102,
      code: "XYZ789",
      title: "Matemáticas Discretas",
      description: "Relaciones, conjuntos, lógica y fundamentos matemáticos.",
      teacher: "Msc. Carlos Medina",
      classes: 8
    },
  ];

  // Estados para búsqueda
  const [codigo, setCodigo] = useState("");
  const [cursoEncontrado, setCursoEncontrado] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Buscar curso por código
  const handleBuscar = () => {
    const found = cursosDisponibles.find((c) => c.code === codigo.trim());
    if (!found) {
      setErrorMsg("❌ No existe un curso con este código.");
      setCursoEncontrado(null);
      return;
    }
    setErrorMsg("");
    setCursoEncontrado(found);
  };

  // Inscribir curso
  const handleInscribir = () => {
    if (!cursoEncontrado) return;
    const yaInscrito = misCursos.some((c) => c.id === cursoEncontrado.id);

    if (!yaInscrito) {
      setMisCursos([...misCursos, cursoEncontrado]);
    }
    setCursoEncontrado(null);
    setCodigo("");
  };

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Mis Inscripciones
        </h1>

        {/* BUSCAR CURSO POR CÓDIGO */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Unirme con un Código</h2>

          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Ej: ABC123"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />

            <button
              onClick={handleBuscar}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>

          {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}

          {/* Vista previa del curso encontrado */}
          {cursoEncontrado && (
            <div className="mt-6 p-5 border border-gray-300 rounded-lg bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">{cursoEncontrado.title}</h3>
              <p className="text-gray-700 mt-2">{cursoEncontrado.description}</p>
              <p className="mt-2">
                <strong>Profesor:</strong> {cursoEncontrado.teacher}
              </p>
              <p>
                <strong>Clases:</strong> {cursoEncontrado.classes}
              </p>

              <button
                onClick={handleInscribir}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Inscribirme
              </button>
            </div>
          )}
        </div>

        {/* SI NO ESTÁ INSCRITO */}
        {misCursos.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-600 text-lg">
              No estás inscrito en ningún curso actualmente.
            </p>
            <p className="text-gray-700 font-semibold mt-2">
              ¡Únete usando un código o explora cursos disponibles!
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cursos Inscritos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {misCursos.map((course) => (
                <div
                  key={course.id}
                  className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>

                  <p className="text-gray-600 mt-2">{course.description}</p>

                  <p className="mt-3 text-sm text-gray-700">
                    <strong>Profesor:</strong> {course.teacher}
                  </p>

                  <div className="mt-5">
                    <Link
                      href={`/estudiante/clases?id=${course.id}`}
                      className="w-full inline-block px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Ver Curso
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}

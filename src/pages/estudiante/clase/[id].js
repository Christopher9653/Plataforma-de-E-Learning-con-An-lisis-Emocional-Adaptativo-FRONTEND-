import { useRouter } from "next/router";
import { useState } from "react";
import ClassVideoPlayer from "@/components/clases/ClassVideoPlayer";

export default function VistaCursoEstudiante() {
  const router = useRouter();
  const { id } = router.query;

const curso = {
  id,
  titulo: "Introducción a la Programación",
  descripcion: "Aprende los fundamentos de programación moderna.",
  profesor: "Juan Pérez",
  imagen: "/img/curso1.jpg",
  modulos: [
    {
      nombre: "Introducción",
      clases: [
        { titulo: "Bienvenida", videoUrl: "/videos/prueba.mp4" },
        { titulo: "Conceptos básicos", videoUrl: "/videos/prueba.mp4" },
      ],
    },
    {
      nombre: "Primeros pasos",
      clases: [
        { titulo: "Variables", videoUrl: "/videos/prueba.mp4" },
        { titulo: "Condicionales", videoUrl: "/videos/prueba.mp4" },
      ],
    },
  ],
};


  const [claseSeleccionada, setClaseSeleccionada] = useState({
    titulo: curso.modulos[0].clases[0].titulo,
    videoUrl: curso.modulos[0].clases[0].videoUrl,
  });

  return (
    <div className="w-full min-h-screen bg-gray-100">

      {/* REPRODUCTOR */}
      <ClassVideoPlayer
        curso={curso}
        onPlayClass={(titulo, videoUrl) =>
          setClaseSeleccionada({ titulo, videoUrl })
        }
      />

      {/* CONTENIDO DEL CURSO 
      <div className="max-w-6xl mx-auto px-6 py-10">

        <h2 className="text-3xl font-bold text-gray-800">{curso.nombre}</h2>
        <p className="text-gray-600">{curso.descripcion}</p>
        <p className="text-gray-700 font-medium mt-2">
          Profesor: <span className="text-blue-600">{curso.profesor}</span>
        </p>

        {/* MÓDULOS 
        <div className="mt-10">

          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Contenido del Curso
          </h3>

          {curso.modulos.map((mod, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-6 mb-6 bg-white shadow-md"
            >
              <h4 className="text-xl font-semibold text-gray-700 mb-4">
                {mod.nombre}
              </h4>

              <ul className="space-y-3">
                {mod.clases.map((cl, j) => (
                  <li
                    key={j}
                    className="flex justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      setClaseSeleccionada({
                        titulo: cl.titulo,
                        videoUrl: cl.videoUrl,
                      })
                    }
                  >
                    <span className="font-medium text-gray-700">
                      {j + 1}. {cl.titulo}
                    </span>
                    <span className="text-blue-600 font-medium">
                      Ver clase →
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>*/}
    </div>
  );
}

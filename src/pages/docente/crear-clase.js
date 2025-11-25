import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";

export default function CrearClase() {
  const { user } = useAuth("docente");

  const [curso, setCurso] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    nivel: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Curso:", curso);
    console.log("Módulos:", modulos);
    alert("Curso creado (simulación)");
  };

  const [videoPresentacion, setVideoPresentacion] = useState(null);
  const [preview, setPreview] = useState(null);

  // Módulos y clases
  const [modulos, setModulos] = useState([
    {
      nombre: "",
      clases: [{ titulo: "", video: null }],
    },
  ]);

  const handleCursoChange = (e) => {
    setCurso({ ...curso, [e.target.name]: e.target.value });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoPresentacion(file);
    setPreview(URL.createObjectURL(file));
  };

  const addModulo = () => {
    setModulos([
      ...modulos,
      { nombre: "", clases: [{ titulo: "", video: null }] },
    ]);
  };

  const addClase = (modIndex) => {
    const nuevos = [...modulos];
    nuevos[modIndex].clases.push({ titulo: "", video: null });
    setModulos(nuevos);
  };

  const handleModuloChange = (v, i) => {
    const nuevos = [...modulos];
    nuevos[i].nombre = v;
    setModulos(nuevos);
  };

  const handleClaseChange = (v, i, j) => {
    const nuevos = [...modulos];
    nuevos[i].clases[j].titulo = v;
    setModulos(nuevos);
  };

  const handleClaseVideo = (file, i, j) => {
    const nuevos = [...modulos];
    nuevos[i].clases[j].video = file;
    setModulos(nuevos);
  };

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">EduAdapt</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mt-2">
            Crear Nuevo Curso
          </h2>
          <p className="text-gray-600 mt-1">
            Completa la información para registrar un curso.
          </p>
        </div>

        {/* Contenedor principal */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {/* Título */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Título del curso
              </label>
              <input
                type="text"
                name="titulo"
                value={curso.titulo}
                onChange={handleCursoChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Ej: Fundamentos de Programación"
                required
              />
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={curso.descripcion}
                onChange={handleCursoChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="Describe brevemente el contenido del curso..."
              />
            </div>

            {/* Categoría + Nivel */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Categoría
                </label>
                <select
                  name="categoria"
                  value={curso.categoria}
                  onChange={handleCursoChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Seleccionar...</option>
                  <option value="programacion">Programación</option>
                  <option value="diseño">Diseño</option>
                  <option value="matematicas">Matemáticas</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nivel
                </label>
                <select
                  name="nivel"
                  value={curso.nivel}
                  onChange={handleCursoChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Seleccionar...</option>
                  <option value="basico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            {/* Video de presentación */}

            <div className="mb-10">
              <label className="block text-gray-700 font-medium mb-2">
                Video de presentación
              </label>

              {/* Área Drag & Drop */}
              {!preview ? (
                <div
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.includes("video")) {
                      setVideoPresentacion(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 
        rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition text-center p-4"
                >
                  <label className="cursor-pointer flex flex-col items-center">
                    <svg
                      className="w-14 h-14 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16V4m0 0l-3 3m3-3l3 3m7 8v12m0 0l-3-3m3 3l3-3"
                      />
                    </svg>

                    <p className="text-gray-700 font-medium">
                      Arrastra un video aquí o haz clic para subirlo
                    </p>

                    <span className="text-gray-500 text-sm">
                      Formatos aceptados: MP4, WebM, MOV
                    </span>

                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setVideoPresentacion(file);
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                /* Vista previa del video */
                <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                  <h3 className="text-gray-800 font-semibold mb-4">
                    Vista previa del video
                  </h3>

                  <video
                    src={preview}
                    controls
                    className="w-full rounded-lg shadow-md mb-4 border border-gray-300"
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setVideoPresentacion(null);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Eliminar video
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Módulos */}
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Módulos del Curso
            </h3>

            {modulos.map((mod, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50"
              >
                <label className="block text-gray-700 font-medium mb-2">
                  Nombre del módulo
                </label>
                <input
                  type="text"
                  value={mod.nombre}
                  onChange={(e) => handleModuloChange(e.target.value, i)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                  placeholder="Ej: Introducción"
                />

                {mod.clases.map((clase, j) => (
                  <div key={j} className="bg-white border rounded-lg p-4 mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Clase {j + 1}
                    </label>

                    <input
                      type="text"
                      value={clase.titulo}
                      onChange={(e) => handleClaseChange(e.target.value, i, j)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
                      placeholder="Título de la clase"
                    />

                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        handleClaseVideo(e.target.files[0], i, j)
                      }
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addClase(i)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Agregar clase
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addModulo}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mb-8"
            >
              + Agregar módulo
            </button>

            {/* Botón enviar */}
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              Crear Curso
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

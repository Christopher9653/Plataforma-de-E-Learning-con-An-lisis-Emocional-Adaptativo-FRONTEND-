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

  const handleClaseVideo = (file, moduloIndex, claseIndex) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[moduloIndex].clases[claseIndex].video = file;
    setModulos(nuevosModulos);
  };

  const addClase = (modIndex) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[modIndex].clases.push({
      titulo: "",
      video: null,
    });
    setModulos(nuevosModulos);
  };

  const addModulo = () => {
    setModulos([
      ...modulos,
      {
        nombre: "",
        clases: [],
      },
    ]);
  };

  const handleModuloChange = (value, index) => {
    const nuevos = [...modulos];
    nuevos[index].nombre = value;
    setModulos(nuevos);
  };

  const handleClaseChange = (value, moduloIndex, claseIndex) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[moduloIndex].clases[claseIndex].titulo = value;
    setModulos(nuevosModulos);
  };

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Crear Nuevo Curso
          </h1>
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
              {/* Categoría */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Categoría
                </label>

                <select
                  name="categoria"
                  value={curso.categoria}
                  onChange={handleCursoChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="programacion">Programación</option>
                  <option value="diseño">Diseño</option>
                  <option value="matematicas">Matemáticas</option>
                  <option value="ciencia">Ciencia</option>
                  <option value="otra">➕ Otra categoría...</option>
                </select>

                {/* Si el usuario elige "otra" aparece este input */}
                {curso.categoria === "otra" && (
                  <div className="mt-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Nueva categoría
                    </label>

                    <input
                      type="text"
                      name="nuevaCategoria"
                      value={curso.nuevaCategoria || ""}
                      onChange={(e) =>
                        setCurso({
                          ...curso,
                          nuevaCategoria: e.target.value,
                          categoriaFinal: e.target.value
                            .trim()
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase()), // capitalizar
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Marketing Digital"
                    />

                    <p className="text-sm text-gray-500 mt-2">
                      Esta categoría se guardará como:{" "}
                      <span className="font-semibold text-blue-600">
                        {curso.categoriaFinal || "—"}
                      </span>
                    </p>
                  </div>
                )}
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
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Módulos del Curso
            </h3>

            {modulos.map((mod, i) => (
              <div
                key={i}
                className="border border-gray-300 rounded-xl p-6 mb-8 bg-white shadow-sm"
              >
                {/* Nombre del módulo */}
                <label className="block text-gray-700 font-semibold mb-2">
                  Nombre del módulo
                </label>
                <input
                  type="text"
                  value={mod.nombre}
                  onChange={(e) => handleModuloChange(e.target.value, i)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ejemplo: Introducción al curso"
                />

                {/* Clases del módulo */}
                {mod.clases.map((clase, j) => (
                  <div
                    key={j}
                    className="mb-6 bg-gray-50 border border-gray-200 p-5 rounded-xl"
                  >
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Clase {j + 1}
                    </h4>

                    {/* Título de clase */}
                    <input
                      type="text"
                      value={clase.titulo}
                      onChange={(e) => handleClaseChange(e.target.value, i, j)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
                      placeholder="Título de la clase"
                    />

                    {/* Zona Drag & Drop */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        handleClaseVideo(file, i, j);
                      }}
                      className="border-2 border-dashed border-blue-400 rounded-lg p-6 text-center hover:bg-blue-50 transition cursor-pointer"
                      onClick={() =>
                        document
                          .getElementById(`video-upload-${i}-${j}`)
                          .click()
                      }
                    >
                      {clase.video ? (
                        <div>
                          <p className="text-green-600 font-medium mb-2">
                            🎥 Video seleccionado:
                          </p>
                          <p className="text-sm text-gray-700">
                            {clase.video.name}
                          </p>
                        </div>
                      ) : (
                        <div className="text-gray-600">
                          <p className="font-semibold">
                            Arrastra el video aquí
                          </p>
                          <p className="text-sm">o haz clic para buscar</p>
                        </div>
                      )}
                    </div>

                    {/* Input oculto */}
                    <input
                      id={`video-upload-${i}-${j}`}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) =>
                        handleClaseVideo(e.target.files[0], i, j)
                      }
                    />
                  </div>
                ))}

                {/* Botón agregar clase */}
                <button
                  type="button"
                  onClick={() => addClase(i)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  + Agregar clase
                </button>
              </div>
            ))}

            {/* Botón agregar módulo */}
            <button
              type="button"
              onClick={addModulo}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
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

import { useState } from "react";
import TestSummary from "./TestSummary";

export default function TestScreen({ prueba }) {
  if (!prueba) {
    return <p className="p-6 text-center">Cargando prueba...</p>;
  }

  if (!Array.isArray(prueba.preguntas) || prueba.preguntas.length === 0) {
    return (
      <p className="p-6 text-center text-red-500">
        Error: No hay preguntas válidas en el archivo JSON.
      </p>
    );
  }

  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [finalizado, setFinalizado] = useState(false);

  const actual = prueba.preguntas[indice];

  // Normalizar "A) texto"
  const normalizarOpciones = (op) => {
    if (typeof op === "string") {
      const letra = op.substring(0, 1);
      const texto = op.substring(op.indexOf(")") + 1).trim();
      return { id: letra, texto };
    }
    return op;
  };

  const opciones = actual.opciones.map(normalizarOpciones);

  const manejarRespuesta = (idOpcion) => {
    setRespuestas({ ...respuestas, [actual.id]: idOpcion });
  };

  const siguiente = () => {
    if (indice + 1 < prueba.preguntas.length) {
      setIndice(indice + 1);
    } else {
      setFinalizado(true);
    }
  };

  // ========= Si la prueba terminó → mostrar TestSummary =========
  if (finalizado) {
    return <TestSummary prueba={prueba} respuestas={respuestas} />;
  }
  

  // ========= Pantalla de preguntas =========
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-2">{prueba.titulo}</h1>

      <p className="text-gray-600 mb-6">{prueba.instrucciones}</p>

      <h2 className="text-xl font-semibold mb-4">
        {actual.id}. {actual.pregunta}
      </h2>

      <div className="space-y-3">
        {opciones.map((op) => (
          <button
            key={op.id}
            className={`w-full text-left p-4 border rounded-lg ${
              respuestas[actual.id] === op.id
                ? "bg-blue-100 border-blue-500"
                : "hover:bg-gray-100"
            }`}
            onClick={() => manejarRespuesta(op.id)}
          >
            <b>{op.id})</b> {op.texto}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Pregunta {indice + 1} de {prueba.preguntas.length}
        </p>

        <button
          onClick={siguiente}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {indice + 1 === prueba.preguntas.length ? "Finalizar" : "Siguiente →"}
        </button>
      </div>
    </div>
  );
}

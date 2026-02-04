import { useState } from "react";
import QuestionTrueFalse from "./QuestionTrueFalse";
import QuestionSingleSelect from "./QuestionSingleSelect";
import QuestionMultiSelect from "./QuestionMultiSelect";
import TestSummary from "./TestSummary";

export default function TestRenderer({ prueba }) {
  const [respuestas, setRespuestas] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const handleAnswer = (idPregunta, respuesta) => {
    setRespuestas((prev) => ({
      ...prev,
      [idPregunta]: respuesta,
    }));
  };

  const handleSubmit = () => {
    setShowSummary(true);
  };

  if (showSummary) {
    return (
      <TestSummary
        prueba={prueba}
        respuestas={respuestas}
        onBack={() => setShowSummary(false)}
      />
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{prueba.titulo}</h1>
      <p className="mt-1 text-gray-600 mb-6">{prueba.descripcion}</p>

      {prueba.preguntas.map((p) => (
        <div
          key={p.id}
          className="mb-8 p-5 border rounded-lg shadow-sm bg-white"
        >
          {p.tipo === "verdadero_falso" && (
            <QuestionTrueFalse pregunta={p} onAnswer={handleAnswer} />
          )}

          {p.tipo === "seleccion_unica" && (
            <QuestionSingleSelect pregunta={p} onAnswer={handleAnswer} />
          )}

          {p.tipo === "seleccion_multiple" && (
            <QuestionMultiSelect pregunta={p} onAnswer={handleAnswer} />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
      >
        Finalizar prueba
      </button>
    </div>
  );
}

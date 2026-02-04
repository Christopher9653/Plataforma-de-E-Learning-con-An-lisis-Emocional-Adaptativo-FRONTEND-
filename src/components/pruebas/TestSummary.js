export default function TestSummary({ prueba, respuestas }) {

  const preguntas = prueba.preguntas;
  
  const puntaje = preguntas.filter(
    (p) => respuestas[p.id] === p.respuesta_correcta
  ).length;

  const porcentaje = Math.round((puntaje / preguntas.length) * 100);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Resultados</h1>

      <p className="text-center text-gray-600 mb-4">
        Obtuviste <b>{puntaje}</b> de <b>{preguntas.length}</b> preguntas correctas.
      </p>

      <p
        className={`text-center text-xl font-semibold mb-6 ${
          porcentaje >= 70 ? "text-green-600" : "text-red-600"
        }`}
      >
        {porcentaje >= 70
          ? "¡Buen trabajo! Comprendiste los conceptos."
          : "Revisa nuevamente algunos conceptos para mejorar tu comprensión."}
      </p>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Retroalimentación por pregunta</h2>

        <ul className="space-y-4">
          {preguntas.map((p) => {
            const correcta = respuestas[p.id] === p.respuesta_correcta;

            return (
              <li key={p.id} className="p-4 bg-gray-100 rounded border flex flex-col">
                <p className="font-semibold">
                  {p.id}. {p.pregunta}
                </p>

                <p className="mt-1">
                  Tu respuesta:{" "}
                  <b className={correcta ? "text-green-600" : "text-red-600"}>
                    {respuestas[p.id] || "Sin responder"}
                  </b>
                </p>

                {!correcta && (
                  <p className="text-blue-600 text-sm mt-1">
                    Respuesta correcta: {p.respuesta_correcta}
                  </p>
                )}

                <p className="text-sm text-gray-700 mt-2">{p.explicacion}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

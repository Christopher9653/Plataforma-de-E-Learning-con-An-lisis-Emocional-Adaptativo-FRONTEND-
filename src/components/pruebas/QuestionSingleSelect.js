export default function QuestionSingleSelect({ pregunta, onAnswer }) {
  return (
    <div>
      <p className="text-lg font-semibold">{pregunta.pregunta}</p>

      <div className="mt-3 flex flex-col">
        {pregunta.opciones.map((op, i) => (
          <label key={i} className="cursor-pointer py-1">
            <input
              type="radio"
              name={`p${pregunta.id}`}
              value={op}
              onChange={() => onAnswer(pregunta.id, op)}
            />
            <span className="ml-2">{op}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

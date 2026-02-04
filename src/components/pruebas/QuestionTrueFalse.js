export default function QuestionTrueFalse({ pregunta, onAnswer }) {
  return (
    <div>
      <p className="text-lg font-semibold">{pregunta.pregunta}</p>

      <div className="mt-3 flex gap-6">
        <label className="cursor-pointer">
          <input
            type="radio"
            name={`p${pregunta.id}`}
            value="true"
            onChange={() => onAnswer(pregunta.id, true)}
          />
          <span className="ml-2">Verdadero</span>
        </label>

        <label className="cursor-pointer">
          <input
            type="radio"
            name={`p${pregunta.id}`}
            value="false"
            onChange={() => onAnswer(pregunta.id, false)}
          />
          <span className="ml-2">Falso</span>
        </label>
      </div>
    </div>
  );
}

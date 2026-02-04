export default function QuestionMultiSelect({ pregunta, onAnswer }) {
  const toggleOption = (opcion) => {
    onAnswer(pregunta.id, (prev = []) => {
      if (prev.includes(opcion)) return prev.filter((o) => o !== opcion);
      return [...prev, opcion];
    });
  };

  return (
    <div>
      <p className="text-lg font-semibold">{pregunta.pregunta}</p>

      <div className="mt-3 flex flex-col">
        {pregunta.opciones.map((op, i) => (
          <label key={i} className="cursor-pointer py-1">
            <input
              type="checkbox"
              value={op}
              onChange={() => toggleOption(op)}
            />
            <span className="ml-2">{op}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

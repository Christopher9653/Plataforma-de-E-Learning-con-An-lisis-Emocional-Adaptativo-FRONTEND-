export default function EmotionStatusBox({ emotions }) {
  const defaultEmotions = emotions || {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    neutral: 0,
  };

  const emotionLabels = {
    joy: "Alegría",
    sadness: "Tristeza",
    anger: "Ira",
    fear: "Miedo",
    surprise: "Sorpresa",
    neutral: "Neutral",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Estado Emocional
      </h3>

      <div className="space-y-2">
        {Object.keys(defaultEmotions).map((emotion) => (
          <div key={emotion}>
            <p className="text-sm font-medium text-gray-600">
              {emotionLabels[emotion]}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-blue-600"
                style={{ width: `${defaultEmotions[emotion]}%` }}
              ></div>
            </div>

            <span className="text-xs text-gray-500">
              {defaultEmotions[emotion]}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useRef } from "react";

export default function ClassVideoPlayer({ title, videoUrl }) {
  const videoRef = useRef(null);

  const handlePlay = () => {
    videoRef.current?.play();
  };

  const handlePause = () => {
    videoRef.current?.pause();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {title}
      </h2>

      <video
        ref={videoRef}
        controls
        className="w-full rounded-lg border border-gray-300 shadow-sm"
      >
        <source src={videoUrl} type="video/mp4" />
        Tu navegador no soporta reproducción de video.
      </video>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={handlePause}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Pausar
        </button>

        <button
          onClick={handlePlay}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reproducir
        </button>
      </div>
    </div>
  );
}

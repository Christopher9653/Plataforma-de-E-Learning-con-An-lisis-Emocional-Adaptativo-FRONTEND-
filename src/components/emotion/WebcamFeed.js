import { useEffect, useRef } from "react";

export default function WebcamFeed({ width = 400, height = 300 }) {
  const videoRef = useRef(null);

  useEffect(() => {
    async function enableCam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error al acceder a la cámara", error);
      }
    }
    enableCam();
  }, []);

  return (
    <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width={width}
        height={height}
      />
    </div>
  );
}

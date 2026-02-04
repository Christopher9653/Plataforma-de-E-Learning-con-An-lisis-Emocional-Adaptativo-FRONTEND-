// src/components/profile/ProfileAvatar.js
import { useEffect, useRef, useState } from "react";

export default function ProfileAvatar({ avatar, onChange }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(avatar || null);

  useEffect(() => {
    setPreview(avatar || null);
  }, [avatar]);

  const handleFile = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setPreview(base64);
      onChange?.(file, base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 ring-2 ring-blue-200">
        {preview ? (
          <img
            src={preview}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
            👤
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <label className="px-3 py-2 border rounded-md text-sm cursor-pointer bg-white hover:bg-gray-50">
          Subir
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>

        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onChange?.(null, null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        JPG o PNG – recomendado 400x400
      </p>
    </div>
  );
}

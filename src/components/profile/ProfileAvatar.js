// src/components/profile/ProfileAvatar.js
import { useRef, useState, useEffect } from "react";

/**
 * Props:
 * - avatar: base64 or url
 * - onChange(file, base64) => callback when a new avatar selected
 */
export default function ProfileAvatar({ avatar, onChange }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(avatar || null);

  useEffect(() => {
    setPreview(avatar || null);
  }, [avatar]);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setPreview(base64);
      if (onChange) onChange(file, base64);
    };
    reader.readAsDataURL(file);
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image")) {
      handleFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden ring-2 ring-blue-100">
        {preview ? (
          <img src={preview} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
            👤
          </div>
        )}
      </div>

      <div className="mt-3 flex space-x-2">
        <label
          className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50"
          title="Subir avatar"
        >
          Subir
          <input ref={fileRef} onChange={onInputChange} type="file" accept="image/*" className="hidden" />
        </label>

        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              if (onChange) onChange(null, null);
              if (fileRef.current) fileRef.current.value = null;
            }}
            className="px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            title="Eliminar avatar"
          >
            Eliminar
          </button>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500">Tamaño recomendado: 400x400, JPG/PNG</p>
    </div>
  );
}

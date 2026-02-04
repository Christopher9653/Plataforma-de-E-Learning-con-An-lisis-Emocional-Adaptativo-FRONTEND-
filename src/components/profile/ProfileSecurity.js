// src/components/profile/ProfileSecurity.js
import { useState } from "react";

export default function ProfileSecurity({ onChangePassword }) {
  const [form, setForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 8) {
      return setError("La contraseña debe tener mínimo 8 caracteres");
    }
    if (form.newPassword !== form.confirm) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      setLoading(true);
      await onChangePassword({
        current: form.current,
        newPassword: form.newPassword,
      });
      setSuccess("Contraseña actualizada");
      setForm({ current: "", newPassword: "", confirm: "" });
    } catch (err) {
      setError(err.message || "Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* <div>
        <label className="text-sm font-medium text-gray-700">
          Contraseña actual
        </label>
        <input
          type="password"
          name="current"
          value={form.current}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md"
        />
      </div> */}

      <div>
        <label className="text-sm font-medium text-gray-700">
          Nueva contraseña
        </label>
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Confirmar contraseña
        </label>
        <input
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex justify-end">
        <button
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </div>
    </form>
  );
}

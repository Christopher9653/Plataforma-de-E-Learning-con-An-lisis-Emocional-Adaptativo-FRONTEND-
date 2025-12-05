// src/components/profile/ProfileSecurity.js
import { useState } from "react";

/**
 * Props:
 * - userPassword: the current password stored (optional)
 * - onChangePassword({ current, newPassword }) => async or sync
 */
export default function ProfileSecurity({ userPassword, onChangePassword }) {
  const [form, setForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (!form.newPassword || form.newPassword.length < 8) {
      return "La contraseña nueva debe tener al menos 8 caracteres.";
    }
    if (form.newPassword !== form.confirm) {
      return "Las contraseñas no coinciden.";
    }
    // If there's a stored password, check current
    if (userPassword && userPassword !== form.current) {
      return "La contraseña actual es incorrecta.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSaving(true);
    try {
      await onChangePassword({ current: form.current, newPassword: form.newPassword });
      setSuccess("Contraseña actualizada.");
      setForm({ current: "", newPassword: "", confirm: "" });
    } catch (err) {
      setError(err?.message || "Error al cambiar la contraseña.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Contraseña actual</label>
        <input
          name="current"
          type="password"
          value={form.current}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
        <input
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
        <input
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 rounded-md text-white ${saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {saving ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </div>
    </form>
  );
}

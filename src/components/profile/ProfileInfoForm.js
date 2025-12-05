// src/components/profile/ProfileInfoForm.js
import { useState } from "react";

/**
 * Props:
 * - initial: { name, email }
 * - onSave(updated) => async or sync
 */
export default function ProfileInfoForm({ initial = {}, onSave }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    email: initial.email || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    if (!emailRegex.test(form.email)) {
      setError("Introduce un correo válido.");
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
      setSuccess("Datos actualizados correctamente.");
    } catch (err) {
      setError(err?.message || "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Correo</label>
        <input
          name="email"
          value={form.email}
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
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}

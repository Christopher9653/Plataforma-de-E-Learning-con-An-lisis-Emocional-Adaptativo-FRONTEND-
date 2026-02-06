"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";

const API = "https://edumotion-backend1.onrender.com/api/";

export default function EditarPerfilEstudiante() {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    username: user?.username || "",
    password: "",
    confirm_password: "",
    interested_categories:
      user?.interseted_categories || user?.interested_categories || "",
    profile_img: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(
    user?.profile_img || user?.photo || ""
  );

  /* ===============================
     INPUT TEXTO
  =============================== */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  /* ===============================
     INPUT ARCHIVO
  =============================== */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({
      ...form,
      profile_img: file,
    });
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    // Validaciones básicas
    const errors = {};
    if (!form.fullname.trim()) errors.fullname = "El nombre es obligatorio";
    if (!form.email.trim()) {
      errors.email = "El email es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Email inválido";
    }
    if (!form.username.trim()) errors.username = "El usuario es obligatorio";
    if (form.password.trim()) {
      if (form.password.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres";
      }
      if (form.password !== form.confirm_password) {
        errors.confirm_password = "Las contraseñas no coinciden";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      /* ===============================
         1️⃣ ACTUALIZAR PERFIL
      =============================== */
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("email", form.email);
      formData.append("username", form.username);
      formData.append(
        "interseted_categories",
        form.interested_categories
      );

      if (form.profile_img) {
        formData.append("profile_img", form.profile_img);
      }

      const resPerfil = await fetch(
        `${API}/student/${user.id}/`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!resPerfil.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      const data = await resPerfil.json();

      /* ===============================
         2️⃣ CAMBIAR CONTRASEÑA (OPCIONAL)
      =============================== */
      if (form.password.trim() !== "") {
        const passwordData = new FormData();
        passwordData.append("password", form.password);

        const resPassword = await fetch(
          `${API}/student/change-password/${user.id}/`,
          {
            method: "POST",
            body: passwordData,
          }
        );

        if (!resPassword.ok) {
          throw new Error("Error al cambiar la contraseña");
        }
      }

      /* ===============================
         3️⃣ ACTUALIZAR CONTEXTO
      =============================== */
      const updatedUser = {
        ...user,
        fullname: data.fullname,
        email: data.email,
        username: data.username,
        interseted_categories: data.interseted_categories,
        interested_categories: data.interseted_categories,
        photo: data.profile_img || user.photo,
        profile_img: data.profile_img || user.profile_img,
      };

      localStorage.setItem(
        "eduemotion_user",
        JSON.stringify(updatedUser)
      );
      setUser(updatedUser);

      setSuccess("Perfil actualizado correctamente");
      router.push("/dashboard/estudiante/perfil");
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard role="estudiante">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold mb-6">
              Editar Perfil
            </h1>

            {error && (
              <div className="mb-4 text-red-600 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 text-green-600 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Fullname"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                error={fieldErrors.fullname}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={fieldErrors.email}
              />

              <Input
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                error={fieldErrors.username}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Dejar vacío si no cambia"
                error={fieldErrors.password}
              />
              <Input
                label="Confirm Password"
                name="confirm_password"
                type="password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                error={fieldErrors.confirm_password}
              />

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Interested categories
                </label>
                <textarea
                  name="interested_categories"
                  value={form.interested_categories}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Profile img
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mt-3 w-24 h-24 rounded-full object-cover border"
                  />
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() =>
                    router.push("/dashboard/estudiante/perfil")
                  }
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {loading ? "Guardando..." : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

/* ===============================
   INPUT REUTILIZABLE
=============================== */
function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        {...props}
        className="w-full mt-1 px-3 py-2 border rounded-lg"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

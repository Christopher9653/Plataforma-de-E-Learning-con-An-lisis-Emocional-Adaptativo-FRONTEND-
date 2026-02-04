"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";

const API = "http://localhost:8000/api";

export default function EditarPerfilEstudiante() {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    username: user?.username || "",
    password: "",
    interested_categories: user?.interested_categories || "",
    profile_img: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ===============================
     INPUT TEXTO
  =============================== */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ===============================
     INPUT ARCHIVO
  =============================== */
  const handleFileChange = (e) => {
    setForm({
      ...form,
      profile_img: e.target.files[0],
    });
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      /* ===============================
         1️⃣ ACTUALIZAR PERFIL
      =============================== */
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("email", form.email);
      formData.append("username", form.username);
      formData.append(
        "interested_categories",
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
        const resPassword = await fetch(
          `${API}/student/change-password/${user.id}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: form.password,
            }),
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
        interested_categories: data.interested_categories,
        photo: data.profile_img || user.photo,
      };

      localStorage.setItem(
        "eduemotion_user",
        JSON.stringify(updatedUser)
      );
      setUser(updatedUser);

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

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Fullname"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />

              <Input
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Dejar vacío si no cambia"
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
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        {...props}
        className="w-full mt-1 px-3 py-2 border rounded-lg"
      />
    </div>
  );
}

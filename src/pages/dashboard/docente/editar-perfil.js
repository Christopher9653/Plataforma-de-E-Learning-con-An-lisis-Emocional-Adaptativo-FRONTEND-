"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthContext } from "@/context/AuthContext";

const API = "https://edumotion-backend1.onrender.com/api";

export default function EditarPerfilDocente() {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    qualification: user?.qualification || "",
    mobile_no: user?.mobile_no || "",
    skills: user?.skills || "",
    face_url: user?.face_url || "",
    insta_url: user?.insta_url || "",
    twit_url: user?.twit_url || "",
    web_url: user?.web_url || "",
    you_url: user?.you_url || "",
    password: "",
    confirm_password: "",
    profile_img: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(
    user?.profile_img || user?.photo || ""
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

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
    if (!form.qualification.trim())
      errors.qualification = "La especialidad es obligatoria";
    if (!form.mobile_no.trim())
      errors.mobile_no = "El teléfono es obligatorio";
    if (form.face_url && !/^https?:\/\//i.test(form.face_url)) {
      errors.face_url = "Debe ser una URL válida (http/https)";
    }
    if (form.insta_url && !/^https?:\/\//i.test(form.insta_url)) {
      errors.insta_url = "Debe ser una URL válida (http/https)";
    }
    if (form.twit_url && !/^https?:\/\//i.test(form.twit_url)) {
      errors.twit_url = "Debe ser una URL válida (http/https)";
    }
    if (form.web_url && !/^https?:\/\//i.test(form.web_url)) {
      errors.web_url = "Debe ser una URL válida (http/https)";
    }
    if (form.you_url && !/^https?:\/\//i.test(form.you_url)) {
      errors.you_url = "Debe ser una URL válida (http/https)";
    }
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
      // 1) Actualizar perfil
      const formData = new FormData();
      formData.append("full_name", form.fullname);
      formData.append("email", form.email);
      formData.append("qualification", form.qualification);
      formData.append("mobile_no", form.mobile_no);
      formData.append("skills", form.skills);
      formData.append("face_url", form.face_url);
      formData.append("insta_url", form.insta_url);
      formData.append("twit_url", form.twit_url);
      formData.append("web_url", form.web_url);
      formData.append("you_url", form.you_url);

      if (form.profile_img) {
        formData.append("profile_img", form.profile_img);
      }

      const resPerfil = await fetch(`${API}/teacher/${user.id}/`, {
        method: "PATCH",
        body: formData,
      });

      if (!resPerfil.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      const data = await resPerfil.json();

      // 2) Cambiar contraseña si aplica
      if (form.password.trim() !== "") {
        const passwordData = new FormData();
        passwordData.append("password", form.password);

        const resPassword = await fetch(
          `${API}/teacher/change-password/${user.id}/`,
          {
            method: "POST",
            body: passwordData,
          }
        );

        if (!resPassword.ok) {
          throw new Error("Error al cambiar la contraseña");
        }
      }

      // 3) Actualizar contexto
      const updatedUser = {
        ...user,
        fullname: data.fullname || form.fullname,
        email: data.email || form.email,
        qualification: data.qualification || form.qualification,
        mobile_no: data.mobile_no || form.mobile_no,
        skills: data.skills || form.skills,
        face_url: data.face_url || form.face_url,
        insta_url: data.insta_url || form.insta_url,
        twit_url: data.twit_url || form.twit_url,
        web_url: data.web_url || form.web_url,
        you_url: data.you_url || form.you_url,
        photo: data.profile_img || user.photo,
        profile_img: data.profile_img || user.profile_img,
      };

      localStorage.setItem("eduemotion_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setSuccess("Perfil actualizado correctamente");
      router.push("/dashboard/docente/perfil");
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard role="docente">
      <MainLayout>
        <div className="p-10 bg-gray-50 min-h-screen">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>

            {error && (
              <div className="mb-4 text-red-600 text-sm">{error}</div>
            )}
            {success && (
              <div className="mb-4 text-green-600 text-sm">{success}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Nombre completo"
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
                label="Especialidad"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                error={fieldErrors.qualification}
              />

              <Input
                label="Teléfono"
                name="mobile_no"
                value={form.mobile_no}
                onChange={handleChange}
                error={fieldErrors.mobile_no}
              />

              <Input
                label="Habilidades"
                name="skills"
                value={form.skills}
                onChange={handleChange}
              />

              <Input
                label="Facebook URL"
                name="face_url"
                value={form.face_url}
                onChange={handleChange}
                error={fieldErrors.face_url}
              />

              <Input
                label="Instagram URL"
                name="insta_url"
                value={form.insta_url}
                onChange={handleChange}
                error={fieldErrors.insta_url}
              />

              <Input
                label="Twitter/X URL"
                name="twit_url"
                value={form.twit_url}
                onChange={handleChange}
                error={fieldErrors.twit_url}
              />

              <Input
                label="Website URL"
                name="web_url"
                value={form.web_url}
                onChange={handleChange}
                error={fieldErrors.web_url}
              />

              <Input
                label="YouTube URL"
                name="you_url"
                value={form.you_url}
                onChange={handleChange}
                error={fieldErrors.you_url}
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
                  Profile img
                </label>
                <input type="file" onChange={handleFileChange} className="mt-1" />
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
                  onClick={() => router.push("/dashboard/docente/perfil")}
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

function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <input {...props} className="w-full mt-1 px-3 py-2 border rounded-lg" />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

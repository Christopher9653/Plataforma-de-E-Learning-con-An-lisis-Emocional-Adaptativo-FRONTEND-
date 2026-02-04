"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const { register, login } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    role: "estudiante",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",

    // estudiante
    username: "",
    interseted_categories: "",

    // docente
    qualification: "",
    mobile_no: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      await Swal.fire("Error", "Las contrasenas no coinciden", "error");
      return;
    }

    // 1) REGISTRO
    const result = await register(formData);

    if (!result.success) {
      await Swal.fire(
        "Error",
        result.message || "Error al registrar usuario",
        "error"
      );
      return;
    }

    // 2) AUTO LOGIN
    const loginResult = await login(formData.email, formData.password);

    if (!loginResult.success) {
      await Swal.fire(
        "Aviso",
        "Registro exitoso, pero no se pudo iniciar sesion",
        "warning"
      );
      return;
    }

    await Swal.fire("OK", "Registro y login exitoso", "success");

    // 3) REDIRECCION
    router.push(
      loginResult.role === "docente"
        ? "/dashboard/docente"
        : "/dashboard/estudiante"
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Crear Cuenta</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 rounded border"
            >
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
            </select>

            <input
              name="fullname"
              placeholder="Nombre completo"
              required
              onChange={handleChange}
              className="w-full p-3 rounded border"
            />

            <input
              name="email"
              type="email"
              placeholder="Correo"
              required
              onChange={handleChange}
              className="w-full p-3 rounded border"
            />

            <input
              name="password"
              type="password"
              placeholder="Contrasena"
              required
              onChange={handleChange}
              className="w-full p-3 rounded border"
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar contrasena"
              required
              onChange={handleChange}
              className="w-full p-3 rounded border"
            />

            {formData.role === "estudiante" && (
              <>
                <input
                  name="username"
                  placeholder="Usuario"
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                />
                <input
                  name="interseted_categories"
                  placeholder="Categorias de interes"
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                />
              </>
            )}

            {formData.role === "docente" && (
              <>
                <input
                  name="qualification"
                  placeholder="Titulo profesional"
                  required
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                />
                <input
                  name="mobile_no"
                  placeholder="Telefono"
                  required
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                />
                <input
                  name="skills"
                  placeholder="Habilidades"
                  required
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                />
              </>
            )}

            <button className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
              Crear cuenta
            </button>

            <p className="text-center text-sm">
              Ya tienes cuenta?{" "}
              <Link href="/login" className="text-blue-600">
                Inicia sesion
              </Link>
            </p>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

"use client";

import { useState, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const { register, login } = useContext(AuthContext);
  const router = useRouter();
  const MIN_PASSWORD_LENGTH = 8;
  const confirmPasswordRef = useRef(null);

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
    if (name === "password" && confirmPasswordRef.current) {
      if (
        confirmPasswordRef.current.value &&
        confirmPasswordRef.current.value !== value
      ) {
        confirmPasswordRef.current.setCustomValidity(
          "Las contrasenas no coinciden"
        );
      } else {
        confirmPasswordRef.current.setCustomValidity("");
      }
    }
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
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={MIN_PASSWORD_LENGTH}
              pattern={`.{${MIN_PASSWORD_LENGTH}}`}
              title={`Ingrese exactamente ${MIN_PASSWORD_LENGTH} caracteres`}
              onChange={handleChange}
              className={`w-full p-3 rounded border transition ${
                formData.password.length > 0 &&
                formData.password.length < MIN_PASSWORD_LENGTH
                  ? "border-red-400 animate-pulse"
                  : "border-gray-300"
              }`}
            />
            <p className="text-xs text-gray-600">
              Longitud de contrasena: {formData.password.length}/
              {MIN_PASSWORD_LENGTH} (minimo recomendado)
            </p>

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar contrasena"
              required
              maxLength={MIN_PASSWORD_LENGTH}
              ref={confirmPasswordRef}
              onChange={handleChange}
              onBlur={(e) => {
                if (formData.password && e.target.value !== formData.password) {
                  e.target.setCustomValidity("Las contrasenas no coinciden");
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              onInput={(e) => {
                if (e.target.value !== formData.password) {
                  e.target.setCustomValidity("Las contrasenas no coinciden");
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              className={`w-full p-3 rounded border transition ${
                formData.confirmPassword
                  ? formData.confirmPassword === formData.password
                    ? "border-green-500"
                    : "border-red-400"
                  : "border-gray-300"
              }`}
            />
            {formData.confirmPassword &&
              formData.confirmPassword !== formData.password && (
                <p className="text-xs text-red-600">
                  Las contrasenas no coinciden
                </p>
              )}
            {formData.confirmPassword &&
              formData.confirmPassword === formData.password && (
                <p className="text-xs text-green-600">
                  Las contrasenas coinciden
                </p>
              )}

            {formData.role === "estudiante" && (
              <>
                <input
                  name="username"
                  placeholder="Usuario"
                  required
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                />
                <input
                  name="interseted_categories"
                  placeholder="Categorias de interes"
                  required
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
                  type="tel"
                  placeholder="Telefono"
                  required
                  inputMode="numeric"
                  pattern="\\d{10}"
                  maxLength={10}
                  title="Ingrese exactamente 10 digitos"
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                />
                <p className="text-xs text-gray-600">
                  Longitud de telefono: {formData.mobile_no.length}/10
                </p>
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

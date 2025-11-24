import { useState, useContext } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { Geist, Geist_Mono } from "next/font/google";

// Fuentes opcionales
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RegisterPage() {
  const { login } = useContext(AuthContext); // usaremos login después del registro simulado

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "estudiante",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Simulación de registro exitoso
    const fakeUser = {
      name: formData.name,
      email: formData.email,
      role: formData.userType === "estudiante" ? "estudiante" : "docente",
    };

    // Simulación usando login() para guardarlo en el Context
    login(fakeUser.email, formData.password);

    // Redirección según rol
    if (fakeUser.role === "docente") {
      window.location.href = "/docente";
    } else {
      window.location.href = "/estudiante";
    }
  };

  return (
    <MainLayout>
      <div
        className={`${geistSans.className} ${geistMono.variable} min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center py-12 px-4`}
      >
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Crear Cuenta
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Únete a EduEmotion para una experiencia educativa adaptativa
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg 
                   dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Tu nombre"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg 
                   dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Tipo de usuario */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Tipo de Usuario
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg 
                   dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg 
                   dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg 
                   dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Repite tu contraseña"
                />
              </div>

              {/* Aceptar términos */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  required
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Acepto los{" "}
                  <span className="text-blue-600 cursor-pointer">
                    términos y condiciones
                  </span>
                </label>
              </div>

              {/* Botón registrar */}
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm font-medium rounded-lg text-white bg-blue-600 
                 hover:bg-blue-700 transition"
              >
                Crear Cuenta
              </button>

              {/* Ya tengo cuenta */}
              <div className="text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Inicia sesión aquí
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

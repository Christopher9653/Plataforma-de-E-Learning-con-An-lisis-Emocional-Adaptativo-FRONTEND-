import { useState, useContext } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { Geist, Geist_Mono } from "next/font/google";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function LoginPage() {
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // ⚠️ ESTA FUNCIÓN DEBE EXISTIR (la borraste antes)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Login
  const handleSubmit = (e) => {
    e.preventDefault();

    const result = login(formData.email, formData.password);

    if (!result.success) {
      alert(result.message);
      return;
    }

    const role = result.user.role;

    // Redirección por rol
    if (role === "admin") {
      window.location.href = "/admin";
    } else if (role === "docente") {
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
                Iniciar Sesión
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Accede a tu cuenta de EduEmotion
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white transition"
                  placeholder="tu@email.com"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white transition"
                  placeholder="Tu contraseña"
                />
              </div>

              {/* REMEMBER */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              {/* BOTÓN */}
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Iniciar Sesión
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ¿No tienes una cuenta?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Regístrate aquí
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

"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { Geist, Geist_Mono } from "next/font/google";
import Swal from "sweetalert2";

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
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ===============================
  // LOGIN
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      await Swal.fire(
        "Error",
        result.message || "Credenciales invalidas",
        "error"
      );
      return;
    }

    await Swal.fire("OK", "Login exitoso", "success");

    // REDIRECCION POR ROL
    if (result.role === "docente") {
      router.push("/dashboard/docente");
    } else {
      router.push("/dashboard/estudiante");
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
                Iniciar Sesion
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Accede a tu cuenta de EduEmotion
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <input
                name="email"
                type="email"
                placeholder="Correo electronico"
                required
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border dark:bg-zinc-700"
              />

              <input
                name="password"
                type="password"
                placeholder="Contrasena"
                required
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border dark:bg-zinc-700"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Iniciar Sesion
              </button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                No tienes una cuenta?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Registrate aqui
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

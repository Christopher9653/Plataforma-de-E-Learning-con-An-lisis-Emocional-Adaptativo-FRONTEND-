// src/components/layout/Navbar.js
import { useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"    // 🔥 coloca tu logo en /public/logo.png
            alt="EduEmotion Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            EduEmotion
          </span>
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex space-x-8 text-gray-700 dark:text-gray-300 font-medium">

          <Link href="/" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
            Inicio
          </Link>

          <a href="#informacion" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
            Información
          </a>

          <a href="#nosotros" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
            Sobre Nosotros
          </a>

          <a href="#mision" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
            Misión & Visión
          </a>

          {/* SI NO HAY SESIÓN */}
          {!user && (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Registro
              </Link>
            </>
          )}

          {/* SI HAY SESIÓN → Mostrar “Cerrar sesión” */}
          {user && (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Cerrar Sesión
            </button>
          )}
        </div>

        {/* BOTÓN HAMBURGUESA EN MÓVIL */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-300"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* MENU MÓVIL */}
      {open && (
        <div className="md:hidden bg-white dark:bg-zinc-900 px-6 pb-6 space-y-4 shadow-lg">
          <Link href="/" className="block hover:text-blue-500 dark:hover:text-blue-400 transition">
            Inicio
          </Link>

          <a href="#informacion" className="block hover:text-blue-500 dark:hover:text-blue-400 transition">
            Información
          </a>

          <a href="#nosotros" className="block hover:text-blue-500 dark:hover:text-blue-400 transition">
            Sobre Nosotros
          </a>

          <a href="#mision" className="block hover:text-blue-500 dark:hover:text-blue-400 transition">
            Misión & Visión
          </a>

          {!user ? (
            <>
              <Link
                href="/login"
                className="block px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Registro
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

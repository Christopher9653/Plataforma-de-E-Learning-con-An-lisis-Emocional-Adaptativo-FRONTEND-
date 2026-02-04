import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function NavbarAuth() {
  const { user, logout } = useContext(AuthContext);

  const linksByRole = {
    admin: [
      { name: "Dashboard", href: "/admin" },
      { name: "Usuarios", href: "/admin/usuarios" },
      { name: "Cursos", href: "/admin/cursos" },
      { name: "Reportes", href: "/admin/reportes" },
      { name: "Estadisticas", href: "/admin/estadisticas" },
      { name: "Perfil", href: "/perfil" },
    ],
    docente: [
      { name: "Dashboard", href: "/dashboard/docente" },
      { name: "Clases", href: "/dashboard/docente/clases" },
      { name: "Seguimiento", href: "/dashboard/docente/estudiantes" },
      { name: "Quizzes", href: "/dashboard/docente/quizzes" },
      { name: "Perfil", href: "/dashboard/docente/perfil" },
    ],
    estudiante: [
      { name: "Dashboard", href: "/dashboard/estudiante" },
      { name: "Mis cursos", href: "/dashboard/estudiante/cursos" },
      { name: "Inscripciones", href: "/dashboard/estudiante/inscripciones" },
      { name: "Perfil", href: "/dashboard/estudiante/perfil" },
      { name: "Mi progreso", href: "/dashboard/estudiante/progreso" },

    ],
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* LOGO */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png" // 🔥 coloca tu logo en /public/logo.png
          alt="EduEmotion Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          EduEmotion
        </span>
      </Link>
      <h1 className="text-xl font-bold">EduEmotion</h1>
      <div className="flex space-x-6 items-center">
        {linksByRole[user?.role]?.map((link) => (
          <Link key={link.href} href={link.href}>
            <span className="hover:text-gray-200 cursor-pointer">
              {link.name}
            </span>
          </Link>
        ))}
        <button
          onClick={logout}
          className="bg-white text-blue-600 hover:bg-red-400 hover:text-white transition px-4 py-2 rounded-md"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}
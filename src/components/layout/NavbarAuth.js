import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

export default function NavbarAuth() {
  const { user, logout } = useContext(AuthContext);

  const linksByRole = {
    admin: [
      { name: "Dashboard", href: "/admin" },
      { name: "Usuarios", href: "/admin/usuarios" },
      { name: "Cursos", href: "/admin/cursos" },
      { name: "Reportes", href: "/admin/reportes" },
    ],
    docente: [
      { name: "Dashboard", href: "/docente" },
      { name: "Clases", href: "/docente/clases" },
      { name: "Estudiantes", href: "/docente/estudiantes" },
      { name: "Reportes", href: "/docente/reportes" },
    ],
    estudiante: [
      { name: "Dashboard", href: "/estudiante" },
      { name: "Mis Clases", href: "/estudiante/clases" },
      { name: "Mi Progreso", href: "/estudiante/mi-progreso" },
      { name: "Inscripciones", href: "/estudiante/inscripciones" },
    ],
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
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
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

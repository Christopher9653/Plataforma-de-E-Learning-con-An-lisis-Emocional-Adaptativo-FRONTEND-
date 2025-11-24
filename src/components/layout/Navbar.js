// src/components/layout/Navbar.js
export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">EduEmotion</h1>

      <div className="flex space-x-6">
        <a href="/" className="hover:text-blue-500">Inicio</a>
        <a href="/login" className="hover:text-blue-500">Login</a>
        <a href="/register" className="hover:text-blue-500">Registro</a>
      </div>
    </nav>
  );
}

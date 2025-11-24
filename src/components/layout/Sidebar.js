// src/components/layout/Sidebar.js
export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 space-y-4">
      <h2 className="text-lg font-semibold">Panel</h2>

      <nav className="space-y-2">
        <a className="block hover:bg-gray-700 p-2 rounded" href="#">Dashboard</a>
        <a className="block hover:bg-gray-700 p-2 rounded" href="#">Clases</a>
        <a className="block hover:bg-gray-700 p-2 rounded" href="#">Reportes</a>
      </nav>
    </aside>
  );
}

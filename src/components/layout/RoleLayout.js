// src/components/layout/RoleLayout.js
import Sidebar from "./Sidebar";

export default function RoleLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}

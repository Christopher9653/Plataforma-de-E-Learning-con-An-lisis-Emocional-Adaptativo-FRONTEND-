export default function DashboardLayout({ sidebar, children }) {
  return (
    <div className="min-h-screen flex">
      {sidebar}
      <main className="flex-1 bg-gray-100 p-8">{children}</main>
    </div>
  );
}

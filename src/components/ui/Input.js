// src/components/ui/Input.js
export default function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        {...props}
        className="w-full border px-3 py-2 rounded-lg shadow-sm"
      />
    </div>
  );
}

// src/components/classes/ClassCard.js
export default function ClassCard({ title, description }) {
  return (
    <div className="bg-white shadow p-4 rounded-lg border">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

export default function ErrorBox({ message }) {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded">
      {message}
    </div>
  );
}

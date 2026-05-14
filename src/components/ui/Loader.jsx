export default function Loader({ label = "Lädt..." }) {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <div className="loader" />
      <span>{label}</span>
    </div>
  );
}
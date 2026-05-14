import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page-stack">
      <h1>404</h1>
      <p>Die Seite wurde nicht gefunden.</p>
      <Link to="/">Zurück zum Dashboard</Link>
    </div>
  );
}
import useAuth from "../../hooks/useAuth";

export default function Header() {
  const { profile, user } = useAuth();

  return (
    <header className="header">
      <div>
        <h1 className="header__title">Worker Dashboard</h1>
        <p className="header__subtitle">
          Willkommen, {profile?.name || user?.email || "Benutzer"}
        </p>
      </div>
    </header>
  );
}
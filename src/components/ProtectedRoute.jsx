import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  minLevel = 1,
}) {
  const { profile, loading } = useAuth();

  if (loading) {
    return <p>Lade Benutzerrechte...</p>;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  const userLevel = Number(profile?.role_level || 0);

  if (userLevel < minLevel) {
    return <Navigate to="/" replace />;
  }

  return children;
}
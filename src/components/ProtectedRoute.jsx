import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { createMyProfileIfMissing } from "../services/supabase/profiles";

export default function ProtectedRoute({
  children,
  minLevel = 1,
}) {
  const { user, isAuthLoading } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setIsProfileLoading(false);
        return;
      }

      try {
        const profileData = await createMyProfileIfMissing();
        setProfile(profileData);
      } catch (error) {
        console.error("Profilfehler:", error.message);
        setProfile(null);
      } finally {
        setIsProfileLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  if (isAuthLoading || isProfileLoading) {
    return (
      <div style={{ padding: "30px", color: "white" }}>
        Lade...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userLevel = Number(profile?.role_level || 1);

  if (userLevel < minLevel) {
    return <Navigate to="/" replace />;
  }

  return children;
}
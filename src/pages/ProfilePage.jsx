import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOutUser } from "../services/supabase/auth";
import { createMyProfileIfMissing } from "../services/supabase/profiles";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const profileData = await createMyProfileIfMissing();
      setProfile(profileData);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await signOutUser();
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  }

  if (isLoading) {
    return (
      <div>
        <h1>Profil</h1>
        <p>Lade Profil...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Profil</h1>
          <p>Hier siehst du deine echten Supabase-Benutzerdaten.</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="app-form-card">
          <h2>Benutzerdaten</h2>

          <div className="profile-info-list">
            <div className="profile-info-row">
              <span className="profile-info-label">E-Mail</span>
              <strong>{user?.email || "Nicht bekannt"}</strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">User-ID</span>
              <strong style={{ wordBreak: "break-all" }}>
                {user?.id || "Nicht bekannt"}
              </strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Rolle</span>
              <strong>{profile?.role || "worker"}</strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Account erstellt</span>
              <strong>
                {user?.created_at
                  ? new Date(user.created_at).toLocaleString("de-DE")
                  : "Nicht bekannt"}
              </strong>
            </div>
          </div>
        </div>

        <div className="app-form-card">
          <h2>Rollen-System</h2>

          <p>
            Deine Rolle kommt jetzt aus Supabase. Aktuell ist der Standard
            <strong> worker</strong>. Später setzen wir ausgewählte Benutzer auf
            <strong> admin</strong>.
          </p>
        </div>
      </div>

      <div className="app-form-card" style={{ marginTop: "24px" }}>
        <h2>Aktionen</h2>

        <div className="task-actions">
          <button onClick={handleLogout} className="task-btn task-btn--danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
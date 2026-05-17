import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { signOutUser } from "../services/supabase/auth";
import { createMyProfileIfMissing } from "../services/supabase/profiles";
import { supabase } from "../services/supabase/client";

import {
  isAdmin,
  canManageUsers,
  canCreateTasks,
  canEditTasks,
  canDeleteTasks,
  canManageProduction,
  canViewReports,
  canManageCompany,
} from "../utils/permissions";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setIsLoading(true);

      const profileData = await createMyProfileIfMissing();
      setProfile(profileData);

      if (profileData?.company_id) {
        const { data, error } = await supabase
          .from("companies")
          .select("*")
          .eq("id", profileData.company_id)
          .single();

        if (!error) {
          setCompany(data);
        }
      }
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
          <p>Deine Firmen-, Benutzer- und Rechteeinstellungen.</p>
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
              <span className="profile-info-label">Name</span>
              <strong>{profile?.full_name || "Noch nicht gesetzt"}</strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Rollenname</span>
              <strong>{profile?.role_name || profile?.role || "Mitarbeiter"}</strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Level</span>
              <strong>{profile?.role_level ?? 1}</strong>
            </div>
          </div>
        </div>

        <div className="app-form-card">
          <h2>Firma</h2>

          <div className="profile-info-list">
            <div className="profile-info-row">
              <span className="profile-info-label">Firmenname</span>
              <strong>{company?.name || "Noch keine Firma"}</strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Firmen-ID</span>
              <strong style={{ wordBreak: "break-all" }}>
                {profile?.company_id || "Nicht bekannt"}
              </strong>
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
          <h2>Rechte</h2>

          <div className="profile-info-list">
            <div className="profile-info-row">
              <span className="profile-info-label">Admin</span>
              <strong>{isAdmin(profile) ? "Ja" : "Nein"}</strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Benutzer verwalten</span>
              <strong>{canManageUsers(profile) ? "Ja" : "Nein"}</strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Aufgaben erstellen</span>
              <strong>{canCreateTasks(profile) ? "Ja" : "Nein"}</strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Aufgaben bearbeiten</span>
              <strong>{canEditTasks(profile) ? "Ja" : "Nein"}</strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Aufgaben löschen</span>
              <strong>{canDeleteTasks(profile) ? "Ja" : "Nein"}</strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Produktion verwalten</span>
              <strong>{canManageProduction(profile) ? "Ja" : "Nein"}</strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Berichte ansehen</span>
              <strong>{canViewReports(profile) ? "Ja" : "Nein"}</strong>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Firma verwalten</span>
              <strong>{canManageCompany(profile) ? "Ja" : "Nein"}</strong>
            </div>
          </div>
        </div>

        <div className="app-form-card">
          <h2>Aktionen</h2>

          <div className="task-actions">
            <button onClick={handleLogout} className="task-btn task-btn--danger">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
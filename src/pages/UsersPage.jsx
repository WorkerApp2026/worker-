import { useEffect, useState } from "react";
import { supabase } from "../services/supabase/client";

import InviteUserForm from "../components/users/InviteUserForm";

import { canManageUsers } from "../utils/permissions";

import { useAuth } from "../context/AuthContext";

export default function UsersPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);

      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(currentProfile);

      if (!currentProfile?.company_id) {
        return;
      }

      const { data: companyUsers } = await supabase
        .from("profiles")
        .select("*")
        .eq("company_id", currentProfile.company_id)
        .order("role_level", { ascending: false });

      setUsers(companyUsers || []);
    } finally {
      setIsLoading(false);
    }
  }

  function getRoleName(level) {
    if (level >= 10) return "Super Admin";
    if (level >= 8) return "Admin";
    if (level >= 5) return "Manager";

    return "Mitarbeiter";
  }

  if (isLoading) {
    return <div>Lade Benutzer...</div>;
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Benutzerverwaltung</h1>

        <p>
          Mitarbeiter, Rollen und Rechte deiner Firma.
        </p>
      </div>

      {canManageUsers(profile?.role_level) && (
        <InviteUserForm />
      )}

      {!canManageUsers(profile?.role_level) && (
        <div className="content-card">
          <h2>Keine Bearbeitungsrechte</h2>

          <p>
            Du kannst Mitarbeiter ansehen, aber keine
            Level ändern.
          </p>
        </div>
      )}

      <div className="content-card">
        <h2>Mitarbeiter</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          {users.map((companyUser) => (
            <div
              key={companyUser.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                background:
                  "rgba(255,255,255,0.03)",
              }}
            >
              <div>
                <strong>
                  {companyUser.email}
                </strong>
              </div>

              <div>
                {getRoleName(
                  companyUser.role_level
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="content-card">
        <h2>Aktueller Benutzer</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <div className="profile-row">
            <span>E-Mail</span>

            <strong>{profile?.email}</strong>
          </div>

          <div className="profile-row">
            <span>Dein Level</span>

            <strong>
              {profile?.role_level}
            </strong>
          </div>

          <div className="profile-row">
            <span>Benutzer bearbeiten</span>

            <strong>
              {canManageUsers(profile?.role_level)
                ? "Ja"
                : "Nein"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
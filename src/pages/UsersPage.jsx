import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { createMyProfileIfMissing } from "../services/supabase/profiles";
import {
  getCompanyUsers,
  updateUserRoleLevel,
} from "../services/supabase/users";
import { canManageUsers } from "../utils/permissions";

export default function UsersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);

  const userCanManageUsers = canManageUsers(profile);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setIsLoading(true);

      const profileData = await createMyProfileIfMissing();
      setProfile(profileData);

      if (!canManageUsers(profileData)) {
        navigate("/", { replace: true });
        return;
      }

      const companyUsers = await getCompanyUsers(profileData?.company_id);
      setUsers(companyUsers);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRoleLevelChange(employeeId, newLevel) {
    if (!userCanManageUsers) {
      alert("Du hast keine Berechtigung, Benutzer zu bearbeiten.");
      return;
    }

    try {
      setSavingUserId(employeeId);

      await updateUserRoleLevel(employeeId, newLevel);
      await loadUsers();
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingUserId(null);
    }
  }

  if (isLoading) {
    return (
      <div>
        <h1>Benutzerverwaltung</h1>
        <p>Lade Mitarbeiter...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Benutzerverwaltung</h1>
          <p>Mitarbeiter, Rollen und Rechte deiner Firma.</p>
        </div>
      </div>

      <div className="app-form-card">
        <h2>Mitarbeiter</h2>

        <div className="profile-info-list">
          {users.length === 0 ? (
            <p>Noch keine Mitarbeiter gefunden.</p>
          ) : (
            users.map((employee) => (
              <div key={employee.id} className="profile-info-row">
                <span className="profile-info-label">
                  {employee.full_name || employee.email || "Unbekannt"}
                </span>

                <strong>
                  {employee.role_name || employee.role || "Mitarbeiter"}
                </strong>

                <select
                  value={employee.role_level ?? 1}
                  disabled={savingUserId === employee.id}
                  onChange={(event) =>
                    handleRoleLevelChange(employee.id, event.target.value)
                  }
                >
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                  <option value="3">Level 3</option>
                  <option value="4">Level 4</option>
                  <option value="5">Level 5</option>
                  <option value="6">Level 6</option>
                  <option value="7">Level 7</option>
                  <option value="8">Level 8</option>
                  <option value="9">Level 9</option>
                  <option value="10">Level 10</option>
                </select>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="app-form-card" style={{ marginTop: "24px" }}>
        <h2>Aktueller Benutzer</h2>

        <div className="profile-info-list">
          <div className="profile-info-row">
            <span className="profile-info-label">E-Mail</span>
            <strong>{user?.email || "Nicht bekannt"}</strong>
          </div>

          <div className="profile-info-row">
            <span className="profile-info-label">Dein Level</span>
            <strong>{profile?.role_level ?? 1}</strong>
          </div>

          <div className="profile-info-row">
            <span className="profile-info-label">Benutzer bearbeiten</span>
            <strong>{userCanManageUsers ? "Ja" : "Nein"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
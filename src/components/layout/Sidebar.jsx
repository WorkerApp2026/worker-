import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { createMyProfileIfMissing } from "../../services/supabase/profiles";
import { canManageUsers } from "../../utils/permissions";

export default function Sidebar() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        return;
      }

      try {
        const profileData = await createMyProfileIfMissing();
        setProfile(profileData);
      } catch (error) {
        console.error("Profil konnte nicht geladen werden:", error.message);
        setProfile(null);
      }
    }

    loadProfile();
  }, [user]);

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-badge">W</div>

        <div className="sidebar__brand-text">
          <h2 className="sidebar__brand-title">Worker</h2>
          <p className="sidebar__brand-subtitle">Smart Worker Dashboard</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          Aufgaben
        </NavLink>

        <NavLink
          to="/tasks/new"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          Neue Aufgabe
        </NavLink>

        {canManageUsers(profile) && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            Benutzer
          </NavLink>
        )}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          Profil
        </NavLink>
      </nav>
    </aside>
  );
}
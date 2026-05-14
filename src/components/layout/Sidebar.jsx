import { NavLink } from "react-router-dom";

export default function Sidebar() {
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
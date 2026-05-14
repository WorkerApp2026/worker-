import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app-content">
        <div className="app-content__inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
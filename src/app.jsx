import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import { useAuth } from "./context/AuthContext";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import TaskCreatePage from "./pages/TaskCreatePage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import TasksPage from "./pages/TasksPage";

function PublicRoute({ children }) {
  const { isLoggedIn, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <div style={{ padding: "30px", color: "white" }}>Lade...</div>;
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/new" element={<TaskCreatePage />} />
          <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
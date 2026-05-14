import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import TasksPage from "../pages/TasksPage";
import TaskCreatePage from "../pages/TaskCreatePage";
import TaskDetailsPage from "../pages/TaskDetailsPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
      {
        path: "tasks/new",
        element: <TaskCreatePage />,
      },
      {
        path: "tasks/:taskId",
        element: <TaskDetailsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
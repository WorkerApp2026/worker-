import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyProfile } from "../services/supabase/profiles";
import {
  deleteTask,
  getTasks,
  updateTaskStatus,
} from "../services/supabase/tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    try {
      setIsLoading(true);

      const [tasksData, profileData] = await Promise.all([
        getTasks(),
        getMyProfile(),
      ]);

      setTasks(tasksData);
      setProfile(profileData);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm(
      "Möchtest du diese Aufgabe wirklich löschen?"
    );

    if (!confirmed) return;

    try {
      await deleteTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    try {
      const updatedTask = await updateTaskStatus(taskId, newStatus);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      alert(error.message);
    }
  }

  function getStatusClass(status) {
    if (status === "Erledigt") return "task-badge task-badge--done";
    if (status === "In Bearbeitung") return "task-badge task-badge--progress";
    return "task-badge task-badge--open";
  }

  if (isLoading) {
    return (
      <div>
        <h1>Aufgaben</h1>
        <p>Lade Aufgaben...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Aufgaben</h1>
          <p>Alle Aufgaben aus Supabase.</p>
        </div>

        <Link to="/tasks/new" className="task-btn task-btn--primary">
          Neue Aufgabe
        </Link>
      </div>

      {!isAdmin && (
        <div className="success-banner">
          Worker-Modus: Du kannst Status ändern, aber keine Aufgaben löschen.
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h2>Noch keine Aufgaben vorhanden</h2>
          <p>Erstelle deine erste Aufgabe.</p>
        </div>
      ) : (
        <div className="task-card-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-card__top">
                <div>
                  <h3 className="task-card__title">{task.title}</h3>
                  <p className="task-card__description">{task.description}</p>
                </div>

                <span className={getStatusClass(task.status)}>
                  {task.status}
                </span>
              </div>

              <div className="task-meta-row">
                <div className="task-meta-box">
                  <span className="task-meta-label">Priorität</span>
                  <strong>{task.priority}</strong>
                </div>

                <div className="task-meta-box">
                  <span className="task-meta-label">Status ändern</span>
                  <select
                    value={task.status}
                    onChange={(event) =>
                      handleStatusChange(task.id, event.target.value)
                    }
                    className="form-input"
                  >
                    <option value="Offen">Offen</option>
                    <option value="In Bearbeitung">In Bearbeitung</option>
                    <option value="Erledigt">Erledigt</option>
                  </select>
                </div>

                <div className="task-meta-box">
                  <span className="task-meta-label">Erstellt</span>
                  <strong>
                    {new Date(task.created_at).toLocaleString("de-DE")}
                  </strong>
                </div>
              </div>

              <div className="task-actions">
                <Link
                  to={`/tasks/${task.id}`}
                  className="task-btn task-btn--primary"
                >
                  Details
                </Link>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="task-btn task-btn--danger"
                  >
                    Löschen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
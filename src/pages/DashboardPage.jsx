import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getTasks } from "../services/supabase/tasks";
import { getCommentsByTaskId } from "../services/supabase/comments";
import { getTaskImages } from "../services/supabase/images";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const taskData = await getTasks();

      let commentsTotal = 0;
      let imagesTotal = 0;

      for (const task of taskData) {
        const comments = await getCommentsByTaskId(task.id);
        const images = await getTaskImages(task.id);

        commentsTotal += comments.length;
        imagesTotal += images.length;
      }

      setTasks(taskData);
      setCommentCount(commentsTotal);
      setImageCount(imagesTotal);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const openTasks = tasks.filter((task) => task.status === "Offen").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Bearbeitung"
  ).length;
  const doneTasks = tasks.filter((task) => task.status === "Erledigt").length;

  const latestTasks = tasks.slice(0, 5);

  if (isLoading) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Lade Dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Hier siehst du deine echten Supabase-Daten.</p>
        </div>

        <Link to="/tasks/new" className="task-btn task-btn--primary">
          Neue Aufgabe
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stats-card">
          <span className="stats-card__label">Alle Aufgaben</span>
          <strong className="stats-card__value">{tasks.length}</strong>
        </div>

        <div className="stats-card">
          <span className="stats-card__label">Offen</span>
          <strong className="stats-card__value">{openTasks}</strong>
        </div>

        <div className="stats-card">
          <span className="stats-card__label">In Bearbeitung</span>
          <strong className="stats-card__value">{inProgressTasks}</strong>
        </div>

        <div className="stats-card">
          <span className="stats-card__label">Erledigt</span>
          <strong className="stats-card__value">{doneTasks}</strong>
        </div>

        <div className="stats-card">
          <span className="stats-card__label">Kommentare</span>
          <strong className="stats-card__value">{commentCount}</strong>
        </div>

        <div className="stats-card">
          <span className="stats-card__label">Bilder</span>
          <strong className="stats-card__value">{imageCount}</strong>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="app-form-card">
          <h2>Letzte Aufgaben</h2>
          <p>Die zuletzt erstellten Aufgaben aus Supabase.</p>

          {latestTasks.length === 0 ? (
            <div className="empty-state">
              <p>Noch keine Aufgaben vorhanden.</p>
            </div>
          ) : (
            <div className="dashboard-list">
              {latestTasks.map((task) => (
                <div key={task.id} className="dashboard-list-card">
                  <div className="dashboard-list-card__top">
                    <div>
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>

                      <div className="dashboard-list-meta">
                        <span>Priorität: {task.priority}</span>
                        <span>Status: {task.status}</span>
                      </div>
                    </div>

                    <Link
                      to={`/tasks/${task.id}`}
                      className="task-btn task-btn--primary"
                    >
                      Details öffnen
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
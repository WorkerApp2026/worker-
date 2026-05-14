import { Link } from "react-router-dom";
import Card from "../ui/Card";
import TaskStatusBadge from "../tasks/TaskStatusBadge";
import formatDate from "../../utils/formatDate";

export default function RecentTasks({ tasks = [] }) {
  return (
    <Card title="Letzte Aufgaben">
      {tasks.length === 0 ? (
        <p>Keine Aufgaben vorhanden.</p>
      ) : (
        <div className="simple-list">
          {tasks.map((task) => (
            <Link key={task.id} to={`/tasks/${task.id}`} className="simple-list__item">
              <div>
                <strong>{task.title}</strong>
                <div className="muted">{formatDate(task.created_at)}</div>
              </div>
              <TaskStatusBadge status={task.status} />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
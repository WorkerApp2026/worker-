import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import TaskStatusBadge from "./TaskStatusBadge";
import formatDate from "../../utils/formatDate";

export default function TaskCard({ task }) {
  return (
    <Card
      title={task.title}
      actions={<TaskStatusBadge status={task.status} />}
      className="task-card"
    >
      <p>{task.description || "Keine Beschreibung vorhanden."}</p>

      <div className="task-meta">
        <Badge tone="default">Priorität: {task.priority || "—"}</Badge>
        <span className="muted">Fällig: {formatDate(task.due_date)}</span>
      </div>

      <Link to={`/tasks/${task.id}`} className="text-link">
        Details öffnen
      </Link>
    </Card>
  );
}
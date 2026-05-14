import Loader from "../ui/Loader";
import TaskCard from "./TaskCard";

export default function TaskList({ tasks, loading, error }) {
  if (loading) {
    return <Loader label="Aufgaben werden geladen..." />;
  }

  if (error) {
    return <p className="form-error form-error--block">{error}</p>;
  }

  if (!tasks.length) {
    return <p>Keine Aufgaben gefunden.</p>;
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
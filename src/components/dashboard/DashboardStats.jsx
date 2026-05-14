import Card from "../ui/Card";

export default function DashboardStats({ stats }) {
  return (
    <div className="stats-grid">
      <Card title="Offene Aufgaben">
        <div className="stat">{stats.open}</div>
      </Card>

      <Card title="Erledigte Aufgaben">
        <div className="stat">{stats.done}</div>
      </Card>

      <Card title="Kommentare gesamt">
        <div className="stat">{stats.comments}</div>
      </Card>

      <Card title="Bilder gesamt">
        <div className="stat">{stats.images}</div>
      </Card>
    </div>
  );
}
import Badge from "../ui/Badge";

export default function TaskStatusBadge({ status }) {
  const toneMap = {
    Offen: "warning",
    "In Bearbeitung": "info",
    Erledigt: "success",
  };

  return <Badge tone={toneMap[status] || "default"}>{status || "—"}</Badge>;
}
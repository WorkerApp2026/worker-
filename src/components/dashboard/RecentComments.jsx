import Card from "../ui/Card";
import formatDate from "../../utils/formatDate";

export default function RecentComments({ comments = [] }) {
  return (
    <Card title="Letzte Kommentare">
      {comments.length === 0 ? (
        <p>Noch keine Kommentare vorhanden.</p>
      ) : (
        <div className="simple-list">
          {comments.map((comment) => (
            <div key={comment.id} className="simple-list__item">
              <div>
                <strong>{comment.user_id || "Benutzer"}</strong>
                <p>{comment.content}</p>
              </div>
              <span className="muted">{formatDate(comment.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
import Card from "../ui/Card";
import Loader from "../ui/Loader";
import formatDate from "../../utils/formatDate";

export default function CommentList({ comments, loading, error }) {
  return (
    <Card title="Kommentare">
      {loading ? <Loader label="Kommentare laden..." /> : null}
      {error ? <p className="form-error form-error--block">{error}</p> : null}

      {!loading && !comments.length ? <p>Noch keine Kommentare vorhanden.</p> : null}

      <div className="comment-list">
        {comments.map((comment) => (
          <article key={comment.id} className="comment-item">
            <div className="comment-item__meta">
              <strong>{comment.user_id || "Benutzer"}</strong>
              <span className="muted">{formatDate(comment.created_at)}</span>
            </div>
            <p>{comment.content}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}
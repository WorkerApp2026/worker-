import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getTaskById } from "../services/supabase/tasks";
import {
  createComment,
  deleteComment,
  getCommentsByTaskId,
} from "../services/supabase/comments";
import {
  deleteTaskImage,
  getTaskImages,
  uploadTaskImage,
} from "../services/supabase/images";

export default function TaskDetailsPage() {
  const { taskId } = useParams();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [images, setImages] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPageData();
  }, [taskId]);

  async function loadPageData() {
    try {
      setIsLoading(true);
      setMessage("");

      const taskData = await getTaskById(taskId);
      const commentsData = await getCommentsByTaskId(taskId);
      const imagesData = await getTaskImages(taskId);

      setTask(taskData);
      setComments(commentsData);
      setImages(imagesData);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateComment(event) {
    event.preventDefault();

    const text = commentText.trim();

    if (!text) return;

    try {
      const newComment = await createComment(taskId, text);
      setComments((currentComments) => [newComment, ...currentComments]);
      setCommentText("");
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDeleteComment(commentId) {
    const confirmed = window.confirm("Möchtest du diesen Kommentar wirklich löschen?");
    if (!confirmed) return;

    try {
      await deleteComment(commentId);
      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);

      const newImage = await uploadTaskImage(taskId, file);

      setImages((currentImages) => [newImage, ...currentImages]);
      event.target.value = "";
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeleteImage(imageId) {
    const confirmed = window.confirm("Möchtest du dieses Bild wirklich löschen?");
    if (!confirmed) return;

    try {
      await deleteTaskImage(imageId);

      setImages((currentImages) =>
        currentImages.filter((image) => image.id !== imageId)
      );
    } catch (error) {
      alert(error.message);
    }
  }

  if (isLoading) {
    return (
      <div>
        <h1>Aufgabendetails</h1>
        <p>Lade Aufgabe...</p>
      </div>
    );
  }

  if (message || !task) {
    return (
      <div className="detail-page">
        <div className="detail-card">
          <h1>Aufgabe nicht gefunden</h1>
          <p>{message || "Diese Aufgabe existiert nicht oder wurde gelöscht."}</p>

          <Link to="/tasks" className="task-btn task-btn--primary">
            Zurück zur Aufgabenliste
          </Link>
        </div>
      </div>
    );
  }

  const statusClass =
    task.status === "Erledigt"
      ? "task-badge task-badge--done"
      : task.status === "In Bearbeitung"
      ? "task-badge task-badge--progress"
      : "task-badge task-badge--open";

  return (
    <div className="detail-page">
      <div className="page-header">
        <div>
          <h1>Aufgabendetails</h1>
          <p>Diese Aufgabe wird aus Supabase geladen.</p>
        </div>

        <Link to="/tasks" className="task-btn task-btn--primary">
          Zurück
        </Link>
      </div>

      <div className="detail-card">
        <div className="detail-card__top">
          <div>
            <h2 className="detail-title">{task.title}</h2>
            <p className="detail-description">{task.description}</p>
          </div>

          <span className={statusClass}>{task.status}</span>
        </div>

        <div className="detail-meta-grid">
          <div className="detail-meta-box">
            <span className="detail-meta-label">Priorität</span>
            <strong>{task.priority}</strong>
          </div>

          <div className="detail-meta-box">
            <span className="detail-meta-label">Erstellt</span>
            <strong>{new Date(task.created_at).toLocaleString("de-DE")}</strong>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <div className="section-header">
          <h2>Bilder</h2>
          <p>Bilder werden jetzt online in Supabase Storage gespeichert.</p>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
          className="form-input"
        />

        {isUploading && <p>Bild wird hochgeladen...</p>}

        {images.length === 0 ? (
          <div className="empty-state" style={{ marginTop: "18px" }}>
            <p>Noch keine Bilder vorhanden.</p>
          </div>
        ) : (
          <div className="image-grid">
            {images.map((image) => (
              <div key={image.id} className="image-card">
                <img
                  src={image.image_url}
                  alt="Aufgabenbild"
                  className="image-card__img"
                />

                <div className="image-card__body">
                  <small>{new Date(image.created_at).toLocaleString("de-DE")}</small>

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id)}
                    className="task-btn task-btn--danger"
                  >
                    Bild löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="detail-card">
        <div className="section-header">
          <h2>Kommentare</h2>
          <p>Kommentare werden online in Supabase gespeichert.</p>
        </div>

        <form onSubmit={handleCreateComment} className="app-form-card app-form-card--nested">
          <div className="form-field">
            <label className="form-label">Neuer Kommentar</label>
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              className="form-input form-textarea"
              placeholder="Kommentar schreiben..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="task-btn task-btn--primary">
              Kommentar speichern
            </button>
          </div>
        </form>

        {comments.length === 0 ? (
          <div className="empty-state" style={{ marginTop: "18px" }}>
            <p>Noch keine Kommentare vorhanden.</p>
          </div>
        ) : (
          <div className="comment-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-card">
                <p className="comment-card__text">{comment.text}</p>

                <small className="comment-card__date">
                  {new Date(comment.created_at).toLocaleString("de-DE")}
                </small>

                <div className="task-actions">
                  <button
                    type="button"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="task-btn task-btn--danger"
                  >
                    Kommentar löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
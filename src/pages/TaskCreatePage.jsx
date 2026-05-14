import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTask } from "../services/supabase/tasks";

export default function TaskCreatePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Mittel",
    status: "Offen",
  });

  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title || !description) {
      setMessage("Bitte Titel und Beschreibung ausfüllen.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");

      await createTask({
        title,
        description,
        priority: formData.priority,
        status: formData.status,
      });

      setMessage("Aufgabe erfolgreich gespeichert ✔️");

      setTimeout(() => {
        navigate("/tasks");
      }, 800);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Neue Aufgabe</h1>
          <p>Erstelle eine neue Aufgabe in Supabase.</p>
        </div>
      </div>

      {message && <div className="success-banner">{message}</div>}

      <form onSubmit={handleSubmit} className="app-form-card">
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Titel</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="z. B. Heizung prüfen"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Priorität</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Niedrig">Niedrig</option>
              <option value="Mittel">Mittel</option>
              <option value="Hoch">Hoch</option>
            </select>
          </div>

          <div className="form-field form-field--full">
            <label className="form-label">Beschreibung</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input form-textarea"
              placeholder="Beschreibe die Aufgabe..."
            />
          </div>

          <div className="form-field">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Offen">Offen</option>
              <option value="In Bearbeitung">In Bearbeitung</option>
              <option value="Erledigt">Erledigt</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSaving}
            className="task-btn task-btn--primary"
          >
            {isSaving ? "Speichert..." : "Aufgabe erstellen"}
          </button>
        </div>
      </form>
    </div>
  );
}
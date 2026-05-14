import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";

export default function CommentForm({ taskId, userId, onSubmit }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim()) {
      setError("Kommentar darf nicht leer sein.");
      return;
    }

    setError("");
    setLoading(true);

    const result = await onSubmit({
      task_id: taskId,
      user_id: userId,
      content: content.trim(),
    });

    if (result.error) {
      setError(result.error.message || "Kommentar konnte nicht gespeichert werden.");
      setLoading(false);
      return;
    }

    setContent("");
    setLoading(false);
  };

  return (
    <Card title="Kommentar hinzufügen">
      <form className="form" onSubmit={handleSubmit}>
        <Input
          label="Kommentar"
          multiline
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        {error ? <p className="form-error form-error--block">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Speichere..." : "Kommentar speichern"}
        </Button>
      </form>
    </Card>
  );
}
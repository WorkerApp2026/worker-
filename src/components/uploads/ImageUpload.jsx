import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function ImageUpload({ taskId, uploadedBy, onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Bitte zuerst ein Bild auswählen.");
      return;
    }

    setError("");
    setLoading(true);

    const result = await onUpload({
      taskId,
      file,
      uploadedBy,
    });

    if (result.error) {
      setError(result.error.message || "Upload fehlgeschlagen.");
      setLoading(false);
      return;
    }

    setFile(null);
    event.target.reset();
    setLoading(false);
  };

  return (
    <Card title="Foto hochladen">
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />

        {error ? <p className="form-error form-error--block">{error}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Lade hoch..." : "Bild hochladen"}
        </Button>
      </form>
    </Card>
  );
}
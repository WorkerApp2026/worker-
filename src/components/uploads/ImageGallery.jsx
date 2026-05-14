import Card from "../ui/Card";
import Loader from "../ui/Loader";
import formatDate from "../../utils/formatDate";

export default function ImageGallery({ images, loading, error }) {
  return (
    <Card title="Bilder">
      {loading ? <Loader label="Bilder laden..." /> : null}
      {error ? <p className="form-error form-error--block">{error}</p> : null}

      {!loading && !images.length ? <p>Noch keine Bilder vorhanden.</p> : null}

      <div className="image-gallery">
        {images.map((image) => (
          <figure key={image.id} className="image-gallery__item">
            <img src={image.file_url} alt="Aufgabenbild" className="image-gallery__img" />
            <figcaption className="muted">
              {formatDate(image.created_at)}
            </figcaption>
          </figure>
        ))}
      </div>
    </Card>
  );
}
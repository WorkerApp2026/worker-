export default function Modal({ open, title, children, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal__header">
          <h3>{title}</h3>
          <button type="button" className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
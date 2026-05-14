export default function Card({ title, actions, children, className = "" }) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || actions) && (
        <div className="card__header">
          {title ? <h3 className="card__title">{title}</h3> : <div />}
          {actions ? <div className="card__actions">{actions}</div> : null}
        </div>
      )}
      <div className="card__body">{children}</div>
    </section>
  );
}
export default function EmptyState({ title, description, action }) {
  return (
    <section className="panel panel--light empty-state">
      <h3 className="section-title">{title}</h3>
      <p className="body-text body-text--muted">{description}</p>
      {action}
    </section>
  );
}

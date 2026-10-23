import { Link } from 'react-router-dom';

export function NotFoundPage({ title = 'Page not found', message }: { title?: string; message?: string }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {message && <p className="muted">{message}</p>}
      <Link to="/" className="btn">
        Back to orders
      </Link>
    </section>
  );
}

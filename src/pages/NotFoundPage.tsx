import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="inner missing">
      <h1>Page not found</h1>
      <p>This address is not part of the portfolio.</p>
      <p>
        <Link className="connect" to="/">
          Back to home
        </Link>
      </p>
    </main>
  );
}

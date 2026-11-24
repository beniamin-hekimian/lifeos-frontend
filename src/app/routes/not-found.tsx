import { Link } from "react-router";

export function NotFoundRoute() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">404</h1>
      <p>Page not found</p>
      <Link to="/" className="underline">
        Go home
      </Link>
    </div>
  );
}

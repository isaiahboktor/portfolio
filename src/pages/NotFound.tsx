import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <h1 className="font-display text-3xl tracking-tight">404</h1>
      <p className="text-zinc-300 mt-2">That page doesn’t exist.</p>
      <Link to="/projects" className="text-teal-300 mt-4 inline-block">
        Go to projects →
      </Link>
    </div>
  );
}

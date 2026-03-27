import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-[var(--color-primary)] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-[var(--color-dark)] mb-4">
        Page Not Found
      </h2>
      <p className="text-[var(--color-dark)]/70 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
      >
        Back to Homepage
      </Link>
    </div>
  );
}

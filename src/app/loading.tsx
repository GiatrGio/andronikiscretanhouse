export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          {/* Spinner */}
          <div className="absolute inset-0 border-4 border-[var(--color-primary)]/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
        <p className="text-[var(--color-charcoal-light)] font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}

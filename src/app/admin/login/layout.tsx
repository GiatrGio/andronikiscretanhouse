export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
      {children}
    </div>
  );
}

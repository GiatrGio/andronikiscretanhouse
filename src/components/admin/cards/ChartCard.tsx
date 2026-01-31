interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function ChartCard({
  title,
  description,
  children,
}: ChartCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <div className="mb-4">
        <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[var(--color-charcoal-light)]">
            {description}
          </p>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

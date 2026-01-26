import Image from "next/image";
import Link from "next/link";

interface CardProps {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "featured" | "compact";
}

export default function Card({
  title,
  description,
  imageSrc,
  imageAlt,
  href,
  children,
  className = "",
  variant = "default",
}: CardProps) {
  const variantStyles = {
    default: "bg-white rounded-xl shadow-md hover:shadow-lg",
    featured: "bg-white rounded-2xl shadow-lg hover:shadow-xl",
    compact: "bg-white rounded-lg shadow hover:shadow-md",
  };

  const content = (
    <div
      className={`overflow-hidden transition-all duration-300 ${variantStyles[variant]} ${className}`}
    >
      {imageSrc && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-5 md:p-6">
        <h3 className="font-heading text-xl md:text-2xl font-bold text-[var(--color-charcoal)] mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-[var(--color-charcoal-light)] leading-relaxed">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    );
  }

  return content;
}

interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function CardGrid({
  children,
  columns = 3,
  className = "",
}: CardGridProps) {
  const columnStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid gap-6 md:gap-8 ${columnStyles[columns]} ${className}`}>
      {children}
    </div>
  );
}

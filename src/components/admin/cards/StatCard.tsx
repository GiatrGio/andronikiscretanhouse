import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
}: StatCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-[var(--color-charcoal-light)]",
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-charcoal-light)] mb-1">
            {title}
          </p>
          <p className="text-4xl font-bold text-[var(--color-charcoal)] mb-2">
            {value}
          </p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm ${trendColors[trend]}`}>
              {trend === "up" && <TrendingUp className="w-4 h-4" />}
              {trend === "down" && <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-[var(--color-primary)]/10">
          <Icon className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
      </div>
    </div>
  );
}

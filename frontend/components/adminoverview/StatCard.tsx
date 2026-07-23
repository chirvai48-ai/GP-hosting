import { LucideIcon } from "lucide-react";
import { CHART_COLORS, ChartColorName } from "./chartColors";

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "teal",
  hint,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: ChartColorName;
  hint?: string;
}) {
  const hex = CHART_COLORS[color];
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--color-container-low)] bg-white p-4 transition-shadow hover:shadow-sm">
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${hex}1a`, color: hex }}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <p className="text-2xl font-[var(--font-headline)] text-[var(--color-on-surface)] leading-tight">
            {value}
          </p>
          {hint && (
            <span className="text-[11px] font-[var(--font-label)] text-[var(--color-on-surface-variant)]">
              {hint}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--color-on-surface-variant)] font-[var(--font-label)] truncate">
          {label}
        </p>
      </div>
    </div>
  );
}

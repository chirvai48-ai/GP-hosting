import { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--color-container-low)] bg-white p-4">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-[var(--font-headline)] text-[var(--color-on-surface)] leading-tight">
          {value}
        </p>
        <p className="text-xs text-[var(--color-on-surface-variant)] font-[var(--font-label)] truncate">
          {label}
        </p>
      </div>
    </div>
  );
}

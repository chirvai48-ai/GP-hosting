"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CHART_COLORS } from "./chartColors";

const STATUS_ORDER = ["Published", "Draft", "Closed", "Archived"];
const STATUS_COLORS: Record<string, string> = {
  Published: CHART_COLORS.teal,
  Draft: CHART_COLORS.gold,
  Closed: CHART_COLORS.coral,
  Archived: CHART_COLORS.slate,
};

export default function VacancyStatusChart({ statusCounts }: { statusCounts: Record<string, number> }) {
  const data = STATUS_ORDER.map((status) => ({
    status,
    count: statusCounts[status] ?? 0,
  })).filter((d) => d.count > 0);

  return (
    <div className="rounded-lg border border-[var(--color-container-low)] bg-white p-4">
      <h2 className="text-sm font-[var(--font-label)] font-medium text-[var(--color-on-surface)] mb-3">
        Vacancies by Status
      </h2>
      {data.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center text-xs text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
          No vacancies yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" innerRadius={45} outerRadius={75}>
              {data.map((d) => (
                <Cell key={d.status} fill={STATUS_COLORS[d.status]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

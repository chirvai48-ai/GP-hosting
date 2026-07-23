"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function TrendChart({
  weeklyTrend,
}: {
  weeklyTrend: { weekStart: string; count: number }[];
}) {
  const data = weeklyTrend.map((w) => ({
    week: new Date(w.weekStart).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    count: w.count,
  }));

  return (
    <div className="rounded-lg border border-[var(--color-container-low)] bg-white p-4">
      <h2 className="text-sm font-[var(--font-label)] font-medium text-[var(--color-on-surface)] mb-3">
        Applications Over Time
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-container-low)" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="var(--color-secondary)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

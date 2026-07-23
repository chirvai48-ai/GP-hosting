"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { CHART_COLORS } from "./chartColors";

const STAGE_ORDER = ["Pending", "ApplicantCalled", "InterviewScheduling", "Hired", "Rejected"];
const STAGE_LABELS: Record<string, string> = {
  Pending: "Pending",
  ApplicantCalled: "Called",
  InterviewScheduling: "Interviewing",
  Hired: "Hired",
  Rejected: "Rejected",
};
const STAGE_COLORS: Record<string, string> = {
  Pending: CHART_COLORS.slate,
  ApplicantCalled: CHART_COLORS.blue,
  InterviewScheduling: CHART_COLORS.gold,
  Hired: CHART_COLORS.teal,
  Rejected: CHART_COLORS.coral,
};

export default function PipelineChart({ stageCounts }: { stageCounts: Record<string, number> }) {
  const data = STAGE_ORDER.map((stage) => ({
    stage: STAGE_LABELS[stage],
    count: stageCounts[stage] ?? 0,
    fill: STAGE_COLORS[stage],
  }));

  return (
    <div className="rounded-lg border border-[var(--color-container-low)] bg-white p-4">
      <h2 className="text-sm font-[var(--font-label)] font-medium text-[var(--color-on-surface)] mb-3">
        Application Pipeline
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-container-low)" />
          <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.stage} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

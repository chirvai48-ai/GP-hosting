import { CHART_COLORS } from "./chartColors";

interface Row {
  label: string;
  count: number;
  color: string;
}

export default function MessageQueueCard({
  openContactRequests,
  newCandidateInquiries,
  movedToTalentPool,
}: {
  openContactRequests: number;
  newCandidateInquiries: number;
  movedToTalentPool: number;
}) {
  const rows: Row[] = [
    { label: "Open Company Inquiries", count: openContactRequests, color: CHART_COLORS.blue },
    { label: "New Candidate Submissions", count: newCandidateInquiries, color: CHART_COLORS.gold },
    { label: "Moved to Talent Pool", count: movedToTalentPool, color: CHART_COLORS.plum },
  ];
  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <div className="rounded-lg border border-[var(--color-container-low)] bg-white p-4">
      <h2 className="text-sm font-[var(--font-label)] font-medium text-[var(--color-on-surface)] mb-3">
        Message Queue
      </h2>
      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-2 text-xs font-[var(--font-label)] text-[var(--color-on-surface-variant)]">
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: row.color }}
                />
                {row.label}
              </span>
              <span className="text-sm font-[var(--font-headline)] text-[var(--color-on-surface)]">
                {row.count}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[var(--color-container-low)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(row.count / max) * 100}%`, backgroundColor: row.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

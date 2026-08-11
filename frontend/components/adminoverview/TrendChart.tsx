"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { adminFetch } from "@/lib/adminFetch";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Granularity = "monthly" | "quarterly" | "yearly";

interface TrendResponse {
  granularity: Granularity;
  year: number;
  month?: number;
  quarter?: number;
  trend: { label: string; count: number }[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const now = new Date();
const CURRENT_YEAR = now.getUTCFullYear();
const CURRENT_MONTH = now.getUTCMonth() + 1;
const CURRENT_QUARTER = Math.ceil(CURRENT_MONTH / 3);
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

async function getTrend(params: {
  granularity: Granularity;
  year: number;
  month: number;
  quarter: number;
}): Promise<{ data: TrendResponse }> {
  const search = new URLSearchParams({
    granularity: params.granularity,
    year: String(params.year),
  });
  if (params.granularity === "monthly") search.set("month", String(params.month));
  if (params.granularity === "quarterly") search.set("quarter", String(params.quarter));

  const res = await adminFetch(`${API_URL}/api/applications/trend?${search.toString()}`);
  if (!res.ok) throw new Error("Failed to load application trend");
  return res.json();
}

function formatLabel(label: string, granularity: Granularity): string {
  if (granularity === "yearly") {
    // label is "YYYY-MM"
    const [, m] = label.split("-").map(Number);
    return MONTH_NAMES[m - 1].slice(0, 3);
  }
  // monthly ("YYYY-MM-DD") and quarterly ("YYYY-MM-DD", week-start) both format as a date
  const d = new Date(`${label}T00:00:00Z`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
}

const selectCls =
  "text-xs font-[var(--font-label)] border border-[var(--color-container-low)] rounded px-2 py-1 bg-white text-[var(--color-on-surface)]";

export default function TrendChart() {
  const [granularity, setGranularity] = useState<Granularity>("monthly");
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [quarter, setQuarter] = useState(CURRENT_QUARTER);

  const { data, isPending, isError } = useQuery({
    queryKey: ["applications", "trend", granularity, year, month, quarter],
    queryFn: () => getTrend({ granularity, year, month, quarter }),
  });

  const chartData = useMemo(
    () =>
      (data?.data.trend ?? []).map((point) => ({
        label: formatLabel(point.label, granularity),
        count: point.count,
      })),
    [data, granularity]
  );

  return (
    <div className="rounded-lg border border-[var(--color-container-low)] bg-white p-4">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <h2 className="text-sm font-[var(--font-label)] font-medium text-[var(--color-on-surface)]">
          Applications Over Time
        </h2>

        <div className="flex items-center gap-2">
          <select
            className={selectCls}
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as Granularity)}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>

          {granularity === "monthly" && (
            <select className={selectCls} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {MONTH_NAMES.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          )}

          {granularity === "quarterly" && (
            <select className={selectCls} value={quarter} onChange={(e) => setQuarter(Number(e.target.value))}>
              <option value={1}>Q1 (Jan–Mar)</option>
              <option value={2}>Q2 (Apr–Jun)</option>
              <option value={3}>Q3 (Jul–Sep)</option>
              <option value={4}>Q4 (Oct–Dec)</option>
            </select>
          )}

          <select className={selectCls} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isError ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-red-500 font-[var(--font-label)]">
          Failed to load trend data.
        </div>
      ) : isPending ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
          Loading…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-container-low)" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
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
      )}
    </div>
  );
}

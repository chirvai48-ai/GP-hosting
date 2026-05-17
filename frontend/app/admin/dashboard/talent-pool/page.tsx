"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import type { Application, ApplicationsResponse } from "@/types/table";

const ApplicationDetailModal = dynamic(
  () => import("@/components/adminapplication/ApplicationDetailModal"),
  { ssr: false }
);

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const RESIDENCE_LABELS: Record<string, string> = {
  Permanent_Resident: "Permanent Resident",
  Work_Visa: "Work Visa",
  Student_Visa: "Student Visa",
  Spouse_Visa: "Spouse Visa",
  Other: "Other",
};

async function fetchTalentPool(): Promise<ApplicationsResponse> {
  const res = await fetch(`${API_URL}/api/applications/talent-pool`);
  if (!res.ok) throw new Error("Failed to load talent pool");
  return res.json();
}

const columnHelper = createColumnHelper<Application>();

export default function TalentPoolPage() {
  const [viewing, setViewing] = useState<Application | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["talent-pool"],
    queryFn: fetchTalentPool,
  });

  const applications = useMemo(() => data?.data ?? [], [data]);

  const columns = useMemo(() => [
    columnHelper.accessor("full_name", {
      header: "Name",
      cell: ({ row, getValue }) => (
        <button
          onClick={() => setViewing(row.original)}
          className="text-left text-[var(--color-primary)] hover:underline font-[var(--font-label)]"
        >
          {getValue() as string}
        </button>
      ),
    }),
    columnHelper.accessor("email", { header: "Email", size: 200 }),
    columnHelper.accessor("phone_number", { header: "Phone", size: 140 }),
    columnHelper.accessor((row) => row.job?.title ?? "—", {
      id: "vacancy",
      header: "Original vacancy",
      size: 200,
      cell: ({ row, getValue }) => {
        const job = row.original.job;
        if (!job) return getValue() as string;
        return (
          <Link
            href={`/admin/dashboard/applications/${job.id}`}
            prefetch={false}
            className="text-[var(--color-secondary)] hover:underline inline-flex items-center gap-1 font-[var(--font-label)]"
          >
            {job.title} <ExternalLink size={11} />
          </Link>
        );
      },
    }),
    columnHelper.accessor("residence_status", {
      header: "Residence",
      size: 140,
      cell: ({ getValue }) => {
        const v = getValue() as string | null;
        return v ? RESIDENCE_LABELS[v] ?? v : "—";
      },
    }),
    columnHelper.accessor("japanese_ability", {
      header: "JP",
      size: 70,
      cell: ({ getValue }) => (getValue() as string) ?? "—",
    }),
    columnHelper.accessor("updated_at", {
      header: "Added",
      size: 110,
      cell: ({ getValue }) => {
        const v = getValue() as string | undefined;
        return v ? new Date(v).toLocaleDateString() : "—";
      },
    }),
    columnHelper.accessor("resume_url", {
      header: "Resume",
      size: 100,
      cell: ({ getValue }) => {
        const url = getValue() as string | undefined;
        if (!url) return <span className="text-xs text-gray-400">—</span>;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[var(--color-secondary)] hover:underline font-[var(--font-label)]"
          >
            View <ExternalLink size={12} />
          </a>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      size: 100,
      cell: ({ row }) => (
        <button
          onClick={() => setViewing(row.original)}
          className="px-3 py-1 text-xs rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] font-[var(--font-label)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
        >
          View
        </button>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-48 text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
        Loading talent pool…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-48 text-red-500 font-[var(--font-label)]">
        Failed to load talent pool.
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl text-[var(--color-on-surface)] font-[var(--font-headline)]">
          Talent Pool
        </h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] font-[var(--font-label)] mt-1 mb-4">
          {applications.length}{" "}
          {applications.length === 1 ? "applicant" : "applicants"} kept for future
          roles. Use "Restore to vacancy" inside an entry to bring them back to
          the original vacancy's list.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--color-container-low)]">
        <table className="w-full text-sm border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-[var(--color-primary)]">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-white font-[var(--font-label)] whitespace-nowrap border-r border-[var(--color-on-surface)] last:border-r-0"
                  >
                    {!header.isPlaceholder &&
                      flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[var(--color-on-surface-variant)] font-[var(--font-label)]"
                >
                  No applicants in the talent pool.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-[var(--color-container-low)] transition-colors ${
                    i % 2 === 0
                      ? "bg-white hover:bg-[var(--color-container-low)]"
                      : "bg-[var(--color-surface)] hover:bg-[var(--color-container-low)]"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2.5 text-[var(--color-on-surface)] font-[var(--font-body)] border-r border-[var(--color-container-low)] last:border-r-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <ApplicationDetailModal
          application={viewing}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}

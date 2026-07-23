"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { Job, JobsResponse } from "@/types/table";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { adminFetch } from "@/lib/adminFetch";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getJobs(): Promise<JobsResponse> {
  const res = await adminFetch(`${API_URL}/api/jobs`);
  if (!res.ok) throw new Error("Failed to load jobs");
  return res.json();
}

async function getNewCountsByJob(): Promise<Record<number, number>> {
  const res = await adminFetch(`${API_URL}/api/applications/new-counts-by-job`);
  if (!res.ok) throw new Error("Failed to load new-application counts");
  const json = await res.json();
  return json.data ?? {};
}

const columnHelper = createColumnHelper<Job>();

const CONTRACT_LABEL: Record<string, string> = {
  Full_time: "Full-time",
  Part_time: "Part-time",
  Internship: "Internship",
  Flexible: "Flexible",
};

const STATUS_STYLES: Record<string, string> = {
  Draft: "bg-[#FAEEDA] text-[#854F0B]",
  Published: "bg-[#EAF3DE] text-[#3B6D11]",
  Closed: "bg-[#ec817e] text-white",
  Archived: "bg-[#F1EFE8] text-[#5F5E5A]",
};

export default function ApplicationsVacancyList() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  const { data: newCounts = {} } = useQuery({
    queryKey: ["applications", "new-counts-by-job"],
    queryFn: getNewCountsByJob,
  });

  const jobs = useMemo(
    () => (data?.data ?? []).filter((j) => j.status === "Published"),
    [data]
  );

  const columns = useMemo(() => [
    columnHelper.accessor("id", { header: "ID", size: 60 }),
    columnHelper.accessor("title", {
      header: "Job Title",
      cell: ({ row, getValue }) => {
        const newCount = newCounts[row.original.id] ?? 0;
        return (
          <span className="flex items-center gap-1.5">
            {newCount > 0 && (
              <span
                className="flex-shrink-0 rounded-full bg-[#c0392b] text-white text-[10px] font-semibold px-1.5 py-0.5 leading-none"
                title={`${newCount} new since your last visit`}
              >
                {newCount} new
              </span>
            )}
            {getValue()}
          </span>
        );
      },
    }),
    columnHelper.accessor("location", { header: "Location", size: 140 }),
    columnHelper.accessor((row) => row.job_category?.name ?? "—", {
      id: "category",
      header: "Category",
      size: 140,
    }),
    columnHelper.accessor("contract", {
      header: "Contract",
      size: 110,
      cell: ({ getValue }) => CONTRACT_LABEL[getValue() as string] ?? getValue(),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      size: 100,
      cell: ({ getValue }) => {
        const s = getValue() as string;
        return (
          <span
            className={`${STATUS_STYLES[s] ?? "bg-gray-100 text-gray-600"} text-[11px] px-2 py-0.5 rounded font-medium font-[var(--font-label)]`}
          >
            {s}
          </span>
        );
      },
    }),
    columnHelper.accessor((row) => row._count?.applications ?? 0, {
      id: "applicants",
      header: "Applications",
      size: 110,
      cell: ({ getValue }) => (
        <span className="inline-flex items-center justify-center min-w-[2rem] text-[11px] px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#0F6E56] font-[var(--font-label)] font-semibold">
          {getValue() as number}
        </span>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: "Posted",
      size: 120,
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      size: 180,
      cell: ({ row }) => (
        <Link
          href={`/admin/dashboard/applications/${row.original.id}`}
          prefetch={false}
          className="inline-block px-3 py-1 text-xs rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] font-[var(--font-label)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
        >
          View applications →
        </Link>
      ),
    }),
  ], [newCounts]);

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-48 text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
        Loading vacancies…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-48 text-red-500 font-[var(--font-label)]">
        Failed to load vacancies.
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl text-[var(--color-on-surface)] font-[var(--font-headline)]">
          Applications
        </h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] font-[var(--font-label)] mt-1 mb-4">
          {jobs.length} published {jobs.length === 1 ? "vacancy" : "vacancies"} — pick one to see its applicants
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
            {jobs.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[var(--color-on-surface-variant)] font-[var(--font-label)]"
                >
                  No published vacancies yet.
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
    </div>
  );
}

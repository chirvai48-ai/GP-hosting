"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type {
  Application,
  ApplicationsResponse,
  ApplicationStage,
  ApplicationStatus,
  Job,
} from "@/types/table";
import ApplicationDetailModal from "./ApplicationDetailModal";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const STAGE_OPTIONS: ApplicationStage[] = ["Pending", "ApplicantCalled", "InterviewScheduling", "Hired"];
const STATUS_OPTIONS: ApplicationStatus[] = ["Active", "OnHold", "TalentPool", "Rejected"];

const STAGE_STYLES: Record<ApplicationStage, string> = {
  Pending: "bg-[#FAEEDA] text-[#854F0B]",
  ApplicantCalled: "bg-[#E6F1FB] text-[#185FA5]",
  InterviewScheduling: "bg-[#F0E8F4] text-[#6B1E6B]",
  Hired: "bg-[#EAF3DE] text-[#3B6D11]",
};

const STAGE_LABELS: Record<ApplicationStage, string> = {
  Pending: "Pending",
  ApplicantCalled: "Applicant called",
  InterviewScheduling: "Interview",
  Hired: "Hired",
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Active: "bg-[#E1F5EE] text-[#0F6E56]",
  OnHold: "bg-[#FAEEDA] text-[#854F0B]",
  TalentPool: "bg-[#E6F1FB] text-[#185FA5]",
  Rejected: "bg-[#ec817e] text-white",
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  Active: "Active",
  OnHold: "On hold",
  TalentPool: "Talent pool",
  Rejected: "Rejected",
};

const RESIDENCE_LABELS: Record<string, string> = {
  Permanent_Resident: "Permanent Resident",
  Work_Visa: "Work Visa",
  Student_Visa: "Student Visa",
  Spouse_Visa: "Spouse Visa",
  Other: "Other",
};

async function fetchApplications(jobId: number): Promise<ApplicationsResponse> {
  const res = await fetch(`${API_URL}/api/applications?job_id=${jobId}`);
  if (!res.ok) throw new Error("Failed to load applications");
  return res.json();
}

async function fetchJob(id: number): Promise<Job | null> {
  const res = await fetch(`${API_URL}/api/jobs/${id}`);
  if (!res.ok) return null;
  const json = await res.json();
  return (json?.data ?? null) as Job | null;
}

async function patchApplication({
  id,
  changes,
}: {
  id: number;
  changes: Partial<{ stage: ApplicationStage; status: ApplicationStatus }>;
}) {
  const res = await fetch(`${API_URL}/api/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.formErrors?.[0] || "Failed to update application");
  }
  return res.json();
}

async function deleteApplication(id: number) {
  const res = await fetch(`${API_URL}/api/applications/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete application");
  return res.json();
}

const columnHelper = createColumnHelper<Application>();

export default function AdminApplicationsTable({ jobId }: { jobId: number }) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewing, setViewing] = useState<Application | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["applications", jobId],
    queryFn: () => fetchApplications(jobId),
  });

  const { data: job } = useQuery({
    queryKey: ["job-public", jobId],
    queryFn: () => fetchJob(jobId),
  });

  const patchMutation = useMutation({
    mutationFn: patchApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications", jobId] }),
    onError: (err) => alert((err as Error).message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", jobId] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => alert((err as Error).message),
  });

  const applications = data?.data ?? [];

  const columns = [
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
    columnHelper.accessor("created_at", {
      header: "Applied",
      size: 110,
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
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
    columnHelper.accessor("stage", {
      header: "Stage",
      size: 150,
      cell: ({ row, getValue }) => {
        const current = getValue() as ApplicationStage;
        return (
          <select
            value={current}
            disabled={patchMutation.isPending}
            onChange={(e) =>
              patchMutation.mutate({
                id: row.original.id,
                changes: { stage: e.target.value as ApplicationStage },
              })
            }
            className={`${STAGE_STYLES[current]} text-[11px] px-2 py-0.5 rounded font-medium font-[var(--font-label)] border-0 outline-none cursor-pointer disabled:opacity-50`}
          >
            {STAGE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABELS[s]}
              </option>
            ))}
          </select>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      size: 130,
      cell: ({ row, getValue }) => {
        const current = getValue() as ApplicationStatus;
        return (
          <select
            value={current}
            disabled={patchMutation.isPending}
            onChange={(e) =>
              patchMutation.mutate({
                id: row.original.id,
                changes: { status: e.target.value as ApplicationStatus },
              })
            }
            className={`${STATUS_STYLES[current]} text-[11px] px-2 py-0.5 rounded font-medium font-[var(--font-label)] border-0 outline-none cursor-pointer disabled:opacity-50`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      size: 160,
      cell: ({ row }) => {
        const app = row.original;
        if (deletingId === app.id) {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  deleteMutation.mutate(app.id);
                  setDeletingId(null);
                }}
                className="px-3 py-1 text-xs rounded bg-red-600 text-white font-[var(--font-label)] hover:opacity-90"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1 text-xs rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)]"
              >
                Cancel
              </button>
            </div>
          );
        }
        return (
          <div className="flex gap-2">
            <button
              onClick={() => setViewing(app)}
              className="px-3 py-1 text-xs rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] font-[var(--font-label)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
            >
              View
            </button>
            <button
              onClick={() => setDeletingId(app.id)}
              className="px-3 py-1 text-xs rounded border border-red-500 text-red-500 font-[var(--font-label)] hover:bg-red-500 hover:text-white transition-colors"
            >
              Delete
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-48 text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
        Loading applications…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-48 text-red-500 font-[var(--font-label)]">
        Failed to load applications.
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen">
      <div className="mb-6">
        <Link
          href="/admin/dashboard/applications"
          className="inline-flex items-center gap-1 text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] font-[var(--font-label)] mb-3"
        >
          <ArrowLeft size={14} /> All vacancies
        </Link>
        <h1 className="text-3xl text-[var(--color-on-surface)] font-[var(--font-headline)]">
          {job?.title ?? "Applications"}
        </h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] font-[var(--font-label)] mt-1 mb-4">
          {applications.length} {applications.length === 1 ? "applicant" : "applicants"}
          {job?.location ? ` · ${job.location}` : ""}
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
                  No applications yet.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-[var(--color-container-low)] transition-colors ${
                    deletingId === row.original.id
                      ? "bg-red-50"
                      : i % 2 === 0
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

      <ApplicationDetailModal
        application={viewing}
        onClose={() => setViewing(null)}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLastSeen, markSeen } from "@/lib/lastSeen";
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
  ApplicationStatsResponse,
  ApplicationStatus,
  CvCreationStatus,
  Job,
} from "@/types/table";
import { adminFetch } from "@/lib/adminFetch";
import { PaginationControls } from "@/components/Reusables/PaginationControls";

const ApplicationDetailModal = dynamic(() => import("./ApplicationDetailModal"), {
  ssr: false,
});

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const STAGE_OPTIONS: ApplicationStage[] = [
  "Pending",
  "ApplicantCalled",
  "InterviewScheduling",
  "Hired",
  "Rejected",
];

const PIPELINE_STAGES: ApplicationStage[] = [
  "Pending",
  "ApplicantCalled",
  "InterviewScheduling",
  "Hired",
];

// Status dropdown only shows Active / OnHold. TalentPool is set via the modal action.
const STATUS_DROPDOWN_OPTIONS: ApplicationStatus[] = ["Active", "OnHold"];

const STAGE_TAB_STYLES: Record<ApplicationStage, string> = {
  Pending: "bg-[#FAEEDA] text-[#854F0B] border-[#854F0B]",
  ApplicantCalled: "bg-[#E6F1FB] text-[#185FA5] border-[#185FA5]",
  InterviewScheduling: "bg-[#F0E8F4] text-[#6B1E6B] border-[#6B1E6B]",
  Hired: "bg-[#EAF3DE] text-[#3B6D11] border-[#3B6D11]",
  Rejected: "bg-[#ec817e] text-white border-[#ec817e]",
};

const STAGE_LABELS: Record<ApplicationStage, string> = {
  Pending: "Pending",
  ApplicantCalled: "Called",
  InterviewScheduling: "Interview",
  Hired: "Hired",
  Rejected: "Rejected",
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Active: "bg-[#E1F5EE] text-[#0F6E56]",
  OnHold: "bg-[#FAEEDA] text-[#854F0B]",
  TalentPool: "bg-[#E6F1FB] text-[#185FA5]",
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  Active: "Active",
  OnHold: "On hold",
  TalentPool: "Talent pool",
};

const CV_CREATION_OPTIONS: CvCreationStatus[] = ["Pending", "OnProgress", "Completed", "OnHold"];

const CV_CREATION_STYLES: Record<CvCreationStatus, string> = {
  Pending: "bg-[#FAEEDA] text-[#854F0B]",
  OnProgress: "bg-[#E6F1FB] text-[#185FA5]",
  Completed: "bg-[#EAF3DE] text-[#3B6D11]",
  OnHold: "bg-[#F0E8F4] text-[#6B1E6B]",
};

const CV_CREATION_LABELS: Record<CvCreationStatus, string> = {
  Pending: "Pending",
  OnProgress: "On progress",
  Completed: "Completed",
  OnHold: "On hold",
};

const RESIDENCE_LABELS: Record<string, string> = {
  Permanent_Resident: "Permanent Resident",
  Work_Visa: "Work Visa",
  Student_Visa: "Student Visa",
  Spouse_Visa: "Spouse Visa",
  Other: "Other",
};

async function fetchApplications(
  jobId: number,
  stage: ApplicationStage,
  page: number,
  limit: number
): Promise<ApplicationsResponse> {
  const params = new URLSearchParams({
    job_id: String(jobId),
    page: String(page),
    limit: String(limit),
  });
  params.set("stage", stage);
  const res = await adminFetch(`${API_URL}/api/applications?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load applications");
  return res.json();
}

async function fetchApplicationStats(jobId: number): Promise<ApplicationStatsResponse> {
  const res = await adminFetch(`${API_URL}/api/applications/stats?job_id=${jobId}`);
  if (!res.ok) throw new Error("Failed to load application stats");
  return res.json();
}

async function fetchJob(id: number): Promise<Job | null> {
  const res = await adminFetch(`${API_URL}/api/jobs/${id}`);
  if (!res.ok) return null;
  const json = await res.json();
  return (json?.data ?? null) as Job | null;
}

async function patchApplication({
  id,
  changes,
}: {
  id: number;
  changes: Partial<{
    stage: ApplicationStage;
    status: ApplicationStatus;
    cv_creation_status: CvCreationStatus;
  }>;
}) {
  const res = await adminFetch(`${API_URL}/api/applications/${id}`, {
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
  const res = await adminFetch(`${API_URL}/api/applications/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete application");
  return res.json();
}

const columnHelper = createColumnHelper<Application>();

export default function AdminApplicationsTable({ jobId }: { jobId: number }) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewing, setViewing] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<ApplicationStage>("Pending");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  // undefined = not loaded yet (show no dots); null = loaded, never seen before (everything is new)
  const [lastSeenSnapshot, setLastSeenSnapshot] = useState<string | null | undefined>(undefined);
  const hasMarkedSeen = useRef(false);

  useEffect(() => {
    if (hasMarkedSeen.current) return;
    hasMarkedSeen.current = true;
    getLastSeen()
      .then(({ data }) => setLastSeenSnapshot(data.lastSeenApplicationsAt))
      .then(() => markSeen("applications"))
      .catch(() => {});
  }, []);

  const { data, isPending, isError } = useQuery({
    queryKey: ["applications", jobId, activeTab, page, limit],
    queryFn: () => fetchApplications(jobId, activeTab, page, limit),
  });

  const { data: statsData } = useQuery({
    queryKey: ["applications-stats", jobId],
    queryFn: () => fetchApplicationStats(jobId),
  });

  const { data: job } = useQuery({
    queryKey: ["job-public", jobId],
    queryFn: () => fetchJob(jobId),
  });

  const stepBackIfPageDrained = () => {
    if ((data?.data?.items?.length ?? 0) === 1 && page > 1) setPage((p) => p - 1);
  };

  const patchMutation = useMutation({
    mutationFn: patchApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", jobId] });
      queryClient.invalidateQueries({ queryKey: ["applications-stats", jobId] });
    },
    onError: (err) => alert((err as Error).message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      stepBackIfPageDrained();
      queryClient.invalidateQueries({ queryKey: ["applications", jobId] });
      queryClient.invalidateQueries({ queryKey: ["applications-stats", jobId] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => alert((err as Error).message),
  });

  const applications = data?.data?.items ?? [];
  const totalApplications = data?.data?.total ?? 0;

  const stageCounts = useMemo(() => {
    const counts: Record<ApplicationStage, number> = {
      Pending: 0,
      ApplicantCalled: 0,
      InterviewScheduling: 0,
      Hired: 0,
      Rejected: 0,
    };
    const incoming = statsData?.data?.stageCounts ?? {};
    for (const stage of Object.keys(counts) as ApplicationStage[]) {
      counts[stage] = incoming[stage] ?? 0;
    }
    return counts;
  }, [statsData]);

  const jobTotalApplicants = useMemo(
    () => Object.values(stageCounts).reduce((sum, n) => sum + n, 0),
    [stageCounts]
  );

  const columns = useMemo(() => [
    columnHelper.accessor("full_name", {
      header: "Name",
      cell: ({ row, getValue }) => {
        const isNew =
          lastSeenSnapshot !== undefined &&
          (lastSeenSnapshot === null ||
            new Date(row.original.created_at).getTime() > new Date(lastSeenSnapshot).getTime());
        return (
          <button
            onClick={() => setViewing(row.original)}
            className="flex items-center gap-1.5 text-left text-[var(--color-primary)] hover:underline font-[var(--font-label)]"
          >
            {isNew && (
              <span
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c0392b]"
                title="New since your last visit"
              />
            )}
            {getValue() as string}
          </button>
        );
      },
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
    columnHelper.accessor("cv_creation_status", {
      header: "CV creation",
      size: 130,
      cell: ({ row, getValue }) => {
        const current = getValue() as CvCreationStatus;
        return (
          <select
            value={current}
            disabled={patchMutation.isPending}
            onChange={(e) =>
              patchMutation.mutate({
                id: row.original.id,
                changes: { cv_creation_status: e.target.value as CvCreationStatus },
              })
            }
            className={`${CV_CREATION_STYLES[current]} text-[11px] px-2 py-0.5 rounded font-medium font-[var(--font-label)] border-0 outline-none cursor-pointer disabled:opacity-50`}
          >
            {CV_CREATION_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {CV_CREATION_LABELS[s]}
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
        // TalentPool is set only via the modal — render as read-only pill if encountered here.
        if (current === "TalentPool") {
          return (
            <span
              className={`${STATUS_STYLES[current]} text-[11px] px-2 py-0.5 rounded font-medium font-[var(--font-label)]`}
            >
              {STATUS_LABELS[current]}
            </span>
          );
        }
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
            {STATUS_DROPDOWN_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        );
      },
    }),
    columnHelper.display({
      id: "stage-nav",
      header: "Move stage",
      size: 210,
      cell: ({ row }) => {
        const stage = row.original.stage;
        const pIdx = PIPELINE_STAGES.indexOf(stage);
        const prev: ApplicationStage | null = pIdx > 0 ? PIPELINE_STAGES[pIdx - 1] : null;
        const next: ApplicationStage | null =
          pIdx >= 0 && pIdx < PIPELINE_STAGES.length - 1 ? PIPELINE_STAGES[pIdx + 1] : null;
        return (
          <div className="flex items-center gap-1.5">
            <button
              disabled={!prev || patchMutation.isPending}
              onClick={() => {
                if (!prev || !confirm(`Move to ${STAGE_LABELS[prev]}?`)) return;
                patchMutation.mutate({ id: row.original.id, changes: { stage: prev } });
              }}
              className="px-2 py-0.5 text-[11px] rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← {prev ? STAGE_LABELS[prev] : ""}
            </button>
            <button
              disabled={!next || patchMutation.isPending}
              onClick={() => {
                if (!next || !confirm(`Move to ${STAGE_LABELS[next]}?`)) return;
                patchMutation.mutate({ id: row.original.id, changes: { stage: next } });
              }}
              className="px-2 py-0.5 text-[11px] rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {next ? STAGE_LABELS[next] : ""} →
            </button>
          </div>
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
  ], [deletingId, patchMutation.isPending, lastSeenSnapshot]);

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
          {jobTotalApplicants} {jobTotalApplicants === 1 ? "applicant" : "applicants"} total
          {job?.location ? ` · ${job.location}` : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {STAGE_OPTIONS.map((stage) => {
          const active = stage === activeTab;
          const count = stageCounts[stage];
          return (
            <button
              key={stage}
              onClick={() => {
                setActiveTab(stage);
                setPage(1);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-[var(--font-label)] rounded-full border transition-colors ${
                active
                  ? STAGE_TAB_STYLES[stage]
                  : "bg-white text-[var(--color-on-surface-variant)] border-[#c0cbc9] hover:border-[var(--color-primary)]"
              }`}
            >
              {STAGE_LABELS[stage]}
              <span
                className={`inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full text-[10px] font-semibold ${
                  active ? "bg-white/30" : "bg-[var(--color-container-low)] text-[var(--color-on-surface-variant)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
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
                  No applicants in this stage.
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

      <PaginationControls
        page={page}
        limit={limit}
        total={totalApplications}
        onPageChange={setPage}
        onLimitChange={(n) => {
          setLimit(n);
          setPage(1);
        }}
      />

      {viewing && (
        <ApplicationDetailModal
          application={viewing}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}

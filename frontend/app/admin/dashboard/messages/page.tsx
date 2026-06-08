"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import type {
  CompanyInquiry,
  CompanyInquiriesResponse,
  CandidateInquiry,
  CandidateInquiriesResponse,
  ContactStatus,
  CandidateInquiryState,
} from "@/types/table";

const CompanyInquiryDetailModal = dynamic(
  () => import("@/components/admincontact/CompanyInquiryDetailModal"),
  { ssr: false }
);

const CandidateInquiryDetailModal = dynamic(
  () => import("@/components/admincontact/CandidateInquiryDetailModal"),
  { ssr: false }
);

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Tab = "company" | "candidate";

// ── Status / state badges ─────────────────────────────────────────────────────

const COMPANY_STATUS_STYLES: Record<ContactStatus, string> = {
  Open: "bg-gray-100 text-gray-600",
  Inprogress: "bg-blue-50 text-blue-700",
  Resolved: "bg-emerald-50 text-emerald-700",
  Closed: "bg-[var(--color-container-low)] text-[var(--color-on-surface-variant)]",
};

const CANDIDATE_STATE_STYLES: Record<CandidateInquiryState, string> = {
  New: "bg-gray-100 text-gray-600",
  Reviewing: "bg-blue-50 text-blue-700",
  MovedToTalentPool: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-600",
};

const CANDIDATE_STATE_LABELS: Record<CandidateInquiryState, string> = {
  New: "New",
  Reviewing: "Reviewing",
  MovedToTalentPool: "Talent pool",
  Rejected: "Rejected",
};

// ── Fetch functions ───────────────────────────────────────────────────────────

async function fetchCompanyInquiries(): Promise<CompanyInquiriesResponse> {
  const res = await fetch(`${API_URL}/api/contacts/company-inquiries`);
  if (!res.ok) throw new Error("Failed to load company inquiries");
  return res.json();
}

async function fetchCandidateInquiries(): Promise<CandidateInquiriesResponse> {
  const res = await fetch(`${API_URL}/api/contacts/candidate-inquiries`);
  if (!res.ok) throw new Error("Failed to load candidate submissions");
  return res.json();
}

// ── Column helpers ────────────────────────────────────────────────────────────

const companyHelper = createColumnHelper<CompanyInquiry>();
const candidateHelper = createColumnHelper<CandidateInquiry>();

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("company");
  const [viewingCompany, setViewingCompany] = useState<CompanyInquiry | null>(null);
  const [viewingCandidate, setViewingCandidate] = useState<CandidateInquiry | null>(null);

  // ── Company inquiries ──────────────────────────────────────────────────────

  const companyQuery = useQuery({
    queryKey: ["company-inquiries"],
    queryFn: fetchCompanyInquiries,
  });

  const companyData = useMemo(
    () => companyQuery.data?.data ?? [],
    [companyQuery.data]
  );

  const companyColumns = useMemo(
    () => [
      companyHelper.accessor("name", {
        header: "Name",
        cell: ({ row, getValue }) => (
          <button
            onClick={() => setViewingCompany(row.original)}
            className="text-left text-[var(--color-primary)] hover:underline font-[var(--font-label)]"
          >
            {getValue()}
          </button>
        ),
      }),
      companyHelper.accessor("email", { header: "Email" }),
      companyHelper.accessor("subject", {
        header: "Subject",
        cell: ({ getValue }) => (
          <span className="line-clamp-1 max-w-[200px]">{getValue()}</span>
        ),
      }),
      companyHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue }) => {
          const s = getValue() as ContactStatus;
          return (
            <span
              className={`px-2 py-0.5 text-[10px] rounded font-[var(--font-label)] font-semibold tracking-wide ${COMPANY_STATUS_STYLES[s]}`}
            >
              {s}
            </span>
          );
        },
      }),
      companyHelper.accessor("created_at", {
        header: "Received",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      }),
      companyHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={() => setViewingCompany(row.original)}
            className="px-3 py-1 text-xs rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] font-[var(--font-label)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
          >
            View
          </button>
        ),
      }),
    ],
    []
  );

  const companyTable = useReactTable({
    data: companyData,
    columns: companyColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // ── Candidate inquiries ────────────────────────────────────────────────────

  const candidateQuery = useQuery({
    queryKey: ["candidate-inquiries"],
    queryFn: fetchCandidateInquiries,
  });

  const candidateData = useMemo(
    () => candidateQuery.data?.data ?? [],
    [candidateQuery.data]
  );

  const candidateColumns = useMemo(
    () => [
      candidateHelper.accessor("full_name", {
        header: "Name",
        cell: ({ row, getValue }) => (
          <button
            onClick={() => setViewingCandidate(row.original)}
            className="text-left text-[var(--color-primary)] hover:underline font-[var(--font-label)]"
          >
            {getValue()}
          </button>
        ),
      }),
      candidateHelper.accessor("email", { header: "Email" }),
      candidateHelper.accessor("phone_number", { header: "Phone" }),
      candidateHelper.accessor("japanese_ability", {
        header: "JP",
        cell: ({ getValue }) => getValue() ?? "—",
      }),
      candidateHelper.accessor("state", {
        header: "State",
        cell: ({ getValue }) => {
          const s = getValue() as CandidateInquiryState;
          return (
            <span
              className={`px-2 py-0.5 text-[10px] rounded font-[var(--font-label)] font-semibold tracking-wide ${CANDIDATE_STATE_STYLES[s]}`}
            >
              {CANDIDATE_STATE_LABELS[s]}
            </span>
          );
        },
      }),
      candidateHelper.accessor("created_at", {
        header: "Received",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      }),
      candidateHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={() => setViewingCandidate(row.original)}
            className="px-3 py-1 text-xs rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] font-[var(--font-label)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
          >
            View
          </button>
        ),
      }),
    ],
    []
  );

  const candidateTable = useReactTable({
    data: candidateData,
    columns: candidateColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  const activeQuery = activeTab === "company" ? companyQuery : candidateQuery;
  const activeTable = activeTab === "company" ? companyTable : candidateTable;
  const activeColumns = activeTab === "company" ? companyColumns : candidateColumns;
  const activeEmpty =
    activeTab === "company"
      ? "No company inquiries yet."
      : "No candidate submissions yet.";

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl text-[var(--color-on-surface)] font-[var(--font-headline)]">
          Messages
        </h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] font-[var(--font-label)] mt-1">
          Incoming company inquiries and job-seeker submissions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-[var(--color-container-low)]">
        {(["company", "candidate"] as Tab[]).map((tab) => {
          const count =
            tab === "company" ? companyData.length : candidateData.length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-[var(--font-label)] border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "border-[var(--color-primary)] text-[var(--color-primary)] font-medium"
                  : "border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              {tab === "company" ? "Company Inquiries" : "Candidate Submissions"}
              {count > 0 && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full font-semibold ${
                    activeTab === tab
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-container-low)] text-[var(--color-on-surface-variant)]"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      {activeQuery.isError ? (
        <div className="flex items-center justify-center h-48 text-red-500 font-[var(--font-label)]">
          Failed to load. Try refreshing.
        </div>
      ) : activeQuery.isPending ? (
        <div className="flex items-center justify-center h-48 text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
          Loading…
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--color-container-low)]">
          <table className="w-full text-sm border-collapse">
            <thead>
              {activeTable.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="bg-[var(--color-primary)]">
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-4 py-3 text-left text-xs font-medium text-white font-[var(--font-label)] whitespace-nowrap border-r border-[var(--color-on-surface)] last:border-r-0"
                    >
                      {!h.isPlaceholder && flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {activeTable.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeColumns.length}
                    className="px-4 py-12 text-center text-[var(--color-on-surface-variant)] font-[var(--font-label)]"
                  >
                    {activeEmpty}
                  </td>
                </tr>
              ) : (
                activeTable.getRowModel().rows.map((row, i) => (
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
      )}

      {viewingCompany && (
        <CompanyInquiryDetailModal
          inquiry={viewingCompany}
          onClose={() => setViewingCompany(null)}
        />
      )}

      {viewingCandidate && (
        <CandidateInquiryDetailModal
          inquiry={viewingCandidate}
          onClose={() => setViewingCandidate(null)}
        />
      )}
    </div>
  );
}

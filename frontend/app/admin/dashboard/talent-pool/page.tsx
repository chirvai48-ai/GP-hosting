"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { ExternalLink, Search, MapPin, Briefcase, X } from "lucide-react";
import type {
  Application,
  ApplicationsResponse,
  CandidateInquiry,
  CandidateInquiriesResponse,
  JapaneseAbility,
} from "@/types/table";
import { adminFetch } from "@/lib/adminFetch";

const ApplicationDetailModal = dynamic(
  () => import("@/components/adminapplication/ApplicationDetailModal"),
  { ssr: false }
);

const CandidateInquiryDetailModal = dynamic(
  () => import("@/components/admincontact/CandidateInquiryDetailModal"),
  { ssr: false }
);

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ── Unified row type ──────────────────────────────────────────────────────────

type Viewing =
  | { type: "application"; data: Application }
  | { type: "inquiry"; data: CandidateInquiry };

type PoolRow = {
  _type: "application" | "inquiry";
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  japanese_ability: string | null;
  residence_status: string | null;
  resume_url: string | undefined;
  added_at: string;
  source: string;
  source_href: string | null; // job link for applications, null for candidates
  _original: Application | CandidateInquiry;
};

// ── Filter bar ────────────────────────────────────────────────────────────────

const RESIDENCE_LABELS: Record<string, string> = {
  Permanent_Resident: "Permanent Resident",
  Work_Visa: "Work Visa",
  Student_Visa: "Student Visa",
  Spouse_Visa: "Spouse Visa",
  Other: "Other",
};

const JP_OPTIONS: Array<{ value: JapaneseAbility; label: string }> = [
  { value: "N1", label: "N1" },
  { value: "N2", label: "N2" },
  { value: "N3", label: "N3" },
  { value: "N4", label: "N4" },
  { value: "N5", label: "N5" },
  { value: "None", label: "None" },
];

interface Filters {
  search: string;
  location: string;
  japaneseAbility: string;
  jobCategory: string;
}

const EMPTY_FILTERS: Filters = {
  search: "",
  location: "",
  japaneseAbility: "",
  jobCategory: "",
};

function TextFilter({
  icon,
  placeholder,
  value,
  onChange,
  className,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {icon}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 pr-7 py-1.5 text-sm border border-[var(--color-container-low)] rounded-full bg-white text-gray-900 placeholder-gray-500 focus:border-[var(--color-primary)] outline-none font-[var(--font-label)] w-full"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}

// ── Fetch functions ───────────────────────────────────────────────────────────

async function fetchTalentPool(filters: Filters): Promise<ApplicationsResponse> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.location) params.set("location", filters.location);
  if (filters.japaneseAbility) params.set("japanese_ability", filters.japaneseAbility);
  if (filters.jobCategory) params.set("job_category", filters.jobCategory);
  const qs = params.toString();
  const res = await adminFetch(`${API_URL}/api/applications/talent-pool${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("Failed to load talent pool");
  return res.json();
}

async function fetchCandidateTalentPool(): Promise<CandidateInquiriesResponse> {
  const res = await adminFetch(`${API_URL}/api/contacts/candidate-inquiries/talent-pool`);
  if (!res.ok) throw new Error("Failed to load candidate submissions");
  return res.json();
}

// ── Column helper ─────────────────────────────────────────────────────────────

const columnHelper = createColumnHelper<PoolRow>();

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TalentPoolPage() {
  const [viewing, setViewing] = useState<Viewing | null>(null);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [japaneseAbility, setJapaneseAbility] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [debouncedFilters, setDebouncedFilters] = useState<Filters>(EMPTY_FILTERS);
  const prevJpRef = useRef(japaneseAbility);

  useEffect(() => {
    const jpChanged = japaneseAbility !== prevJpRef.current;
    prevJpRef.current = japaneseAbility;
    const t = setTimeout(
      () => setDebouncedFilters({ search, location, japaneseAbility, jobCategory }),
      jpChanged ? 0 : 400
    );
    return () => clearTimeout(t);
  }, [search, location, japaneseAbility, jobCategory]);

  const anyFilterActive = search || location || japaneseAbility || jobCategory;

  function clearAll() {
    setSearch("");
    setLocation("");
    setJapaneseAbility("");
    setJobCategory("");
  }

  // ── Queries ─────────────────────────────────────────────────────────────────

  const appQuery = useQuery({
    queryKey: ["talent-pool", debouncedFilters],
    queryFn: () => fetchTalentPool(debouncedFilters),
    placeholderData: (prev) => prev,
  });

  const candQuery = useQuery({
    queryKey: ["candidate-talent-pool"],
    queryFn: fetchCandidateTalentPool,
  });

  // ── Merge + client-side filter candidates ──────────────────────────────────

  const rows = useMemo<PoolRow[]>(() => {
    const { search: s, location: l, japaneseAbility: jp, jobCategory: jc } = debouncedFilters;
    const sl = s.toLowerCase();
    const ll = l.toLowerCase();

    const appRows: PoolRow[] = (appQuery.data?.data ?? []).map((app) => ({
      _type: "application",
      id: app.id,
      full_name: app.full_name,
      email: app.email,
      phone_number: app.phone_number,
      japanese_ability: app.japanese_ability ?? null,
      residence_status: app.residence_status ?? null,
      resume_url: app.resume_url,
      added_at: app.updated_at,
      source: app.job ? `Vacancy: ${app.job.title}` : "Vacancy",
      source_href: app.job ? `/admin/dashboard/applications/${app.job.id}` : null,
      _original: app,
    }));

    let candRows: PoolRow[] = (candQuery.data?.data ?? []).map((inq) => ({
      _type: "inquiry",
      id: inq.id,
      full_name: inq.full_name,
      email: inq.email,
      phone_number: inq.phone_number,
      japanese_ability: inq.japanese_ability ?? null,
      residence_status: inq.residence_status ?? null,
      resume_url: inq.resume_url,
      added_at: inq.moved_to_pool_at ?? inq.updated_at,
      source: "Direct submission",
      source_href: null,
      _original: inq,
    }));

    // Client-side filter candidates to match the server-side behaviour for applications
    if (sl) candRows = candRows.filter(
      (r) => r.full_name.toLowerCase().includes(sl) || r.email.toLowerCase().includes(sl)
    );
    if (ll) candRows = candRows.filter(
      (r) => (r._original as CandidateInquiry).preferred_location.toLowerCase().includes(ll)
    );
    if (jp) candRows = candRows.filter((r) => r.japanese_ability === jp);
    if (jc) candRows = []; // candidates have no job category

    return [...appRows, ...candRows];
  }, [appQuery.data, candQuery.data, debouncedFilters]);

  // ── Columns ──────────────────────────────────────────────────────────────────

  const columns = useMemo(
    () => [
      columnHelper.accessor("full_name", {
        header: "Name",
        cell: ({ row, getValue }) => (
          <button
            onClick={() =>
              setViewing(
                row.original._type === "application"
                  ? { type: "application", data: row.original._original as Application }
                  : { type: "inquiry", data: row.original._original as CandidateInquiry }
              )
            }
            className="text-left text-[var(--color-primary)] hover:underline font-[var(--font-label)]"
          >
            {getValue()}
          </button>
        ),
      }),
      columnHelper.accessor("email", { header: "Email", size: 200 }),
      columnHelper.accessor("phone_number", { header: "Phone", size: 140 }),
      columnHelper.accessor("source", {
        header: "Source",
        size: 200,
        cell: ({ row, getValue }) => {
          const href = row.original.source_href;
          if (href) {
            return (
              <Link
                href={href}
                prefetch={false}
                className="text-[var(--color-secondary)] hover:underline inline-flex items-center gap-1 font-[var(--font-label)] text-xs"
              >
                {getValue()} <ExternalLink size={11} />
              </Link>
            );
          }
          return (
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] rounded bg-[var(--color-container-low)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] font-semibold tracking-wide">
              Direct submission
            </span>
          );
        },
      }),
      columnHelper.accessor("residence_status", {
        header: "Residence",
        size: 140,
        cell: ({ getValue }) => {
          const v = getValue();
          return v ? RESIDENCE_LABELS[v] ?? v : "—";
        },
      }),
      columnHelper.accessor("japanese_ability", {
        header: "JP",
        size: 70,
        cell: ({ getValue }) => getValue() ?? "—",
      }),
      columnHelper.accessor("added_at", {
        header: "Added",
        size: 110,
        cell: ({ getValue }) => {
          const v = getValue();
          return v ? new Date(v).toLocaleDateString() : "—";
        },
      }),
      columnHelper.accessor("resume_url", {
        header: "Resume",
        size: 100,
        cell: ({ getValue }) => {
          const url = getValue();
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
            onClick={() =>
              setViewing(
                row.original._type === "application"
                  ? { type: "application", data: row.original._original as Application }
                  : { type: "inquiry", data: row.original._original as CandidateInquiry }
              )
            }
            className="px-3 py-1 text-xs rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] font-[var(--font-label)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
          >
            View
          </button>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isLoading = appQuery.isPending || candQuery.isPending;
  const isError = appQuery.isError || candQuery.isError;
  const isFetching = appQuery.isFetching || candQuery.isFetching;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl text-[var(--color-on-surface)] font-[var(--font-headline)]">
          Talent Pool
        </h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] font-[var(--font-label)] mt-1 mb-4">
          {rows.length}{" "}
          {rows.length === 1 ? "person" : "people"}
          {anyFilterActive ? " matching filters" : " kept for future roles"}
          {!anyFilterActive &&
            '. Open an entry to restore them or move to another state.'}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <TextFilter
            icon={<Search size={14} />}
            placeholder="Search name or email…"
            value={search}
            onChange={setSearch}
            className="flex-1 min-w-[200px]"
          />
          <TextFilter
            icon={<MapPin size={14} />}
            placeholder="Location"
            value={location}
            onChange={setLocation}
            className="w-36"
          />

          <div className="relative">
            <select
              value={japaneseAbility}
              onChange={(e) => setJapaneseAbility(e.target.value)}
              className="py-1.5 pl-3 pr-7 text-sm border border-[var(--color-container-low)] rounded-full bg-white text-gray-900 focus:border-[var(--color-primary)] outline-none font-[var(--font-label)] appearance-none cursor-pointer"
            >
              <option value="">JP Ability</option>
              {JP_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {japaneseAbility && (
              <button
                onClick={() => setJapaneseAbility("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <TextFilter
            icon={<Briefcase size={14} />}
            placeholder="Job category"
            value={jobCategory}
            onChange={setJobCategory}
            className="w-36"
          />

          {anyFilterActive && (
            <button
              onClick={clearAll}
              className="text-sm text-[var(--color-secondary)] hover:underline font-[var(--font-label)] whitespace-nowrap"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {isError ? (
        <div className="flex items-center justify-center h-48 text-red-500 font-[var(--font-label)]">
          Failed to load talent pool.
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-48 text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
          Loading talent pool…
        </div>
      ) : (
        <div
          className={`overflow-x-auto rounded-lg border border-[var(--color-container-low)] transition-opacity ${
            isFetching ? "opacity-60" : "opacity-100"
          }`}
        >
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
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-[var(--color-on-surface-variant)] font-[var(--font-label)]"
                  >
                    {anyFilterActive
                      ? "No one matches the current filters."
                      : "The talent pool is empty."}
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
      )}

      {viewing?.type === "application" && (
        <ApplicationDetailModal
          application={viewing.data}
          onClose={() => setViewing(null)}
        />
      )}

      {viewing?.type === "inquiry" && (
        <CandidateInquiryDetailModal
          inquiry={viewing.data}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}

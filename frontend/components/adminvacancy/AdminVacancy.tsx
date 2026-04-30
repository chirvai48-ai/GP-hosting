"use client";
import { useQuery } from "@tanstack/react-query";
import type { Job, JobsResponse } from "@/types/table";
import EditableCell from "./EditableCell";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { useState } from "react";
import AddVacancy from "./AddVacancy";

const columnHelper = createColumnHelper<Job>();

async function getJobs(): Promise<JobsResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
}

function AdminVacancy() {
  const [editingRow, setEditingRow] = useState<Job | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  const job_data = data?.data ?? [];

  const startEdit = (row: Job) => setEditingRow({ ...row });
  const cancelEdit = () => setEditingRow(null);
  const updateEdit = <K extends keyof Job>(id: number, field: K, value: unknown) => {
    setEditingRow(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      size: 60,
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("title", {
      header: "Job Title",
      enableColumnFilter: true,
      enableSorting: true,
      meta: { editable: true, inputType: "text" },
    }),
    columnHelper.accessor("location", {
      header: "Location",
      size: 120,
      enableSorting: true,
      enableColumnFilter: true,
      meta: { editable: true, inputType: "text" },
    }),
    columnHelper.accessor("salary_min", {
      id: "min_salary",
      header: "Min Salary",
      size: 90,
      cell: (info) => info.getValue()?.toLocaleString() ?? "",
      meta: { editable: true, inputType: "number" },
    }),
    columnHelper.accessor("salary_max", {
      id: "max_salary",
      header: "Max Salary",
      size: 90,
      cell: (info) => info.getValue()?.toLocaleString() ?? "",
      meta: { editable: true, inputType: "number" },
    }),
    columnHelper.accessor("currency", {
      header: "Currency",
      size: 90,
      meta: { editable: true, inputType: "select", options: ["YEN", "USD", "EUR"] },
    }),
    columnHelper.accessor("experience", {
      header: "Exp (yrs)",
      size: 90,
      enableSorting: true,
      cell: ({ getValue }) => `${getValue()} yrs`,
      meta: { editable: true, inputType: "number" },
    }),
    columnHelper.accessor("contract", {
      header: "Contract",
      size: 110,
      meta: { editable: true, inputType: "select", options: ["Full_time", "Part_time", "Contract", "Freelance"] },
    }),
    columnHelper.accessor("workdays", {
      header: "Days/wk",
      size: 80,
      meta: { editable: true, inputType: "number" },
    }),
    columnHelper.accessor("shift_start", {
      header: "Shift Start",
      size: 100,
      cell: ({ getValue }) => {return new Date(getValue()).toISOString().substring(11,16)},
      meta: { editable: true, inputType: "time" },
    }),
    columnHelper.accessor("shift_end", {
      header: "Shift End",
      size: 100,
      cell: ({ getValue }) => {return new Date(getValue()).toISOString().substring(11,16)},
      meta: { editable: true, inputType: "time" },
    }),
    columnHelper.accessor("gender", {
      header: "Gender",
      size: 90,
      meta: { editable: true, inputType: "select", options: ["Any", "Male", "Female"] },
    }),
    columnHelper.accessor((row) => row.job_category.name, {
      id: "job_category",
      header: "Category",
      size: 120,
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      size: 90,
      meta: { editable: true, inputType: "select", options: ["Draft", "Active", "Archived"] },
      cell: ({ getValue }) => {
        const status = getValue();
        const styles: Record<string, string> = {
          Draft:     "bg-[#FAEEDA] text-[#854F0B]",
          Published: "bg-[#EAF3DE] text-[#3B6D11]",
          Closed:    "bg-[#ec817e] text-white",
          Archived:  "bg-[#F1EFE8] text-[#5F5E5A]",
        };
        return (
          <span className={`${styles[status]} text-[11px] px-2 py-0.5 rounded font-medium font-[var(--font-label)]`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor("technical_skills", {
      header: "Technical Skills",
      size: 160,
      enableSorting: false,
      cell: ({ getValue }) =>
        getValue().map(skill => (
          <span
            key={skill.id}
            className="inline-block text-[11px] px-1.5 py-0.5 rounded mr-1 bg-[#E6F1FB] text-[#185FA5] font-[var(--font-label)]"
          >
            {skill.name}
          </span>
        )),
      meta: { editable: true, inputType: "multi_select" },
    }),
    columnHelper.accessor("languages", {
      header: "Languages",
      size: 140,
      enableSorting: false,
      cell: ({ getValue }) =>
        getValue().map(language => (
          <span
            key={language.id}
            className="inline-block text-[11px] px-1.5 py-0.5 rounded mr-1 bg-[#E1F5EE] text-[#0F6E56] font-[var(--font-label)]"
          >
            {language.name}
          </span>
        )),
      meta: { editable: true, inputType: "multi_select" },
    }),
    columnHelper.accessor("soft_skills", {
      header: "Soft Skills",
      size: 160,
      meta: { editable: true, inputType: "text" },
    }),
    columnHelper.accessor("benefits", {
      header: "Benefits",
      size: 200,
      meta: { editable: true, inputType: "text" },
    }),
    columnHelper.accessor("requirements", {
      header: "Requirements",
      size: 200,
      meta: { editable: true, inputType: "textarea" },
    }),
    columnHelper.accessor("application_method", {
      header: "Application Method",
      size: 200,
      meta: { editable: true, inputType: "text" },
    }),
    columnHelper.accessor("created_at", {
      header: "Created",
      size: 120,
      enableSorting: true,
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      enableColumnFilter: false,
    }),
    columnHelper.accessor("updated_at", {
      header: "Updated",
      size: 120,
      enableSorting: true,
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      enableColumnFilter: false,
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      size: 140,
      cell: ({ row }) => {
        const job = row.original;
        const isEditing = editingRow?.id === job.id;

        if (isEditing) return (
          <div className="flex gap-2">
            <button
              onClick={() => console.log("save", editingRow)}
              className="px-3 py-1 text-xs rounded bg-[var(--color-primary)] text-white font-[var(--font-label)] hover:opacity-90 transition-opacity"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="px-3 py-1 text-xs rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)] transition-colors"
            >
              Cancel
            </button>
          </div>
        );

        return (
          <button
            onClick={() => startEdit(job)}
            disabled={editingRow !== null}
            className="px-3 py-1 text-xs rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] font-[var(--font-label)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Edit
          </button>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: job_data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) return (
    <div className="flex items-center justify-center h-48 text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
      Loading jobs...
    </div>
  );

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl text-[var(--color-on-surface)] font-[var(--font-headline)]">
          Job Listings
        </h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] font-[var(--font-label)] mt-1 mb-4">
          {job_data.length} jobs total
        </p>
        <AddVacancy />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--color-container-low)]">
        <table className="w-full text-sm border-collapse">

          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-[var(--color-primary)]">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-white font-[var(--font-label)] whitespace-nowrap border-r border-[var(--color-on-surface)] last:border-r-0"
                  >
                    {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {job_data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[var(--color-on-surface-variant)] font-[var(--font-label)]"
                >
                  No jobs found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`
                    border-b border-[var(--color-container-low)] transition-colors
                    ${editingRow?.id === row.original.id
                      ? "bg-[#f0f7f6]"
                      : i % 2 === 0
                        ? "bg-white hover:bg-[var(--color-container-low)]"
                        : "bg-[var(--color-surface)] hover:bg-[var(--color-container-low)]"
                    }
                  `}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-4 py-2.5 text-[var(--color-on-surface)] font-[var(--font-body)] border-r border-[var(--color-container-low)] last:border-r-0"
                    >
                      <EditableCell
                        cell={cell}
                        isEditing={editingRow?.id === row.original.id}
                        rowEdit={editingRow ?? {}}
                        onFieldChange={(field, value) => updateEdit(row.original.id, field, value)}
                      />
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

export default AdminVacancy;
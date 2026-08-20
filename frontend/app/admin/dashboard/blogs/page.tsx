"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { News, NewsResponse } from "@/types/table";
import NewsEditableCell from "@/components/adminnews/NewsEditableCell";
import AddNews from "@/components/adminnews/AddNews";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { useState, useRef } from "react";
import { adminFetch } from "@/lib/adminFetch";
import { PaginationControls } from "@/components/Reusables/PaginationControls";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const columnHelper = createColumnHelper<News>();

async function getNews(page = 1, limit = 20): Promise<NewsResponse> {
  const res = await adminFetch(`${API_URL}/api/news?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

async function patchNews({ id, data }: { id: number; data: Partial<News> }) {
  const res = await adminFetch(`${API_URL}/api/news/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update article");
  return res.json();
}

async function deleteNews(id: number) {
  const res = await adminFetch(`${API_URL}/api/news/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete article");
  return res.json();
}

function AdminBlogs() {
  const queryClient = useQueryClient();
  const [editingRow, setEditingRow] = useState<News | null>(null);
  const [updatedFields, setUpdatedFields] = useState<Partial<News> | null>(null);
  const [deletingRowId, setDeletingRowId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const imageFileRef = useRef<File | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["news", page, limit],
    queryFn: () => getNews(page, limit),
  });

  const news_data = data?.data?.items ?? [];
  const totalArticles = data?.data?.total ?? 0;

  const editMutation = useMutation({
    mutationFn: patchNews,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      if (news_data.length === 1 && page > 1) setPage((p) => p - 1);
      queryClient.invalidateQueries({ queryKey: ["news"] });
      setDeletingRowId(null);
    },
  });

  const startEdit = (row: News) => {
    setEditingRow({ ...row });
    setDeletingRowId(null);
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setUpdatedFields(null);
    imageFileRef.current = null;
  };

  const saveEdit = async () => {
    if (!updatedFields?.id) return;
    const { id, ...fields } = updatedFields;
    const result = await editMutation.mutateAsync({ id: id as number, data: fields });
    const signedUrl = result?.data?.signed_url;
    if (signedUrl && imageFileRef.current) {
      await fetch(signedUrl, {
        method: "PUT",
        body: imageFileRef.current,
        headers: { "Content-Type": imageFileRef.current.type },
      });
    }
    imageFileRef.current = null;
    queryClient.invalidateQueries({ queryKey: ["news"] });
    setEditingRow(null);
    setUpdatedFields(null);
  };

  const updateEdit = <K extends keyof News>(id: number, field: K, value: unknown) => {
    setUpdatedFields((prev) =>
      prev ? { ...prev, id, [field]: value } : { id, [field]: value }
    );
    setEditingRow((prev) =>
      prev ? { ...prev, id, [field]: value as News[K] } : prev
    );
  };

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      size: 60,
    }),
    columnHelper.accessor("title", {
      header: "Title",
      size: 220,
      meta: { editable: true, inputType: "text" },
    }),
    columnHelper.accessor("summary", {
      header: "Summary",
      size: 200,
      meta: { editable: true, inputType: "textarea" },
      cell: ({ getValue }) => (
        <span className="line-clamp-2 text-sm">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("body", {
      header: "Body",
      size: 240,
      meta: { editable: true, inputType: "textarea" },
      cell: ({ getValue }) => (
        <span className="line-clamp-2 text-sm text-[var(--color-on-surface-variant)]">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("image_key",{
      header:"Vacancy Image",
      size:120,
      enableSorting:false,
      meta:{editable: true, inputType: "image"}
    }),
    columnHelper.accessor("status", {
      header: "Status",
      size: 100,
      meta: { editable: true, inputType: "select", options: ["published", "closed"] },
      cell: ({ getValue }) => {
        const status = getValue();
        const styles: Record<string, string> = {
          published: "bg-[#EAF3DE] text-[#3B6D11]",
          closed: "bg-[#F1EFE8] text-[#5F5E5A]",
        };
        return (
          <span
            className={`${styles[status] ?? ""} text-[11px] px-2 py-0.5 rounded font-medium font-[var(--font-label)]`}
          >
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor("admin", {
      header: "Author",
      size: 140,
      enableSorting: false,
      cell: ({ getValue }) => {
        const admin = getValue();
        if (!admin)
          return <span className="text-xs text-[var(--color-on-surface-variant)]">—</span>;
        return <span className="text-sm font-[var(--font-body)]">{admin.name}</span>;
      },
    }),
    columnHelper.accessor("published_at", {
      header: "Published",
      size: 110,
      cell: ({ getValue }) => (
        <span className="text-sm font-[var(--font-body)]">
          {new Date(getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.accessor("updated_at", {
      header: "Updated",
      size: 110,
      cell: ({ getValue }) => (
        <span className="text-sm font-[var(--font-body)]">
          {new Date(getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      size: 190,
      cell: ({ row }) => {
        const news = row.original;
        const isEditing = editingRow?.id === news.id;
        const isDeleting = deletingRowId === news.id;

        if (isEditing)
          return (
            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                disabled={editMutation.isPending}
                className="px-3 py-1 text-xs rounded bg-[var(--color-primary)] text-white font-[var(--font-label)] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {editMutation.isPending ? "Saving…" : "Save"}
              </button>
              <button
                onClick={cancelEdit}
                className="px-3 py-1 text-xs rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)] transition-colors"
              >
                Cancel
              </button>
            </div>
          );

        if (isDeleting)
          return (
            <div className="flex gap-2 items-center">
              <span className="text-xs text-red-600 font-[var(--font-label)] whitespace-nowrap">
                Delete?
              </span>
              <button
                onClick={() => deleteMutation.mutate(news.id)}
                disabled={deleteMutation.isPending}
                className="px-2 py-1 text-xs rounded bg-red-600 text-white font-[var(--font-label)] hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setDeletingRowId(null)}
                className="px-2 py-1 text-xs rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)] transition-colors"
              >
                No
              </button>
            </div>
          );

        return (
          <div className="flex gap-2">
            <button
              onClick={() => startEdit(news)}
              disabled={editingRow !== null || deletingRowId !== null}
              className="px-3 py-1 text-xs rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] font-[var(--font-label)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setDeletingRowId(news.id);
                setEditingRow(null);
                setUpdatedFields(null);
              }}
              disabled={editingRow !== null || deletingRowId !== null}
              className="px-3 py-1 text-xs rounded border border-red-400 text-red-500 font-[var(--font-label)] hover:bg-red-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: news_data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending)
    return (
      <div className="flex items-center justify-center h-48 text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
        Loading articles...
      </div>
    );

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl text-[var(--color-on-surface)] font-[var(--font-headline)]">
          News
        </h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] font-[var(--font-label)] mt-1 mb-4">
          {totalArticles} articles total
        </p>
        <AddNews />
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--color-container-low)]">
        <table className="w-full text-sm border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-[var(--color-primary)]">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
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
            {news_data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[var(--color-on-surface-variant)] font-[var(--font-label)]"
                >
                  No articles found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`
                    border-b border-[var(--color-container-low)] transition-colors
                    ${
                      editingRow?.id === row.original.id
                        ? "bg-[#f0f7f6]"
                        : deletingRowId === row.original.id
                        ? "bg-red-50"
                        : i % 2 === 0
                        ? "bg-white hover:bg-[var(--color-container-low)]"
                        : "bg-[var(--color-surface)] hover:bg-[var(--color-container-low)]"
                    }
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2.5 text-[var(--color-on-surface)] font-[var(--font-body)] border-r border-[var(--color-container-low)] last:border-r-0"
                    >
                      <NewsEditableCell
                        cell={cell}
                        isEditing={editingRow?.id === row.original.id}
                        rowEdit={editingRow ?? {}}
                        onFieldChange={(field, value) =>
                          updateEdit(row.original.id, field, value)
                        }
                        onFileChange={(file) => { imageFileRef.current = file; }}
                      />
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
        total={totalArticles}
        onPageChange={setPage}
        onLimitChange={(n) => {
          setLimit(n);
          setPage(1);
        }}
      />
    </div>
  );
}

export default AdminBlogs;

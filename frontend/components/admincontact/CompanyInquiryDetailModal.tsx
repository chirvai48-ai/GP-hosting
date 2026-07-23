"use client";

import { useState } from "react";
import { Modal, Box } from "@mui/material";
import { X, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CompanyInquiry, ContactStatus } from "@/types/table";
import { adminFetch } from "@/lib/adminFetch";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const STATUS_OPTIONS: ContactStatus[] = ["Open", "Inprogress", "Resolved", "Closed"];

const STATUS_STYLES: Record<ContactStatus, string> = {
  Open: "bg-gray-100 text-gray-600",
  Inprogress: "bg-blue-50 text-blue-700",
  Resolved: "bg-emerald-50 text-emerald-700",
  Closed: "bg-[var(--color-container-low)] text-[var(--color-on-surface-variant)]",
};

const fieldLabel =
  "text-[10px] tracking-widest uppercase text-[var(--color-on-surface-variant)] font-[var(--font-label)] font-medium";
const fieldValue =
  "text-sm text-[var(--color-on-surface)] font-[var(--font-body)] mt-0.5 break-words";

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className={fieldLabel}>{label}</div>
      <div className={fieldValue}>{value || "—"}</div>
    </div>
  );
}

async function patchStatus(id: number, status: ContactStatus) {
  const res = await adminFetch(`${API_URL}/api/contacts/company-inquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

async function deleteInquiry(id: number) {
  const res = await adminFetch(`${API_URL}/api/contacts/company-inquiries/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete inquiry");
  return res.json();
}

export default function CompanyInquiryDetailModal({
  inquiry,
  onClose,
}: {
  inquiry: CompanyInquiry | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [localStatus, setLocalStatus] = useState<ContactStatus | null>(null);

  const currentStatus = localStatus ?? inquiry?.status ?? "Open";

  const patchMutation = useMutation({
    mutationFn: (status: ContactStatus) => patchStatus(inquiry!.id, status),
    onSuccess: (_, status) => {
      setLocalStatus(status);
      queryClient.invalidateQueries({ queryKey: ["company-inquiries"] });
    },
    onError: (err) => alert((err as Error).message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteInquiry(inquiry!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-inquiries"] });
      onClose();
    },
    onError: (err) => alert((err as Error).message),
  });

  const handleDelete = () => {
    if (!confirm("Delete this inquiry? This cannot be undone.")) return;
    deleteMutation.mutate();
  };

  return (
    <Modal
      open={inquiry !== null}
      onClose={onClose}
      container={typeof window !== "undefined" ? document.body : undefined}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          backgroundColor: "#f8faf8",
          margin: 4,
          padding: 0,
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: 2,
        }}
      >
        {inquiry && (
          <>
            <div className="sticky top-0 z-10 flex items-start justify-between px-6 py-4 bg-white border-b border-[var(--color-container-low)]">
              <div>
                <h2 className="text-xl font-[var(--font-headline)] text-[var(--color-on-surface)]">
                  {inquiry.name}
                </h2>
                <p className="text-xs text-[var(--color-on-surface-variant)] font-[var(--font-label)] mt-0.5">
                  Received {new Date(inquiry.created_at).toLocaleDateString()} · {inquiry.email}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[var(--color-container-low)]"
                aria-label="Close"
              >
                <X size={18} className="text-[var(--color-on-surface-variant)]" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              <section>
                <h3 className="font-[var(--font-headline)] text-base text-[var(--color-on-surface)] mb-3 pb-1 border-b border-[var(--color-container-low)]">
                  Contact details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldRow label="Name" value={inquiry.name} />
                  <FieldRow label="Email" value={inquiry.email} />
                  <FieldRow label="Phone" value={inquiry.phone_number} />
                  <FieldRow label="Subject" value={inquiry.subject} />
                </div>
              </section>

              <section>
                <h3 className="font-[var(--font-headline)] text-base text-[var(--color-on-surface)] mb-3 pb-1 border-b border-[var(--color-container-low)]">
                  Message
                </h3>
                <p className="text-sm text-[var(--color-on-surface)] font-[var(--font-body)] whitespace-pre-wrap leading-relaxed">
                  {inquiry.message}
                </p>
              </section>

              <section>
                <h3 className="font-[var(--font-headline)] text-base text-[var(--color-on-surface)] mb-3 pb-1 border-b border-[var(--color-container-low)]">
                  Status
                </h3>
                <div className="flex items-center gap-3">
                  <select
                    value={currentStatus}
                    onChange={(e) => patchMutation.mutate(e.target.value as ContactStatus)}
                    disabled={patchMutation.isPending}
                    className={`px-3 py-1.5 text-sm rounded font-[var(--font-label)] border-0 outline-none cursor-pointer disabled:opacity-60 ${STATUS_STYLES[currentStatus]}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {patchMutation.isPending && (
                    <span className="text-xs text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
                      Saving…
                    </span>
                  )}
                </div>
              </section>
            </div>

            <div className="sticky bottom-0 flex justify-between items-center px-6 py-3 bg-white border-t border-[var(--color-container-low)]">
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-red-400 text-red-500 font-[var(--font-label)] hover:bg-red-500 hover:text-white transition-colors disabled:opacity-40"
              >
                <Trash2 size={12} /> Delete
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)]"
              >
                Close
              </button>
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
}

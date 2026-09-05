"use client";

import { useState } from "react";
import { Modal, Box } from "@mui/material";
import { X, ExternalLink, Archive, XCircle, Eye, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CandidateInquiry, CandidateInquiryState } from "@/types/table";
import { adminFetch } from "@/lib/adminFetch";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const RESIDENCE_LABELS: Record<string, string> = {
  Permanent_Resident: "Permanent Resident",
  Work_Visa: "Work Visa",
  Student_Visa: "Student Visa",
  Spouse_Visa: "Spouse Visa",
  Other: "Other",
};

const STATE_STYLES: Record<CandidateInquiryState, string> = {
  New: "bg-gray-100 text-gray-600",
  Reviewing: "bg-blue-50 text-blue-700",
  MovedToTalentPool: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-600",
};

const STATE_LABELS: Record<CandidateInquiryState, string> = {
  New: "New",
  Reviewing: "Reviewing",
  MovedToTalentPool: "In talent pool",
  Rejected: "Rejected",
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

async function patchState(id: number, state: CandidateInquiryState) {
  const res = await adminFetch(`${API_URL}/api/contacts/candidate-inquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state }),
  });
  if (!res.ok) throw new Error("Failed to update state");
  return res.json();
}

async function deleteInquiry(id: number) {
  const res = await adminFetch(`${API_URL}/api/contacts/candidate-inquiries/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete submission");
  return res.json();
}

export default function CandidateInquiryDetailModal({
  inquiry,
  onClose,
}: {
  inquiry: CandidateInquiry | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [localState, setLocalState] = useState<CandidateInquiryState | null>(null);

  const currentState = localState ?? inquiry?.state ?? "New";

  const patchMutation = useMutation({
    mutationFn: (state: CandidateInquiryState) => patchState(inquiry!.id, state),
    onSuccess: (_, state) => {
      setLocalState(state);
      queryClient.invalidateQueries({ queryKey: ["candidate-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["candidate-talent-pool"] });
    },
    onError: (err) => alert((err as Error).message || "操作に失敗しました。 / Something went wrong. Please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteInquiry(inquiry!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["candidate-talent-pool"] });
      onClose();
    },
    onError: (err) => alert((err as Error).message || "操作に失敗しました。 / Something went wrong. Please try again."),
  });

  const handleDelete = () => {
    if (!confirm("Delete this submission and its resume? This cannot be undone.")) return;
    deleteMutation.mutate();
  };

  const isPending = patchMutation.isPending || deleteMutation.isPending;

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
          maxWidth: 640,
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
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-[var(--font-headline)] text-[var(--color-on-surface)]">
                    {inquiry.full_name}
                  </h2>
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded font-[var(--font-label)] font-semibold tracking-wide ${STATE_STYLES[currentState]}`}
                  >
                    {STATE_LABELS[currentState]}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] font-[var(--font-label)] mt-0.5">
                  Submitted {new Date(inquiry.created_at).toLocaleDateString()} · {inquiry.email}
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
                  Personal information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldRow label="Full name" value={inquiry.full_name} />
                  <FieldRow
                    label="Date of birth"
                    value={
                      inquiry.date_of_birth
                        ? new Date(inquiry.date_of_birth).toLocaleDateString()
                        : ""
                    }
                  />
                  <FieldRow label="Email" value={inquiry.email} />
                  <FieldRow label="Phone" value={inquiry.phone_number} />
                  <FieldRow label="Gender" value={inquiry.gender ?? ""} />
                  <FieldRow label="Current address" value={inquiry.current_address} />
                </div>
              </section>

              <section>
                <h3 className="font-[var(--font-headline)] text-base text-[var(--color-on-surface)] mb-3 pb-1 border-b border-[var(--color-container-low)]">
                  Preferences
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldRow label="Preferred location" value={inquiry.preferred_location} />
                  <FieldRow
                    label="Residence status"
                    value={
                      inquiry.residence_status
                        ? RESIDENCE_LABELS[inquiry.residence_status] ?? inquiry.residence_status
                        : ""
                    }
                  />
                  <FieldRow label="Japanese ability" value={inquiry.japanese_ability ?? ""} />
                </div>
              </section>

              {inquiry.cover_letter && (
                <section>
                  <h3 className="font-[var(--font-headline)] text-base text-[var(--color-on-surface)] mb-3 pb-1 border-b border-[var(--color-container-low)]">
                    Cover letter
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface)] font-[var(--font-body)] whitespace-pre-wrap leading-relaxed">
                    {inquiry.cover_letter}
                  </p>
                </section>
              )}
            </div>

            <div className="sticky bottom-0 flex flex-wrap justify-between items-center gap-2 px-6 py-3 bg-white border-t border-[var(--color-container-low)]">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-red-400 text-red-500 font-[var(--font-label)] hover:bg-red-500 hover:text-white transition-colors disabled:opacity-40"
              >
                <Trash2 size={12} /> Delete
              </button>

              <div className="flex flex-wrap gap-2">
                {currentState !== "Reviewing" && (
                  <button
                    onClick={() => patchMutation.mutate("Reviewing")}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-blue-400 text-blue-600 font-[var(--font-label)] hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-40"
                  >
                    <Eye size={12} /> Mark reviewing
                  </button>
                )}

                {currentState !== "MovedToTalentPool" && (
                  <button
                    onClick={() => patchMutation.mutate("MovedToTalentPool")}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[#185FA5] text-[#185FA5] font-[var(--font-label)] hover:bg-[#185FA5] hover:text-white transition-colors disabled:opacity-40"
                  >
                    <Archive size={12} /> Move to talent pool
                  </button>
                )}

                {inquiry.resume_url && (
                  <a
                    href={inquiry.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[var(--color-primary)] text-[var(--color-primary)] font-[var(--font-label)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                  >
                    <ExternalLink size={12} /> Resume
                  </a>
                )}

                {currentState !== "Rejected" && (
                  <button
                    onClick={() => {
                      if (!confirm("Reject this submission?")) return;
                      patchMutation.mutate("Rejected");
                    }}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-red-500 text-red-500 font-[var(--font-label)] hover:bg-red-500 hover:text-white transition-colors disabled:opacity-40"
                  >
                    <XCircle size={12} /> Reject
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)]"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
}

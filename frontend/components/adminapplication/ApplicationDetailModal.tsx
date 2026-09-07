"use client";

import { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import { ExternalLink, X, Pencil, XCircle, PauseCircle, Archive, RotateCcw, FileDown } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Application, ApplicationStatus, ApplicationStage } from "@/types/table";
import NotesPanel from "./NotesPanel";
import EditApplicationForm from "./EditApplicationForm";
import { adminFetch } from "@/lib/adminFetch";
import { GENERIC_ACTION_FAILED } from "@/lib/errorMessages";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function patchApplication({
  id,
  changes,
}: {
  id: number;
  changes: Partial<{ status: ApplicationStatus; stage: ApplicationStage }>;
}) {
  const res = await adminFetch(`${API_URL}/api/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error("Failed to update application");
  return res.json();
}

const RESIDENCE_LABELS: Record<string, string> = {
  Permanent_Resident: "Permanent Resident",
  Work_Visa: "Work Visa",
  Student_Visa: "Student Visa",
  Spouse_Visa: "Spouse Visa",
  Other: "Other",
};

const CONTRACT_LABELS: Record<string, string> = {
  Full_time: "Full-time",
  Part_time: "Part-time",
  Internship: "Internship",
  Flexible: "Flexible",
};

const PIPELINE_STAGES: ApplicationStage[] = [
  "Pending",
  "ApplicantCalled",
  "InterviewScheduling",
  "Hired",
];

const STAGE_LABELS: Record<ApplicationStage, string> = {
  Pending: "Pending",
  ApplicantCalled: "Called",
  InterviewScheduling: "Interview",
  Hired: "Hired",
  Rejected: "Rejected",
};

const sectionTitle = "font-[var(--font-headline)] text-base text-[var(--color-on-surface)] mb-3 pb-1 border-b border-[var(--color-container-low)]";
const fieldLabel = "text-[10px] tracking-widest uppercase text-[var(--color-on-surface-variant)] font-[var(--font-label)] font-medium";
const fieldValue = "text-sm text-[var(--color-on-surface)] font-[var(--font-body)] mt-0.5 break-words";

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className={fieldLabel}>{label}</div>
      <div className={fieldValue}>{value || "—"}</div>
    </div>
  );
}

export default function ApplicationDetailModal({
  application,
  onClose,
}: {
  application: Application | null;
  onClose: () => void;
}) {
  const open = application !== null;
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) setEditing(false);
  }, [open]);

  const patchMutation = useMutation({
    mutationFn: patchApplication,
    onSuccess: () => {
      if (application) {
        queryClient.invalidateQueries({ queryKey: ["applications", application.job_id] });
        queryClient.invalidateQueries({ queryKey: ["applications-stats", application.job_id] });
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["talent-pool"] });
      }
    },
    onError: (err) => alert((err as Error).message || GENERIC_ACTION_FAILED),
  });

  const handleAction = (
    changes: Partial<{ status: ApplicationStatus; stage: ApplicationStage }>,
    confirmMsg: string,
    closeAfter: boolean
  ) => {
    if (!application) return;
    if (!confirm(confirmMsg)) return;
    patchMutation.mutate(
      { id: application.id, changes },
      { onSuccess: () => { if (closeAfter) onClose(); } }
    );
  };

  const pipelineIdx = application ? PIPELINE_STAGES.indexOf(application.stage) : -1;
  const prevStage: ApplicationStage | null = pipelineIdx > 0 ? PIPELINE_STAGES[pipelineIdx - 1] : null;
  const nextStage: ApplicationStage | null =
    pipelineIdx >= 0 && pipelineIdx < PIPELINE_STAGES.length - 1
      ? PIPELINE_STAGES[pipelineIdx + 1]
      : null;

  return (
    <Modal
      open={open}
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
          maxWidth: 680,
          backgroundColor: "#f8faf8",
          margin: 4,
          padding: 0,
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: 2,
        }}
      >
        {application && (
          <>
            <div className="sticky top-0 z-10 flex items-start justify-between px-6 py-4 bg-white border-b border-[var(--color-container-low)]">
              <div>
                <h2 className="text-xl font-[var(--font-headline)] text-[var(--color-on-surface)]">
                  {application.full_name}
                </h2>
                <p className="text-xs text-[var(--color-on-surface-variant)] font-[var(--font-label)] mt-0.5">
                  Applied {new Date(application.created_at).toLocaleDateString()} ·
                  {" "}{application.email}
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

            {editing ? (
              <EditApplicationForm
                application={application}
                onCancel={() => setEditing(false)}
                onSaved={() => setEditing(false)}
              />
            ) : (
            <div className="px-6 py-5 space-y-6">
              <section>
                <h3 className={sectionTitle}>Personal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldRow label="Full name" value={application.full_name} />
                  <FieldRow
                    label="Date of birth"
                    value={
                      application.date_of_birth
                        ? new Date(application.date_of_birth).toLocaleDateString()
                        : ""
                    }
                  />
                  <FieldRow label="Email" value={application.email} />
                  <FieldRow label="Phone" value={application.phone_number} />
                  <FieldRow label="Gender" value={application.gender ?? ""} />
                  <FieldRow label="Country" value={application.country ?? ""} />
                  <FieldRow
                    label="Facebook"
                    value={
                      application.facebook_url ? (
                        <a
                          href={application.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-secondary)] hover:underline inline-flex items-center gap-1"
                        >
                          Open <ExternalLink size={12} />
                        </a>
                      ) : (
                        ""
                      )
                    }
                  />
                  <FieldRow label="Current address" value={application.current_address} />
                </div>
              </section>

              <section>
                <h3 className={sectionTitle}>Status & schedule</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldRow label="Nearest station" value={application.nearest_station ?? ""} />
                  <FieldRow
                    label="Residence status"
                    value={
                      application.residence_status
                        ? RESIDENCE_LABELS[application.residence_status] ?? application.residence_status
                        : ""
                    }
                  />
                  <FieldRow label="Japanese ability" value={application.japanese_ability ?? ""} />
                  <FieldRow
                    label="Availability"
                    value={CONTRACT_LABELS[application.availability] ?? application.availability}
                  />
                  <FieldRow label="School / college" value={application.school_college} />
                  <FieldRow label="Degree" value={application.degree} />
                  <FieldRow
                    label="Working days"
                    value={(application.working_days ?? []).join(", ")}
                  />
                </div>
              </section>

              <section>
                <h3 className={sectionTitle}>Skills & documents</h3>
                <div className="space-y-4">
                  <FieldRow label="Soft skills" value={application.soft_skills} />
                  <FieldRow
                    label="Cover letter"
                    value={
                      application.cover_letter ? (
                        <span className="whitespace-pre-wrap">{application.cover_letter}</span>
                      ) : (
                        ""
                      )
                    }
                  />
                  <FieldRow
                    label="Resume"
                    value={
                      application.resume_url ? (
                        <a
                          href={application.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-secondary)] hover:underline inline-flex items-center gap-1"
                        >
                          Open resume <ExternalLink size={12} />
                        </a>
                      ) : (
                        ""
                      )
                    }
                  />
                </div>
              </section>

              <NotesPanel applicationId={application.id} />
            </div>
            )}

            {!editing && (
              <div className="sticky bottom-0 flex flex-wrap justify-end gap-2 px-6 py-3 bg-white border-t border-[var(--color-container-low)]">
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] font-[var(--font-label)] hover:bg-[var(--color-secondary)] hover:text-white"
                >
                  <Pencil size={12} /> Edit
                </button>
                <a
                  href={`${API_URL}/api/applications/${application.id}/resume.xlsx`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[var(--color-primary)] text-[var(--color-primary)] font-[var(--font-label)] hover:bg-[var(--color-primary)] hover:text-white"
                >
                  <FileDown size={12} /> Export resume
                </a>
                {prevStage && (
                  <button
                    onClick={() => handleAction({ stage: prevStage }, `Move to ${STAGE_LABELS[prevStage]}?`, true)}
                    disabled={patchMutation.isPending}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)] disabled:opacity-40"
                  >
                    ← {STAGE_LABELS[prevStage]}
                  </button>
                )}
                {nextStage && (
                  <button
                    onClick={() => handleAction({ stage: nextStage }, `Move to ${STAGE_LABELS[nextStage]}?`, true)}
                    disabled={patchMutation.isPending}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)] disabled:opacity-40"
                  >
                    {STAGE_LABELS[nextStage]} →
                  </button>
                )}
                {(application.status === "TalentPool" ||
                  application.stage === "Rejected") && (
                  <button
                    onClick={() => {
                      if (application.status === "TalentPool") {
                        handleAction(
                          { status: "Active" },
                          "Restore this applicant to their original vacancy?",
                          true
                        );
                      } else {
                        handleAction(
                          { stage: "Pending" },
                          "Restore this applicant back to the Pending stage?",
                          true
                        );
                      }
                    }}
                    disabled={patchMutation.isPending}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[#0F6E56] text-[#0F6E56] font-[var(--font-label)] hover:bg-[#E1F5EE] disabled:opacity-40"
                  >
                    <RotateCcw size={12} /> Restore
                  </button>
                )}
                <button
                  onClick={() =>
                    handleAction(
                      { status: "OnHold" },
                      "Put this application on hold?",
                      false
                    )
                  }
                  disabled={patchMutation.isPending || application.status === "OnHold"}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[#854F0B] text-[#854F0B] font-[var(--font-label)] hover:bg-[#FAEEDA] disabled:opacity-40"
                >
                  <PauseCircle size={12} /> On hold
                </button>
                <button
                  onClick={() =>
                    handleAction(
                      { status: "TalentPool" },
                      "Move this applicant to the talent pool? They'll be removed from this vacancy's list.",
                      true
                    )
                  }
                  disabled={patchMutation.isPending || application.status === "TalentPool"}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[#185FA5] text-[#185FA5] font-[var(--font-label)] hover:bg-[#E6F1FB] disabled:opacity-40"
                >
                  <Archive size={12} /> Talent pool
                </button>
                <button
                  onClick={() =>
                    handleAction(
                      { stage: "Rejected" },
                      "Reject this application? It will move to the Rejected tab and auto-delete after 7 days.",
                      true
                    )
                  }
                  disabled={patchMutation.isPending || application.stage === "Rejected"}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-red-500 text-red-500 font-[var(--font-label)] hover:bg-red-500 hover:text-white disabled:opacity-40"
                >
                  <XCircle size={12} /> Reject
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)]"
                >
                  Close
                </button>
              </div>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
}

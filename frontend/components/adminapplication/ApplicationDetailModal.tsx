"use client";

import { Modal, Box } from "@mui/material";
import { ExternalLink, X } from "lucide-react";
import type { Application } from "@/types/table";

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
                  <FieldRow label="Permanent address" value={application.permanent_address} />
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
                  <FieldRow label="Preferred location" value={application.preferred_location} />
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
            </div>

            <div className="sticky bottom-0 flex justify-end gap-2 px-6 py-3 bg-white border-t border-[var(--color-container-low)]">
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

"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  editApplicationSchema,
  EditApplicationForm as EditValues,
  GENDER_OPTIONS,
  RESIDENCE_STATUS_OPTIONS,
  RESIDENCE_STATUS_LABELS,
  JAPANESE_ABILITY_OPTIONS,
  CONTRACT_OPTIONS,
  CONTRACT_LABELS,
  WORKING_DAYS,
  APPLICATION_STAGE_OPTIONS,
  APPLICATION_STATUS_OPTIONS,
} from "@/schemas/application.schemas";
import type { Application } from "@/types/table";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const STAGE_LABELS: Record<(typeof APPLICATION_STAGE_OPTIONS)[number], string> = {
  Pending: "Pending",
  ApplicantCalled: "Applicant called",
  InterviewScheduling: "Interview scheduling",
  Hired: "Hired",
  Rejected: "Rejected",
};

const STATUS_LABELS: Record<(typeof APPLICATION_STATUS_OPTIONS)[number], string> = {
  Active: "Active",
  OnHold: "On hold",
  TalentPool: "Talent pool",
};

// Status dropdown in the edit form is constrained — TalentPool is only reachable from
// the modal's "Move to Talent Pool" action button.
const STATUS_EDIT_OPTIONS = ["Active", "OnHold"] as const;

const inputCls =
  "w-full bg-[var(--color-container-low)] border-b border-b-[#c0cbc9] rounded-t-sm px-3 py-2 font-[var(--font-body)] text-sm text-[var(--color-on-surface)] outline-none focus:border-b-[var(--color-secondary)]";
const labelCls =
  "text-[10px] tracking-widest uppercase text-[var(--color-on-surface-variant)] font-medium font-[var(--font-label)]";
const errorCls = "text-xs text-red-500 mt-0.5 min-h-[16px]";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className={labelCls}>{label}</label>
      {children}
      <p className={errorCls}>{error}</p>
    </div>
  );
}

async function patchApplication({
  id,
  body,
}: {
  id: number;
  body: Partial<EditValues>;
}) {
  const res = await fetch(`${API_URL}/api/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const fe = errBody?.error?.fieldErrors as Record<string, string[]> | undefined;
    if (fe) {
      const first = Object.entries(fe)[0];
      if (first) throw new Error(`${first[0]}: ${first[1][0]}`);
    }
    throw new Error(errBody?.message || `Update failed (${res.status})`);
  }
  return res.json();
}

function toDateString(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function EditApplicationForm({
  application,
  onSaved,
  onCancel,
}: {
  application: Application;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const queryClient = useQueryClient();

  const defaults: EditValues = {
    full_name: application.full_name,
    date_of_birth: toDateString(application.date_of_birth),
    phone_number: application.phone_number,
    email: application.email,
    gender: application.gender ?? undefined,
    facebook_url: application.facebook_url ?? "",
    country: application.country ?? "",
    nearest_station: application.nearest_station ?? "",
    residence_status: application.residence_status ?? undefined,
    japanese_ability: application.japanese_ability ?? undefined,
    working_days: (application.working_days ?? []) as EditValues["working_days"],
    current_address: application.current_address,
    permanent_address: application.permanent_address,
    preferred_location: application.preferred_location,
    availability: application.availability,
    school_college: application.school_college,
    degree: application.degree,
    soft_skills: application.soft_skills,
    cover_letter: application.cover_letter ?? "",
    stage: application.stage,
    status: application.status,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<EditValues>({
    resolver: zodResolver(editApplicationSchema),
    defaultValues: defaults,
  });

  const { mutateAsync } = useMutation({
    mutationFn: patchApplication,
  });

  const onSubmit: SubmitHandler<EditValues> = async (data) => {
    const body: Partial<EditValues> = {};
    (Object.keys(dirtyFields) as (keyof EditValues)[]).forEach((key) => {
      const value = data[key];
      if (value !== undefined) {
        (body as Record<string, unknown>)[key] = value;
      }
    });
    if (Object.keys(body).length === 0) {
      onSaved();
      return;
    }
    try {
      await mutateAsync({ id: application.id, body });
      queryClient.invalidateQueries({ queryKey: ["applications", application.job_id] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      onSaved();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-6">
      <section>
        <h3 className="font-[var(--font-headline)] text-base text-[var(--color-on-surface)] mb-3 pb-1 border-b border-[var(--color-container-low)]">
          Pipeline
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Stage" error={errors.stage?.message}>
            <select className={inputCls} {...register("stage")}>
              {APPLICATION_STAGE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STAGE_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status" error={errors.status?.message}>
            <select className={inputCls} {...register("status")}>
              {STATUS_EDIT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section>
        <h3 className="font-[var(--font-headline)] text-base text-[var(--color-on-surface)] mb-3 pb-1 border-b border-[var(--color-container-low)]">
          Personal
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name" error={errors.full_name?.message}>
            <input className={inputCls} {...register("full_name")} />
          </Field>
          <Field label="Date of birth" error={errors.date_of_birth?.message}>
            <input type="date" className={inputCls} {...register("date_of_birth")} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input type="email" className={inputCls} {...register("email")} />
          </Field>
          <Field label="Phone" error={errors.phone_number?.message}>
            <input className={inputCls} {...register("phone_number")} />
          </Field>
          <Field label="Gender" error={errors.gender?.message}>
            <select className={inputCls} {...register("gender")}>
              <option value="">Select…</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Country" error={errors.country?.message}>
            <input className={inputCls} {...register("country")} />
          </Field>
          <Field label="Facebook URL" error={errors.facebook_url?.message}>
            <input className={inputCls} {...register("facebook_url")} />
          </Field>
          <Field
            label="Current address"
            error={errors.current_address?.message}
          >
            <textarea
              className={`${inputCls} resize-y min-h-[56px]`}
              {...register("current_address")}
            />
          </Field>
          <Field
            label="Permanent address"
            error={errors.permanent_address?.message}
          >
            <textarea
              className={`${inputCls} resize-y min-h-[56px]`}
              {...register("permanent_address")}
            />
          </Field>
        </div>
      </section>

      <section>
        <h3 className="font-[var(--font-headline)] text-base text-[var(--color-on-surface)] mb-3 pb-1 border-b border-[var(--color-container-low)]">
          Status &amp; schedule
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Nearest station"
            error={errors.nearest_station?.message}
          >
            <input className={inputCls} {...register("nearest_station")} />
          </Field>
          <Field
            label="Residence status"
            error={errors.residence_status?.message}
          >
            <select className={inputCls} {...register("residence_status")}>
              <option value="">Select…</option>
              {RESIDENCE_STATUS_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {RESIDENCE_STATUS_LABELS[r]}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Japanese ability"
            error={errors.japanese_ability?.message}
          >
            <select className={inputCls} {...register("japanese_ability")}>
              <option value="">Select…</option>
              {JAPANESE_ABILITY_OPTIONS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Preferred location"
            error={errors.preferred_location?.message}
          >
            <input className={inputCls} {...register("preferred_location")} />
          </Field>
          <Field label="Availability" error={errors.availability?.message}>
            <select className={inputCls} {...register("availability")}>
              {CONTRACT_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {CONTRACT_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="School / college"
            error={errors.school_college?.message}
          >
            <input className={inputCls} {...register("school_college")} />
          </Field>
          <Field label="Degree" error={errors.degree?.message}>
            <input className={inputCls} {...register("degree")} />
          </Field>
        </div>

        <div className="mt-4">
          <Field
            label="Available working days"
            error={errors.working_days?.message}
          >
            <Controller
              name="working_days"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2 pt-1">
                  {WORKING_DAYS.map((day) => {
                    const selected = field.value?.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => {
                          const set = new Set(field.value ?? []);
                          if (selected) set.delete(day);
                          else set.add(day);
                          field.onChange(WORKING_DAYS.filter((d) => set.has(d)));
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-[var(--font-label)] border transition-colors ${
                          selected
                            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                            : "bg-white text-[var(--color-on-surface-variant)] border-[#c0cbc9] hover:border-[var(--color-primary)]"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </Field>
        </div>
      </section>

      <section>
        <h3 className="font-[var(--font-headline)] text-base text-[var(--color-on-surface)] mb-3 pb-1 border-b border-[var(--color-container-low)]">
          Skills &amp; documents
        </h3>
        <div className="space-y-4">
          <Field label="Soft skills" error={errors.soft_skills?.message}>
            <textarea
              className={`${inputCls} resize-y min-h-[60px]`}
              {...register("soft_skills")}
            />
          </Field>
          <Field label="Cover letter" error={errors.cover_letter?.message}>
            <textarea
              className={`${inputCls} resize-y min-h-[120px]`}
              {...register("cover_letter")}
            />
          </Field>
        </div>
      </section>

      <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-container-low)]">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-1.5 text-xs rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-1.5 text-xs rounded bg-[var(--color-primary)] text-white font-[var(--font-label)] hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

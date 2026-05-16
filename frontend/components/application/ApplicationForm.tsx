"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload } from "lucide-react";
import {
  createApplicationSchema,
  CreateApplicationForm,
  GENDER_OPTIONS,
  RESIDENCE_STATUS_OPTIONS,
  RESIDENCE_STATUS_LABELS,
  JAPANESE_ABILITY_OPTIONS,
  WORKING_DAYS,
  CONTRACT_OPTIONS,
  CONTRACT_LABELS,
} from "@/schemas/application.schemas";
import type { Job } from "@/types/table";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ACCEPTED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

const inputCls =
  "w-full bg-[var(--color-container-low)] border-b border-b-[#c0cbc9] rounded-t-sm px-3 py-2 font-[var(--font-body)] text-base text-[var(--color-on-surface)] outline-none focus:border-b-[var(--color-secondary)]";
const labelCls =
  "text-[0.7rem] tracking-widest uppercase text-[var(--color-on-surface-variant)] font-medium";
const errorCls = "text-xs text-red-500 mt-0.5 min-h-[16px]";

type Step = 1 | 2 | 3;

const STEP_FIELDS: Record<Step, (keyof CreateApplicationForm)[]> = {
  1: [
    "full_name",
    "date_of_birth",
    "phone_number",
    "email",
    "gender",
    "country",
    "facebook_url",
    "current_address",
    "permanent_address",
  ],
  2: [
    "nearest_station",
    "residence_status",
    "japanese_ability",
    "working_days",
    "preferred_location",
    "availability",
    "school_college",
    "degree",
  ],
  3: ["soft_skills", "cover_letter", "resume_key", "resume_type"],
};

async function fetchJob(id: number): Promise<Job | null> {
  const res = await fetch(`${API_URL}/api/jobs/${id}`);
  if (!res.ok) return null;
  const json = await res.json();
  return (json?.data ?? null) as Job | null;
}

async function postApplication(payload: CreateApplicationForm) {
  const res = await fetch(`${API_URL}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body?.error?.formErrors?.[0] ||
        body?.messagge ||
        body?.message ||
        "Failed to submit application"
    );
  }
  return res.json();
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ApplicationForm({ jobId }: { jobId: number }) {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const resumeFileRef = useRef<File | null>(null);
  const [resumeFileMeta, setResumeFileMeta] = useState<{
    name: string;
    size: number;
  } | null>(null);

  const { data: job } = useQuery({
    queryKey: ["job-public", jobId],
    queryFn: () => fetchJob(jobId),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CreateApplicationForm>({
    resolver: zodResolver(createApplicationSchema),
    mode: "onTouched",
    defaultValues: {
      full_name: "",
      date_of_birth: "",
      phone_number: "",
      email: "",
      facebook_url: "",
      country: "",
      nearest_station: "",
      working_days: [],
      current_address: "",
      permanent_address: "",
      preferred_location: "",
      school_college: "",
      degree: "",
      soft_skills: "",
      cover_letter: "",
      resume_key: "",
      resume_type: "",
      job_id: jobId,
    },
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: postApplication,
  });

  const onSubmit: SubmitHandler<CreateApplicationForm> = async (data) => {
    const result = await mutateAsync(data);
    const signedUrl = result?.data?.signed_url;
    if (signedUrl && resumeFileRef.current) {
      const putRes = await fetch(signedUrl, {
        method: "PUT",
        body: resumeFileRef.current,
        headers: { "Content-Type": resumeFileRef.current.type },
      });
      if (!putRes.ok) {
        throw new Error("Resume upload failed. Please contact support.");
      }
    }
    setSubmitted(true);
  };

  const next = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => (s === 3 ? 3 : ((s + 1) as Step)));
  };

  const back = () => setStep((s) => (s === 1 ? 1 : ((s - 1) as Step)));

  const onResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_MIME.includes(file.type)) {
      setResumeError("Only PDF, DOC, or DOCX files are allowed.");
      setValue("resume_key", "");
      setValue("resume_type", "");
      resumeFileRef.current = null;
      setResumeFileMeta(null);
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setResumeError("File must be 5 MB or smaller.");
      setValue("resume_key", "");
      setValue("resume_type", "");
      resumeFileRef.current = null;
      setResumeFileMeta(null);
      return;
    }
    setResumeError(null);
    const ext = file.name.split(".").pop() ?? "bin";
    const key = `${crypto.randomUUID()}.${ext}`;
    setValue("resume_key", key, { shouldValidate: true });
    setValue("resume_type", file.type, { shouldValidate: true });
    resumeFileRef.current = file;
    setResumeFileMeta({ name: file.name, size: file.size });
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-10 bg-[color:var(--color-surface)]">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-sm border border-[rgba(20,86,82,0.1)] p-10">
          <CheckCircle2
            size={48}
            className="mx-auto text-[color:var(--color-primary)] mb-4"
          />
          <h1 className="font-[family-name:var(--font-headline)] text-2xl text-[color:var(--color-on-surface)] mb-2">
            Application submitted
          </h1>
          {job && (
            <p className="font-[family-name:var(--font-body)] text-sm text-[color:var(--color-on-surface-variant)] mb-6">
              Thank you for applying to <strong>{job.title}</strong>. We'll be in
              touch.
            </p>
          )}
          <Link
            href="/vacancy"
            className="inline-block px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors font-[family-name:var(--font-label)] text-sm"
          >
            Back to vacancies
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[color:var(--color-surface)] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <Link
            href="/vacancy"
            className="inline-flex items-center gap-1 text-xs text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] font-[family-name:var(--font-label)] mb-3"
          >
            <ArrowLeft size={14} /> Back to vacancies
          </Link>
          <p className="font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-[0.12em] uppercase text-[color:var(--color-secondary)] mb-1">
            Apply for this role
          </p>
          <h1 className="font-[family-name:var(--font-headline)] text-2xl md:text-3xl text-[color:var(--color-primary)] leading-tight">
            {job?.title ?? "Job application"}
          </h1>
          {job?.location && (
            <p className="font-[family-name:var(--font-body)] text-sm text-[color:var(--color-on-surface-variant)] mt-1">
              {job.location}
            </p>
          )}
        </header>

        <StepIndicator step={step} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border border-[rgba(20,86,82,0.1)] p-6 md:p-8 mt-6"
        >
          {step === 1 && (
            <fieldset className="flex flex-col gap-5">
              <legend className="font-[family-name:var(--font-headline)] text-lg text-[color:var(--color-on-surface)] mb-2">
                Personal information
              </legend>

              <Field label="Full name" error={errors.full_name?.message}>
                <input
                  className={inputCls}
                  placeholder="Yamada Taro"
                  {...register("full_name")}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label="Date of birth"
                  error={errors.date_of_birth?.message}
                >
                  <input
                    type="date"
                    className={inputCls}
                    {...register("date_of_birth")}
                  />
                </Field>
                <Field label="Gender" error={errors.gender?.message}>
                  <select
                    className={inputCls}
                    defaultValue=""
                    {...register("gender")}
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Phone number" error={errors.phone_number?.message}>
                  <input
                    className={inputCls}
                    placeholder="+81 90 1234 5678"
                    {...register("phone_number")}
                  />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                </Field>
              </div>

              <Field label="Country" error={errors.country?.message}>
                <input
                  className={inputCls}
                  placeholder="Japan"
                  {...register("country")}
                />
              </Field>

              <Field
                label="Current address"
                error={errors.current_address?.message}
              >
                <textarea
                  className={`${inputCls} resize-y min-h-[60px]`}
                  placeholder="Where you currently live"
                  {...register("current_address")}
                />
              </Field>

              <Field
                label="Permanent address"
                error={errors.permanent_address?.message}
              >
                <textarea
                  className={`${inputCls} resize-y min-h-[60px]`}
                  placeholder="Your permanent / home address"
                  {...register("permanent_address")}
                />
              </Field>

              <Field
                label="Facebook URL (optional)"
                error={errors.facebook_url?.message}
              >
                <input
                  className={inputCls}
                  placeholder="https://facebook.com/your.profile"
                  {...register("facebook_url")}
                />
              </Field>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="flex flex-col gap-5">
              <legend className="font-[family-name:var(--font-headline)] text-lg text-[color:var(--color-on-surface)] mb-2">
                Status &amp; schedule
              </legend>

              <Field
                label="Nearest station"
                error={errors.nearest_station?.message}
              >
                <input
                  className={inputCls}
                  placeholder="e.g. Shinjuku"
                  {...register("nearest_station")}
                />
              </Field>

              <Field
                label="Residence status"
                error={errors.residence_status?.message}
              >
                <select
                  className={inputCls}
                  defaultValue=""
                  {...register("residence_status")}
                >
                  <option value="" disabled>
                    Select…
                  </option>
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
                <select
                  className={inputCls}
                  defaultValue=""
                  {...register("japanese_ability")}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {JAPANESE_ABILITY_OPTIONS.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Preferred work location"
                error={errors.preferred_location?.message}
              >
                <input
                  className={inputCls}
                  placeholder="e.g. Tokyo, Yokohama, Remote"
                  {...register("preferred_location")}
                />
              </Field>

              <Field label="Availability" error={errors.availability?.message}>
                <select
                  className={inputCls}
                  defaultValue=""
                  {...register("availability")}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {CONTRACT_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {CONTRACT_LABELS[c]}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label="School / college"
                  error={errors.school_college?.message}
                >
                  <input
                    className={inputCls}
                    placeholder="University of Tokyo"
                    {...register("school_college")}
                  />
                </Field>
                <Field label="Degree" error={errors.degree?.message}>
                  <input
                    className={inputCls}
                    placeholder="B.Sc. Computer Science"
                    {...register("degree")}
                  />
                </Field>
              </div>

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
                              field.onChange(
                                WORKING_DAYS.filter((d) => set.has(d))
                              );
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-[family-name:var(--font-label)] border transition-colors ${
                              selected
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-white text-[color:var(--color-on-surface-variant)] border-[#c0cbc9] hover:border-[var(--color-primary)]"
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
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="flex flex-col gap-5">
              <legend className="font-[family-name:var(--font-headline)] text-lg text-[color:var(--color-on-surface)] mb-2">
                Documents &amp; review
              </legend>

              <Field label="Soft skills" error={errors.soft_skills?.message}>
                <textarea
                  className={`${inputCls} resize-y min-h-[80px]`}
                  placeholder="e.g. Communication, teamwork, problem solving"
                  {...register("soft_skills")}
                />
              </Field>

              <Field
                label="Cover letter (optional)"
                error={errors.cover_letter?.message}
              >
                <textarea
                  className={`${inputCls} resize-y min-h-[140px]`}
                  placeholder="Tell us why you're a good fit…"
                  {...register("cover_letter")}
                />
              </Field>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Resume (PDF / DOC / DOCX, ≤ 5 MB)</label>
                <label className="flex items-center gap-3 px-3 py-3 rounded border border-dashed border-[#c0cbc9] bg-[var(--color-container-low)] cursor-pointer hover:border-[var(--color-primary)]">
                  <Upload size={18} className="text-[color:var(--color-secondary)]" />
                  <span className="text-sm text-[color:var(--color-on-surface-variant)]">
                    {resumeFileMeta
                      ? `${resumeFileMeta.name} (${formatBytes(resumeFileMeta.size)})`
                      : "Click to choose a file"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={onResumeChange}
                  />
                </label>
                <p className={errorCls}>
                  {resumeError ??
                    errors.resume_key?.message ??
                    errors.resume_type?.message}
                </p>
              </div>

              <Summary values={getValues()} />

              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {(error as Error).message}
                </p>
              )}
            </fieldset>
          )}

          <div className="flex items-center justify-between mt-8 pt-5 border-t border-[rgba(20,86,82,0.1)]">
            <button
              type="button"
              onClick={back}
              disabled={step === 1 || isPending}
              className="inline-flex items-center gap-1 px-4 py-2 rounded border border-[#c0cbc9] text-[color:var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[color:var(--color-primary)] font-[family-name:var(--font-label)] text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={14} /> Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-1 px-4 py-2 rounded bg-[var(--color-primary)] text-white font-[family-name:var(--font-label)] text-sm hover:opacity-90"
              >
                Next <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1 px-5 py-2 rounded bg-[var(--color-secondary)] text-white font-[family-name:var(--font-label)] text-sm hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? "Submitting…" : "Submit application"}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const labels = ["Personal", "Status", "Documents"];
  return (
    <ol className="flex items-center gap-2">
      {labels.map((label, i) => {
        const n = (i + 1) as Step;
        const active = n === step;
        const done = n < step;
        return (
          <li key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-full mb-1.5 ${
                done || active
                  ? "bg-[var(--color-secondary)]"
                  : "bg-[#dfe5e3]"
              }`}
            />
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-[family-name:var(--font-label)] font-semibold tracking-widest uppercase ${
                  done || active
                    ? "text-[color:var(--color-secondary)]"
                    : "text-[color:var(--color-on-surface-variant)]"
                }`}
              >
                Step {n}
              </span>
              <span
                className={`text-[10px] font-[family-name:var(--font-label)] ${
                  done || active
                    ? "text-[color:var(--color-on-surface)]"
                    : "text-[color:var(--color-on-surface-variant)]"
                }`}
              >
                · {label}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

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

function Summary({ values }: { values: CreateApplicationForm }) {
  const rows: [string, string][] = [
    ["Name", values.full_name],
    ["Date of birth", values.date_of_birth],
    ["Phone", values.phone_number],
    ["Email", values.email],
    ["Gender", values.gender ?? ""],
    ["Country", values.country],
    ["Current address", values.current_address],
    ["Permanent address", values.permanent_address],
    ["Nearest station", values.nearest_station],
    [
      "Residence",
      values.residence_status
        ? RESIDENCE_STATUS_LABELS[values.residence_status]
        : "",
    ],
    ["Japanese", values.japanese_ability ?? ""],
    ["Preferred location", values.preferred_location],
    [
      "Availability",
      values.availability ? CONTRACT_LABELS[values.availability] : "",
    ],
    ["School / college", values.school_college],
    ["Degree", values.degree],
    ["Working days", (values.working_days ?? []).join(", ")],
  ];
  return (
    <div className="rounded-lg bg-[var(--color-container-low)] p-4">
      <p className="font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-widest uppercase text-[color:var(--color-secondary)] mb-3">
        Review
      </p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className="text-xs text-[color:var(--color-on-surface-variant)]">
              {k}
            </dt>
            <dd className="text-xs text-[color:var(--color-on-surface)] text-right truncate">
              {v || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

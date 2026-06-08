"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, Sparkles, MapPin, Mail, Phone } from "lucide-react";
import {
  createCandidateInquirySchema,
  type CreateCandidateInquiryForm,
  CANDIDATE_STEP_FIELDS,
} from "@/schemas/contact.schemas";
import {
  GENDER_OPTIONS,
  RESIDENCE_STATUS_OPTIONS,
  RESIDENCE_STATUS_LABELS,
  JAPANESE_ABILITY_OPTIONS,
} from "@/schemas/application.schemas";

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
      <p className={errorCls}>{error ?? ""}</p>
    </div>
  );
}

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {([1, 2] as const).map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-[family-name:var(--font-label)] font-semibold transition-colors ${
              s === step
                ? "bg-[var(--color-primary)] text-white"
                : s < step
                ? "bg-[var(--color-secondary)] text-white"
                : "bg-[var(--color-container-low)] text-[var(--color-on-surface-variant)]"
            }`}
          >
            {s}
          </div>
          <span
            className={`text-xs font-[family-name:var(--font-label)] tracking-wide ${
              s === step
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-on-surface-variant)]"
            }`}
          >
            {s === 1 ? "Personal info" : "Preferences & resume"}
          </span>
          {s < 2 && <div className="w-8 h-px bg-[var(--color-container-low)]" />}
        </div>
      ))}
    </div>
  );
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function postCandidateInquiry(payload: CreateCandidateInquiryForm) {
  const res = await fetch(`${API_URL}/api/contacts/candidate-inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.formErrors?.[0] || body?.message || "Submission failed");
  }
  return res.json();
}

export default function CustomerContactPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const resumeFileRef = useRef<File | null>(null);
  const [resumeFileMeta, setResumeFileMeta] = useState<{ name: string; size: number } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateCandidateInquiryForm>({
    resolver: zodResolver(createCandidateInquirySchema),
    mode: "onTouched",
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      date_of_birth: "",
      current_address: "",
      preferred_location: "",
      cover_letter: "",
      resume_key: "",
      resume_type: "",
    },
  });

  const { mutateAsync, isPending, error } = useMutation({ mutationFn: postCandidateInquiry });

  const onSubmit = async (data: CreateCandidateInquiryForm) => {
    const result = await mutateAsync(data);
    const signedUrl = result?.data?.signed_url;
    if (signedUrl && resumeFileRef.current) {
      const putRes = await fetch(signedUrl, {
        method: "PUT",
        body: resumeFileRef.current,
        headers: { "Content-Type": resumeFileRef.current.type },
      });
      if (!putRes.ok) throw new Error("Resume upload failed. Please try again.");
    }
    setSubmitted(true);
  };

  const next = async () => {
    const valid = await trigger(CANDIDATE_STEP_FIELDS[1]);
    if (valid) setStep(2);
  };

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
          <CheckCircle2 size={48} className="mx-auto text-[color:var(--color-primary)] mb-4" />
          <h1 className="font-[family-name:var(--font-headline)] text-2xl text-[color:var(--color-on-surface)] mb-2">
            Submission received
          </h1>
          <p className="font-[family-name:var(--font-body)] text-sm text-[color:var(--color-on-surface-variant)] mb-6">
            Thank you for your interest. We'll review your profile and reach out if there's a match.
          </p>
          <Link
            href="/vacancy"
            className="inline-block px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors font-[family-name:var(--font-label)] text-sm"
          >
            Browse vacancies
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[color:var(--color-surface)] px-6 py-10 overflow-hidden">
      {/* decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-40 w-[480px] h-[480px] rounded-full bg-[var(--color-primary)]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-[var(--color-secondary)]/15 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] font-[family-name:var(--font-label)] mb-6"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-start">
          {/* Left: hero panel */}
          <aside className="lg:sticky lg:top-10 flex flex-col gap-5">
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/forjobseeker.jpg"
                alt="Job seekers"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/85 via-[var(--color-primary)]/30 to-transparent" />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-[family-name:var(--font-label)] tracking-[0.18em] uppercase mb-3">
                  <Sparkles size={12} /> Job seeker inquiry
                </span>
                <h1 className="font-[family-name:var(--font-headline)] text-3xl md:text-4xl leading-tight mb-2">
                  Let&apos;s find the role that fits you.
                </h1>
                <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-white/90 max-w-sm">
                  Share your profile — we&apos;ll reach out the moment we have something worth your time.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[rgba(20,86,82,0.1)] p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[
                { n: "500+", l: "Candidates placed" },
                { n: "120+", l: "Hiring partners" },
                { n: "48h", l: "Avg. response" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-[family-name:var(--font-headline)] text-xl text-[var(--color-primary)]">
                    {s.n}
                  </p>
                  <p className="text-[10px] tracking-[0.14em] uppercase text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-label)] mt-0.5">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden lg:flex flex-col gap-2 text-sm text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-body)]">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-[var(--color-primary)]" /> Tokyo, Japan</div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-[var(--color-primary)]" /> careers@glowingpartner.jp</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-[var(--color-primary)]" /> +81 3 1234 5678</div>
            </div>
          </aside>

          {/* Right: form */}
          <div>
            <StepIndicator step={step} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border border-[rgba(20,86,82,0.1)] p-6 md:p-8"
        >
          {step === 1 && (
            <fieldset className="flex flex-col gap-5">
              <legend className="font-[family-name:var(--font-headline)] text-lg text-[color:var(--color-on-surface)] mb-2">
                Personal information
              </legend>

              <Field label="Full name" error={errors.full_name?.message}>
                <input className={inputCls} placeholder="Yamada Taro" {...register("full_name")} />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Email" error={errors.email?.message}>
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                </Field>
                <Field label="Phone number" error={errors.phone_number?.message}>
                  <input
                    className={inputCls}
                    placeholder="+81 90 1234 5678"
                    {...register("phone_number")}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Date of birth" error={errors.date_of_birth?.message}>
                  <input type="date" className={inputCls} {...register("date_of_birth")} />
                </Field>
                <Field label="Gender (optional)" error={errors.gender?.message}>
                  <select className={inputCls} defaultValue="" {...register("gender")}>
                    <option value="">Select…</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Current address" error={errors.current_address?.message}>
                <textarea
                  className={`${inputCls} resize-y min-h-[60px]`}
                  placeholder="Where you currently live"
                  {...register("current_address")}
                />
              </Field>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 px-8 py-2.5 bg-[var(--color-primary)] text-white font-[family-name:var(--font-label)] text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
                >
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="flex flex-col gap-5" disabled={isPending}>
              <legend className="font-[family-name:var(--font-headline)] text-lg text-[color:var(--color-on-surface)] mb-2">
                Preferences &amp; resume
              </legend>

              <Field label="Preferred work location" error={errors.preferred_location?.message}>
                <input
                  className={inputCls}
                  placeholder="e.g. Tokyo, Osaka"
                  {...register("preferred_location")}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Residence status (optional)" error={errors.residence_status?.message}>
                  <select className={inputCls} defaultValue="" {...register("residence_status")}>
                    <option value="">Select…</option>
                    {RESIDENCE_STATUS_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {RESIDENCE_STATUS_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Japanese ability (optional)" error={errors.japanese_ability?.message}>
                  <select className={inputCls} defaultValue="" {...register("japanese_ability")}>
                    <option value="">Select…</option>
                    {JAPANESE_ABILITY_OPTIONS.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Cover letter (optional)" error={errors.cover_letter?.message}>
                <textarea
                  className={`${inputCls} resize-y min-h-[100px]`}
                  placeholder="Tell us about yourself and what you're looking for…"
                  {...register("cover_letter")}
                />
              </Field>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Resume (PDF, DOC, DOCX — max 5 MB)</label>
                <label className="cursor-pointer">
                  <div
                    className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded transition-colors ${
                      resumeFileMeta
                        ? "border-[var(--color-primary)] bg-[rgba(20,86,82,0.03)]"
                        : "border-[#c0cbc9] hover:border-[var(--color-secondary)]"
                    }`}
                  >
                    <Upload
                      size={18}
                      className={
                        resumeFileMeta
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-on-surface-variant)]"
                      }
                    />
                    <div className="flex flex-col">
                      {resumeFileMeta ? (
                        <>
                          <span className="text-sm font-[family-name:var(--font-label)] text-[var(--color-on-surface)]">
                            {resumeFileMeta.name}
                          </span>
                          <span className="text-xs text-[var(--color-on-surface-variant)]">
                            {formatBytes(resumeFileMeta.size)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)]">
                          Click to upload resume
                        </span>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    onChange={onResumeChange}
                  />
                </label>
                <p className={errorCls}>{resumeError ?? errors.resume_key?.message ?? ""}</p>
              </div>

              {error && (
                <p className="text-sm text-red-500 font-[family-name:var(--font-label)]">
                  {(error as Error).message}
                </p>
              )}

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] font-[family-name:var(--font-label)] text-sm tracking-widest uppercase hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-8 py-2.5 bg-[var(--color-primary)] text-white font-[family-name:var(--font-label)] text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isPending ? "Submitting…" : "Submit profile"}
                </button>
              </div>
            </fieldset>
          )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

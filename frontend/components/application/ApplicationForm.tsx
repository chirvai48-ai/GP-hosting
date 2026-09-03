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
  GENDER_LABELS,
  RESIDENCE_STATUS_OPTIONS,
  RESIDENCE_STATUS_LABELS,
  JAPANESE_ABILITY_OPTIONS,
  JAPANESE_ABILITY_LABELS,
  WORKING_DAYS,
  WORKING_DAY_LABELS,
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
        "応募の送信に失敗しました。"
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
        throw new Error("履歴書のアップロードに失敗しました。お手数ですがサポートまでお問い合わせください。");
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
      setResumeError("アップロード可能なファイルは PDF、DOC、DOCX 形式のみです。");
      setValue("resume_key", "");
      setValue("resume_type", "");
      resumeFileRef.current = null;
      setResumeFileMeta(null);
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setResumeError("ファイルサイズは 5MB 以下にしてください。");
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
            応募が完了しました
          </h1>
          {job && (
            <p className="font-[family-name:var(--font-body)] text-sm text-[color:var(--color-on-surface-variant)] mb-6">
              <strong>{job.title}</strong>{" "}
              へのご応募ありがとうございます。内容を確認の上、担当者よりご連絡いたします。
            </p>
          )}
          <Link
            href="/vacancy"
            className="inline-block px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors font-[family-name:var(--font-label)] text-sm"
          >
            求人一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[color:var(--color-surface)] px-6 pt-24 md:pt-28 pb-10">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <Link
            href="/vacancy"
            className="inline-flex items-center gap-1 text-xs text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] font-[family-name:var(--font-label)] mb-3"
          >
            <ArrowLeft size={14} /> Back to vacancies
          </Link>
          <p className="font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-[0.12em] uppercase text-[color:var(--color-secondary)] mb-1">
            求人に応募する
          </p>
          <h1 className="font-[family-name:var(--font-headline)] text-2xl md:text-3xl text-[color:var(--color-primary)] leading-tight">
            {job?.title ?? "求人応募フォーム"}
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
                応募者基本情報
              </legend>

              <Field label="氏名（フルネーム）" error={errors.full_name?.message}>
                <input
                  className={inputCls}
                  placeholder="山田 太郎"
                  {...register("full_name")}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label="生年月日"
                  error={errors.date_of_birth?.message}
                >
                  <input
                    type="date"
                    className={inputCls}
                    {...register("date_of_birth")}
                  />
                </Field>
                <Field label="性別" error={errors.gender?.message}>
                  <select
                    className={inputCls}
                    defaultValue=""
                    {...register("gender")}
                  >
                    <option value="" disabled>
                      選択してください
                    </option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {GENDER_LABELS[g]}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="電話番号" error={errors.phone_number?.message}>
                  <input
                    className={inputCls}
                    placeholder="090-1234-5678"
                    {...register("phone_number")}
                  />
                </Field>
                <Field label="メールアドレス" error={errors.email?.message}>
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                </Field>
              </div>

              <Field label="国籍" error={errors.country?.message}>
                <input
                  className={inputCls}
                  placeholder="日本"
                  {...register("country")}
                />
              </Field>

              <Field
                label="現住所"
                error={errors.current_address?.message}
              >
                <textarea
                  className={`${inputCls} resize-y min-h-[60px]`}
                  placeholder="現在お住まいの住所"
                  {...register("current_address")}
                />
              </Field>

              <Field
                label="Facebook URL"
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
                在留資格・勤務希望
              </legend>

              <Field
                label="最寄り駅"
                error={errors.nearest_station?.message}
              >
                <input
                  className={inputCls}
                  placeholder="例：新宿駅"
                  {...register("nearest_station")}
                />
              </Field>

              <Field
                label="在留資格（ビザの種類）"
                error={errors.residence_status?.message}
              >
                <select
                  className={inputCls}
                  defaultValue=""
                  {...register("residence_status")}
                >
                  <option value="" disabled>
                    選択してください
                  </option>
                  {RESIDENCE_STATUS_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {RESIDENCE_STATUS_LABELS[r]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="日本語能力"
                error={errors.japanese_ability?.message}
              >
                <select
                  className={inputCls}
                  defaultValue=""
                  {...register("japanese_ability")}
                >
                  <option value="" disabled>
                    選択してください
                  </option>
                  {JAPANESE_ABILITY_OPTIONS.map((j) => (
                    <option key={j} value={j}>
                      {JAPANESE_ABILITY_LABELS[j]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="勤務希望地"
                error={errors.preferred_location?.message}
              >
                <input
                  className={inputCls}
                  placeholder="例：東京、横浜、リモート"
                  {...register("preferred_location")}
                />
              </Field>

              <Field label="勤務可能形態（どのような勤務形態で働けるか）" error={errors.availability?.message}>
                <select
                  className={inputCls}
                  defaultValue=""
                  {...register("availability")}
                >
                  <option value="" disabled>
                    選択してください
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
                  label="学校名・出身校"
                  error={errors.school_college?.message}
                >
                  <input
                    className={inputCls}
                    placeholder="例：〇〇大学、〇〇専門学校"
                    {...register("school_college")}
                  />
                </Field>
                <Field label="学位・専攻" error={errors.degree?.message}>
                  <input
                    className={inputCls}
                    placeholder="例：学士（コンピュータサイエンス）"
                    {...register("degree")}
                  />
                </Field>
              </div>

              <Field
                label="勤務可能な曜日・日数"
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
                            {WORKING_DAY_LABELS[day]}
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
                書類添付・入力内容の確認
              </legend>

              <Field label="特徴・自身の強み（ソフトスキル）" error={errors.soft_skills?.message}>
                <textarea
                  className={`${inputCls} resize-y min-h-[80px]`}
                  placeholder="例：コミュニケーション力、チームワーク、問題解決力など"
                  {...register("soft_skills")}
                />
              </Field>

              <Field
                label="自己PR・志望動機"
                error={errors.cover_letter?.message}
              >
                <textarea
                  className={`${inputCls} resize-y min-h-[140px]`}
                  placeholder="ご自身の強みやアピールポイントをご記入ください"
                  {...register("cover_letter")}
                />
              </Field>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>履歴書・職務経歴書（任意、PDF / DOC / DOCX形式、5MB以下）</label>
                <label className="flex items-center gap-3 px-3 py-3 rounded border border-dashed border-[#c0cbc9] bg-[var(--color-container-low)] cursor-pointer hover:border-[var(--color-primary)]">
                  <Upload size={18} className="text-[color:var(--color-secondary)]" />
                  <span className="text-sm text-[color:var(--color-on-surface-variant)]">
                    {resumeFileMeta
                      ? `${resumeFileMeta.name} (${formatBytes(resumeFileMeta.size)})`
                      : "ファイルを選択してください"}
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
              <ArrowLeft size={14} /> 戻る
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-1 px-4 py-2 rounded bg-[var(--color-primary)] text-white font-[family-name:var(--font-label)] text-sm hover:opacity-90"
              >
                次へ <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1 px-5 py-2 rounded bg-[var(--color-secondary)] text-white font-[family-name:var(--font-label)] text-sm hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? "送信中…" : "この内容で応募する"}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const labels = ["基本情報", "就業状況・希望", "書類添付・確認"];
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
                ステップ {n}
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
    ["氏名", values.full_name],
    ["生年月日", values.date_of_birth],
    ["電話番号", values.phone_number],
    ["メールアドレス", values.email],
    ["性別", values.gender ? GENDER_LABELS[values.gender] : ""],
    ["国籍", values.country],
    ["現住所", values.current_address],
    ["最寄り駅", values.nearest_station],
    [
      "在留資格",
      values.residence_status
        ? RESIDENCE_STATUS_LABELS[values.residence_status]
        : "",
    ],
    [
      "日本語能力",
      values.japanese_ability ? JAPANESE_ABILITY_LABELS[values.japanese_ability] : "",
    ],
    ["勤務希望地", values.preferred_location],
    [
      "勤務可能形態",
      values.availability ? CONTRACT_LABELS[values.availability] : "",
    ],
    ["学校名", values.school_college],
    ["学位・専攻", values.degree],
    [
      "勤務可能な曜日・日数",
      (values.working_days ?? [])
        .map((d) => WORKING_DAY_LABELS[d] ?? d)
        .join("、"),
    ],
  ];
  return (
    <div className="rounded-lg bg-[var(--color-container-low)] p-4">
      <p className="font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-widest uppercase text-[color:var(--color-secondary)] mb-3">
        入力内容の確認
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

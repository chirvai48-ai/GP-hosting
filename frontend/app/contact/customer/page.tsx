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
            {s === 1 ? "基本情報の入力" : "希望条件・履歴書添付"}
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
    throw new Error(body?.error?.formErrors?.[0] || body?.message || "送信に失敗しました");
  }
  return res.json();
}

export default function CustomerContactPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
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
      if (!putRes.ok) throw new Error("履歴書のアップロードに失敗しました。お手数ですが、もう一度お試しください。");
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
          <CheckCircle2 size={48} className="mx-auto text-[color:var(--color-primary)] mb-4" />
          <h1 className="font-[family-name:var(--font-headline)] text-2xl text-[color:var(--color-on-surface)] mb-2">
            ご登録が完了いたしました
          </h1>
          <p className="font-[family-name:var(--font-body)] text-sm text-[color:var(--color-on-surface-variant)] mb-6">
            ご登録いただき誠にありがとうございます。内容を確認の上、ご経歴やご希望にマッチする求人がございましたら、担当者よりご連絡いたします。
          </p>
          <Link
            href="/vacancy"
            className="inline-block px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors font-[family-name:var(--font-label)] text-sm"
          >
            募集中の求人を見る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[color:var(--color-surface)] px-6 pt-24 md:pt-28 pb-10 overflow-hidden">
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
          <ArrowLeft size={14} /> ホームへ戻る
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-start">
          {/* Left: hero panel */}
          <aside className="lg:sticky lg:top-10 flex flex-col gap-5">
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/message.jpg"
                alt="お仕事を検索中の皆様"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/85 via-[var(--color-primary)]/30 to-transparent" />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-[family-name:var(--font-label)] tracking-[0.18em] uppercase mb-3">
                  <Sparkles size={12} /> 求職者様向けご登録・お問い合わせ
                </span>
                <h1 className="font-[family-name:var(--font-headline)] text-3xl md:text-4xl leading-tight mb-2">
                  あなたに本当にマッチするキャリアを、ともに。
                </h1>
                <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-white/90 max-w-sm">
                  求職者様のご相談窓口です。
                  お問合せには可能な限り迅速にお答えできるよう心がけておりますが、内容によってはお時間をいただく場合、お答えできない場合がございます。予めご了承ください。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[rgba(20,86,82,0.1)] p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[
                { n: "500名以上", l: "内定・就職実績" },
                { n: "120社以上", l: "パートナー企業数" },
                { n: "48時間以内", l: "平均レスポンス時間" },
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
              <div className="flex items-start gap-2"><MapPin size={14} className="mt-1 shrink-0 text-[var(--color-primary)]" /> 〒171-0014 東京都豊島区池袋2-36-1 6階</div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-[var(--color-primary)]" /> info@glowing-partner.jp</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-[var(--color-primary)]" /> <a href="tel:05017903742" className="hover:text-[var(--color-primary)]">050-1790-3742</a></div>
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
                応募者基本情報
              </legend>

              <Field label="氏名（フルネーム）" error={errors.full_name?.message}>
                <input className={inputCls} placeholder="Yamada Taro" {...register("full_name")} />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="メールアドレス" error={errors.email?.message}>
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                </Field>
                <Field label="電話番号" error={errors.phone_number?.message}>
                  <input
                    className={inputCls}
                    placeholder="090-1234-5678"
                    {...register("phone_number")}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="生年月日" error={errors.date_of_birth?.message}>
                  <input type="date" className={inputCls} {...register("date_of_birth")} />
                </Field>
                <Field label="性別（任意）" error={errors.gender?.message}>
                  <select className={inputCls} defaultValue="" {...register("gender")}>
                    <option value="">選択してください</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="現住所" error={errors.current_address?.message}>
                <textarea
                  className={`${inputCls} resize-y min-h-[60px]`}
                  placeholder="現在お住まいの住所"
                  {...register("current_address")}
                />
              </Field>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 px-8 py-2.5 bg-[var(--color-primary)] text-white font-[family-name:var(--font-label)] text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
                >
                  次へ <ArrowRight size={14} />
                </button>
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="flex flex-col gap-5" disabled={isPending}>
              <legend className="font-[family-name:var(--font-headline)] text-lg text-[color:var(--color-on-surface)] mb-2">
                希望条件・履歴書
              </legend>

              <Field label="勤務希望地" error={errors.preferred_location?.message}>
                <input
                  className={inputCls}
                  placeholder="例：東京、大阪"
                  {...register("preferred_location")}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="在留資格 / ビザの種類（任意）" error={errors.residence_status?.message}>
                  <select className={inputCls} defaultValue="" {...register("residence_status")}>
                    <option value="">選択してください</option>
                    {RESIDENCE_STATUS_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {RESIDENCE_STATUS_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="日本語能力（任意）" error={errors.japanese_ability?.message}>
                  <select className={inputCls} defaultValue="" {...register("japanese_ability")}>
                    <option value="">選択してください</option>
                    {JAPANESE_ABILITY_OPTIONS.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="自己PR・備考（任意）" error={errors.cover_letter?.message}>
                <textarea
                  className={`${inputCls} resize-y min-h-[100px]`}
                  placeholder="ご自身の強みや、ご希望の職種・働き方などについてご自由にご入力ください"
                  {...register("cover_letter")}
                />
              </Field>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>履歴書・職務経歴書（任意、PDF / DOC / DOCX形式、5MB以下）</label>
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
                          ファイルを選択してアップロード
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

              <label className="flex items-center gap-2 text-sm text-[color:var(--color-on-surface)] font-[family-name:var(--font-body)]">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                利用規約およびプライバシーポリシーに同意します。
              </label>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] font-[family-name:var(--font-label)] text-sm tracking-widest uppercase hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} /> 戻る
                </button>
                <button
                  type="submit"
                  disabled={isPending || !agreed}
                  className="inline-flex items-center gap-2 px-8 py-2.5 bg-[var(--color-primary)] text-white font-[family-name:var(--font-label)] text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isPending ? "送信中…" : "この内容で登録する"}
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

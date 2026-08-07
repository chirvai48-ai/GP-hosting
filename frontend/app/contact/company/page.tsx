"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Briefcase, MapPin, Mail, Phone } from "lucide-react";
import {
  createCompanyInquirySchema,
  type CreateCompanyInquiryForm,
} from "@/schemas/contact.schemas";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

async function postCompanyInquiry(payload: CreateCompanyInquiryForm) {
  const res = await fetch(`${API_URL}/api/contacts/company-inquiries`, {
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

export default function CompanyContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyInquiryForm>({
    resolver: zodResolver(createCompanyInquirySchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", phone_number: "", subject: "", message: "" },
  });

  const { mutateAsync, isPending, error } = useMutation({ mutationFn: postCompanyInquiry });

  const onSubmit = async (data: CreateCompanyInquiryForm) => {
    await mutateAsync(data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-10 bg-[color:var(--color-surface)]">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-sm border border-[rgba(20,86,82,0.1)] p-10">
          <CheckCircle2 size={48} className="mx-auto text-[color:var(--color-primary)] mb-4" />
          <h1 className="font-[family-name:var(--font-headline)] text-2xl text-[color:var(--color-on-surface)] mb-2">
            お問い合わせの送信が完了いたしました
          </h1>
          <p className="font-[family-name:var(--font-body)] text-sm text-[color:var(--color-on-surface-variant)] mb-6">
            お問い合わせいただき誠にありがとうございます。内容を確認の上、担当者より折り返しご連絡いたします。今しばらくお待ちください。
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors font-[family-name:var(--font-label)] text-sm"
          >
            ホームへ戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[color:var(--color-surface)] px-6 py-10 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-40 w-[480px] h-[480px] rounded-full bg-[var(--color-primary)]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 w-[420px] h-[420px] rounded-full bg-[var(--color-secondary)]/15 blur-3xl"
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
                src="/Panel01.jpg"
                alt="採用パートナー企業様"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/85 via-[var(--color-primary)]/30 to-transparent" />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-[family-name:var(--font-label)] tracking-[0.18em] uppercase mb-3">
                  <Briefcase size={12} /> 企業様向けお問い合わせ
                </span>
                <h1 className="font-[family-name:var(--font-headline)] text-3xl md:text-4xl leading-tight mb-2">
                  貴社に真にマッチする確実な人材採用を。
                </h1>
                <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-white/90 max-w-sm">
                  Tell us what you&apos;re looking for and we&apos;ll match you with vetted talent from our network.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[rgba(20,86,82,0.1)] p-5">
              <p className="text-sm text-[color:var(--color-on-surface)] font-[family-name:var(--font-body)] leading-relaxed">
                企業様向けのご相談窓口です。
                <br />
                お問合せには可能な限り迅速にお答えできるよう心がけて
                おりますが、内容によってはお時間をいただく場合、お答えできない場合がございます。予めご了承ください。
              </p>
            </div>

            <div className="hidden lg:flex flex-col gap-2 text-sm text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-body)]">
              <div className="flex items-start gap-2"><MapPin size={14} className="mt-1 shrink-0 text-[var(--color-primary)]" /> 〒171-0014 東京都豊島区池袋2-36-1 6階</div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-[var(--color-primary)]" /> info@glowing-partner.jp</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-[var(--color-primary)]" /> <a href="tel:+81368419101" className="hover:text-[var(--color-primary)]">+81-3-6841-9101</a></div>
            </div>
          </aside>

          {/* Right: form */}
          <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border border-[rgba(20,86,82,0.1)] p-6 md:p-8"
        >
          <fieldset className="flex flex-col gap-5" disabled={isPending}>
            <legend className="font-[family-name:var(--font-headline)] text-lg text-[color:var(--color-on-surface)] mb-2">
              お問い合わせ情報の入力
            </legend>

            <Field label="貴社名・ご担当者様氏名" error={errors.name?.message}>
              <input className={inputCls} placeholder="例：株式会社〇〇" {...register("name")} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="メールアドレス" error={errors.email?.message}>
                <input
                  type="email"
                  className={inputCls}
                  placeholder="contact@company.com"
                  {...register("email")}
                />
              </Field>
              <Field label="電話番号" error={errors.phone_number?.message}>
                <input
                  className={inputCls}
                  placeholder="03-1234-5678"
                  {...register("phone_number")}
                />
              </Field>
            </div>

            <Field label="お問い合わせ項目 / 件名" error={errors.subject?.message}>
              <input
                className={inputCls}
                placeholder="お問い合わせの件名をご入力ください"
                {...register("subject")}
              />
            </Field>

            <Field label="お問い合わせ内容（具体的な採用ニーズなど）" error={errors.message?.message}>
              <textarea
                className={`${inputCls} resize-y min-h-[120px]`}
                placeholder="募集職種、人数、採用時期などのご希望についてご自由にご入力ください"
                {...register("message")}
              />
            </Field>

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

            <button
              type="submit"
              disabled={isPending || !agreed}
              className="mt-2 self-end px-8 py-2.5 bg-[var(--color-primary)] text-white font-[family-name:var(--font-label)] text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isPending ? "送信中…" : "この内容で送信する"}
            </button>
          </fieldset>
          </form>
        </div>
      </div>
    </main>
  );
}

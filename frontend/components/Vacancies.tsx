"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, CalendarDays, X, Clock, Briefcase, Users, Star, Award, FileText, Send } from "lucide-react";
import type { Job } from "@/types/table";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toISOString().substring(11, 16);
}

function formatSalary(min: number, max: number, currency: string) {
  const symbol = currency === "YEN" ? "¥" : currency === "USD" ? "$" : currency === "EUR" ? "€" : currency + " ";
  return `${symbol}${min.toLocaleString()} – ${symbol}${max.toLocaleString()}`;
}

function salaryLabel(contract: string) {
  return contract === "Part_time" ? "時給" : "月給";
}

const CONTRACT_LABEL: Record<string, string> = {
  Full_time: "正社員",
  Part_time: "パート・アルバイト",
  Internship: "インターン",
  Flexible: "Flexible",
};

const CONTRACT_STYLES: Record<string, string> = {
  Full_time: "bg-[#e8f4f3] text-[color:var(--color-primary)]",
  Part_time: "bg-[#fdf0d0] text-[#6b5a1e]",
  Internship: "bg-[#f0e8f4] text-[#6b1e6b]",
  Flexible: "bg-[#f2ece4] text-[#7a5c3a]",
};

// ── Job Detail Modal ───────────────────────────────────────────────────────
function JobDetailModal({ job, onClose }: { job: Job; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/80 hover:bg-gray-100 transition-colors"
        >
          <X size={18} className="text-[color:var(--color-on-surface-variant)]" />
        </button>

        {/* Header image */}
        <div className="relative w-full h-[70vh] rounded-t-2xl overflow-hidden bg-black">
          {job.image_url ? (
            <Image
              src={job.image_url}
              alt={job.title}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              priority
              className="object-contain"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
              <span className="text-white/50 text-8xl font-light font-headline select-none">
                {job.job_category?.name?.[0] ?? "?"}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Title, badges, and apply button */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-[color:var(--color-primary)] text-[#e0f0ef] font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded">
                  {job.job_category?.name ?? "—"}
                </span>
                <span className={`${CONTRACT_STYLES[job.contract] ?? "bg-gray-100 text-gray-600"} font-[family-name:var(--font-label)] text-[10px] font-medium px-2.5 py-1 rounded`}>
                  {CONTRACT_LABEL[job.contract] ?? job.contract}
                </span>
                {job.status === "Closed" && (
                  <span className="bg-red-500/90 text-white font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded">
                    募集終了
                  </span>
                )}
              </div>
              <h2 className="font-[family-name:var(--font-headline)] text-2xl font-medium leading-snug text-[color:var(--color-on-surface)]">
                {job.title}
              </h2>
            </div>
            <Link
              href={`/vacancy/${job.id}/apply`}
              onClick={onClose}
              className="shrink-0 px-3 py-1 text-xs rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] font-[family-name:var(--font-label)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors whitespace-nowrap"
            >
              この求人に応募する →
            </Link>
          </div>

          {/* Key info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InfoItem icon={<MapPin size={15} />} label="勤務地" value={job.location} />
            <InfoItem icon={<Briefcase size={15} />} label="必要経験・年数" value={`${job.experience} yr${job.experience !== 1 ? "s" : ""}`} />
            <InfoItem icon={<CalendarDays size={15} />} label="掲載日" value={formatDate(job.created_at)} />
            {job.shift_start && job.shift_end && (
              <InfoItem icon={<Clock size={15} />} label="シフト" value={`${formatTime(job.shift_start)} – ${formatTime(job.shift_end)}`} />
            )}
            {job.workdays != null && (
              <InfoItem icon={<CalendarDays size={15} />} label="出勤日数（週）" value={String(job.workdays)} />
            )}
            {job.gender && (
              <InfoItem icon={<Users size={15} />} label="性別" value={job.gender} />
            )}
          </div>

          {/* Salary */}
          <div className="bg-[#f2f4f3] rounded-xl px-5 py-4">
            <p className="font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-widest uppercase text-[color:var(--color-secondary)] mb-1">
              {salaryLabel(job.contract)}
            </p>
            <p className="font-[family-name:var(--font-headline)] text-2xl text-[color:var(--color-primary)]">
              {formatSalary(job.salary_min, job.salary_max, job.currency)}
            </p>
          </div>

          {/* Languages */}
          {job.languages?.length > 0 && (
            <TagSection
              icon={<Star size={14} />}
              label="活かせる言語・語学力"
              tags={job.languages.map((l) => l.name)}
              tagClass="bg-[#E1F5EE] text-[#0F6E56]"
            />
          )}

          {/* Technical Skills */}
          {job.technical_skills?.length > 0 && (
            <TagSection
              icon={<Award size={14} />}
              label="スキル・専門知識"
              tags={job.technical_skills.map((s) => s.name)}
              tagClass="bg-[#E6F1FB] text-[#185FA5]"
            />
          )}

          {/* Text sections */}
          {job.soft_skills && <TextSection icon={<Users size={14} />} label="求める人物像・強み" value={job.soft_skills} />}
          {job.requirements && <TextSection icon={<FileText size={14} />} label="応募資格・要件" value={job.requirements} />}
          {job.benefits && <TextSection icon={<Star size={14} />} label="福利厚生・待遇" value={job.benefits} />}
          {job.application_method && <TextSection icon={<Send size={14} />} label="応募方法" value={job.application_method} />}

        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1 font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-widest uppercase text-[color:var(--color-on-surface-variant)] mb-1">
        {icon} {label}
      </p>
      <p className="font-[family-name:var(--font-body)] text-sm text-[color:var(--color-on-surface)]">{value}</p>
    </div>
  );
}

function TagSection({ icon, label, tags, tagClass }: { icon: React.ReactNode; label: string; tags: string[]; tagClass: string }) {
  return (
    <div>
      <p className="flex items-center gap-1 font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-widest uppercase text-[color:var(--color-on-surface-variant)] mb-2">
        {icon} {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className={`${tagClass} text-xs font-medium px-2.5 py-1 rounded-full font-[family-name:var(--font-label)]`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function TextSection({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1 font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-widest uppercase text-[color:var(--color-on-surface-variant)] mb-2">
        {icon} {label}
      </p>
      <p className="font-[family-name:var(--font-body)] text-sm text-[color:var(--color-on-surface)] leading-relaxed whitespace-pre-wrap">
        {value}
      </p>
    </div>
  );
}

// ── Vacancy Card ───────────────────────────────────────────────────────────
function VacancyCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onClick={onClick}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[rgba(20,86,82,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(20,86,82,0.12)] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div className="relative aspect-square w-full overflow-hidden bg-[color:var(--color-container-low)]">
        {job.image_url ? (
          <Image
            src={job.image_url}
            alt={job.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <span className="text-white/60 text-7xl font-light font-headline select-none">
              {job.job_category?.name?.[0] ?? "?"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 bg-[color:var(--color-primary)] text-[#e0f0ef] font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded">
          {job.job_category?.name ?? "—"}
        </span>
        <span className={`absolute bottom-3 right-3 ${CONTRACT_STYLES[job.contract] ?? "bg-gray-100 text-gray-600"} font-[family-name:var(--font-label)] text-[10px] font-medium px-2.5 py-1 rounded`}>
          {CONTRACT_LABEL[job.contract] ?? job.contract}
        </span>
        {job.status === "Closed" && (
          <span className="absolute top-3 right-3 bg-red-500/90 text-white font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded">
            募集終了
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 px-5 pt-2 pb-2">
        <h3 className="font-[family-name:var(--font-headline)] text-[14px] md:text-[16px] font-medium leading-snug text-[color:var(--color-on-surface)] mb-3">
          {job.title}
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
          <span className="flex items-center gap-1.5 text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-label)] text-[11px]">
            <MapPin size={15} /> {job.location}
          </span>
          <span className="flex items-center gap-1.5 text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-label)] text-[11px]">
            <CalendarDays size={15} /> {formatDate(job.created_at)}
          </span>
        </div>
        <div className="border-t border-[rgba(20,86,82,0.1)] mb-2" />
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="font-[family-name:var(--font-label)] text-[11px] font-semibold text-[color:var(--color-secondary)]">{salaryLabel(job.contract)}</span>
          <span className="font-[family-name:var(--font-display)] text-[16px] font-medium text-[color:var(--color-primary)] leading-none tracking-tight">
            {formatSalary(job.salary_min, job.salary_max, job.currency)}
          </span>
        </div>
      </div>

      {/* Apply button */}
      <div className="px-5 pb-5">
        <Link
          href={`/vacancy/${job.id}/apply`}
          onClick={(e) => e.stopPropagation()}
          className={`block text-center w-full font-[family-name:var(--font-label)] text-[12px] font-medium tracking-wide border rounded-md py-2 transition-all duration-200 ${
            hovered
              ? "bg-[color:var(--color-primary)] text-[#e0f0ef] border-[color:var(--color-primary)]"
              : "bg-transparent text-[color:var(--color-primary)] border-[color:var(--color-primary)]"
          }`}
        >
          求人に応募する →
        </Link>
      </div>

      <div className={`absolute bottom-0 left-0 h-[3px] bg-[color:var(--color-secondary)] transition-all duration-300 ${hovered ? "w-full" : "w-0"}`} />
    </article>
  );
}

// ── VacancySection ─────────────────────────────────────────────────────────
type VacancySectionProps = {
  jobs: Job[];
  totalCount: number;
  isPending: boolean;
  isError: boolean;
  onClearFilters: () => void;
};

export default function VacancySection({
  jobs,
  totalCount,
  isPending,
  isError,
  onClearFilters,
}: VacancySectionProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <section className="flex-1 min-w-0 py-6">
      <div className="mb-6">
        <div className="border-l-[3px] border-[color:var(--color-secondary)] pl-5">
          <p className="font-[family-name:var(--font-label)] text-[10px] md:text-[11px] font-semibold tracking-[0.12em] uppercase text-[color:var(--color-secondary)] mb-1">
            採用情報
          </p>
          <h1 className="font-[family-name:var(--font-headline)] text-[24px] md:text-[32px] font-normal italic text-[color:var(--color-primary)] leading-[1.1]">
            募集中の求人一覧
          </h1>
        </div>
      </div>

      <div>
        {isPending && (
          <div className="flex items-center justify-center py-24 text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-label)]">
            求人情報を読み込んでいます…
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center py-24 text-red-500 font-[family-name:var(--font-label)]">
            求人情報の読み込みに失敗しました。
          </div>
        )}
        {!isPending && !isError && jobs.length === 0 && totalCount === 0 && (
          <div className="flex items-center justify-center py-24 text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-label)]">
            現在、募集中の求人はございません。
          </div>
        )}
        {!isPending && !isError && jobs.length === 0 && totalCount > 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-label)]">
              選択された条件に一致する求人が見つかりませんでした。
            </p>
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-xs rounded border border-[var(--color-primary)] text-[var(--color-primary)] font-[family-name:var(--font-label)] tracking-widest uppercase hover:bg-[var(--color-primary)] hover:text-white transition-colors"
            >
              検索条件をクリアする
            </button>
          </div>
        )}
        {jobs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <VacancyCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        )}
      </div>

      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </section>
  );
}

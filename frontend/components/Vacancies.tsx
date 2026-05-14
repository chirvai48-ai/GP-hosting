"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, CalendarDays, X, Clock, Briefcase, Users, Star, Award, FileText, Send } from "lucide-react";
import type { Job, JobsResponse } from "@/types/table";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getJobs(): Promise<JobsResponse> {
  const res = await fetch(`${API_URL}/api/jobs`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

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

const CONTRACT_LABEL: Record<string, string> = {
  Full_time: "Full-time",
  Part_time: "Part-time",
  Internship: "Internship",
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
        <div className="relative w-full rounded-t-2xl overflow-hidden bg-black">
          {job.image_url ? (
            <img src={job.image_url} alt={job.title} className="w-full h-auto max-h-[70vh] object-contain" />
          ) : (
            <div className="h-52 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
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
              </div>
              <h2 className="font-[family-name:var(--font-headline)] text-2xl font-medium leading-snug text-[color:var(--color-on-surface)]">
                {job.title}
              </h2>
            </div>
            <button className="shrink-0 px-3 py-1 text-xs rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] font-[family-name:var(--font-label)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors whitespace-nowrap">
              Apply to this job →
            </button>
          </div>

          {/* Key info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InfoItem icon={<MapPin size={15} />} label="Location" value={job.location} />
            <InfoItem icon={<Briefcase size={15} />} label="Experience" value={`${job.experience} yr${job.experience !== 1 ? "s" : ""}`} />
            <InfoItem icon={<CalendarDays size={15} />} label="Posted" value={formatDate(job.created_at)} />
            {job.shift_start && job.shift_end && (
              <InfoItem icon={<Clock size={15} />} label="Shift" value={`${formatTime(job.shift_start)} – ${formatTime(job.shift_end)}`} />
            )}
            {job.workdays != null && (
              <InfoItem icon={<CalendarDays size={15} />} label="Days / week" value={String(job.workdays)} />
            )}
            {job.gender && (
              <InfoItem icon={<Users size={15} />} label="Gender" value={job.gender} />
            )}
          </div>

          {/* Salary */}
          <div className="bg-[#f2f4f3] rounded-xl px-5 py-4">
            <p className="font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-widest uppercase text-[color:var(--color-secondary)] mb-1">
              Annual Salary
            </p>
            <p className="font-[family-name:var(--font-headline)] text-2xl text-[color:var(--color-primary)]">
              {formatSalary(job.salary_min, job.salary_max, job.currency)}
            </p>
          </div>

          {/* Languages */}
          {job.languages?.length > 0 && (
            <TagSection
              icon={<Star size={14} />}
              label="Languages"
              tags={job.languages.map((l) => l.name)}
              tagClass="bg-[#E1F5EE] text-[#0F6E56]"
            />
          )}

          {/* Technical Skills */}
          {job.technical_skills?.length > 0 && (
            <TagSection
              icon={<Award size={14} />}
              label="Technical Skills"
              tags={job.technical_skills.map((s) => s.name)}
              tagClass="bg-[#E6F1FB] text-[#185FA5]"
            />
          )}

          {/* Text sections */}
          {job.soft_skills && <TextSection icon={<Users size={14} />} label="Soft Skills" value={job.soft_skills} />}
          {job.requirements && <TextSection icon={<FileText size={14} />} label="Requirements" value={job.requirements} />}
          {job.benefits && <TextSection icon={<Star size={14} />} label="Benefits" value={job.benefits} />}
          {job.application_method && <TextSection icon={<Send size={14} />} label="How to Apply" value={job.application_method} />}

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
          <img
            src={job.image_url}
            alt={job.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          <span className="font-[family-name:var(--font-label)] text-[11px] font-semibold text-[color:var(--color-secondary)]">Annual</span>
          <span className="font-[family-name:var(--font-display)] text-[16px] font-medium text-[color:var(--color-primary)] leading-none tracking-tight">
            {formatSalary(job.salary_min, job.salary_max, job.currency)}
          </span>
        </div>
      </div>

      {/* Apply button */}
      <div className="px-5 pb-5">
        <button
          className={`w-full font-[family-name:var(--font-label)] text-[12px] font-medium tracking-wide border rounded-md py-2 transition-all duration-200 ${
            hovered
              ? "bg-[color:var(--color-primary)] text-[#e0f0ef] border-[color:var(--color-primary)]"
              : "bg-transparent text-[color:var(--color-primary)] border-[color:var(--color-primary)]"
          }`}
        >
          Apply Now →
        </button>
      </div>

      <div className={`absolute bottom-0 left-0 h-[3px] bg-[color:var(--color-secondary)] transition-all duration-300 ${hovered ? "w-full" : "w-0"}`} />
    </article>
  );
}

// ── VacancySection ─────────────────────────────────────────────────────────
export default function VacancySection() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["jobs-public"],
    queryFn: getJobs,
  });

  const jobs = (data?.data ?? []).filter((j) => j.status === "Published");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <section className="min-h-screen bg-[color:var(--color-surface)] px-6 py-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto mb-6">
        <div className="border-l-[3px] border-[color:var(--color-secondary)] pl-5">
          <p className="font-[family-name:var(--font-label)] text-[10px] md:text-[11px] font-semibold tracking-[0.12em] uppercase text-[color:var(--color-secondary)] mb-1">
            We're hiring
          </p>
          <h1 className="font-[family-name:var(--font-headline)] text-[24px] md:text-[32px] font-normal italic text-[color:var(--color-primary)] leading-[1.1]">
            Open Positions
          </h1>
          <p className="font-[family-name:var(--font-label)] text-[10px] md:text-[11px] text-[color:var(--color-on-surface-variant)] mt-2">
            {isPending ? "Loading…" : `${jobs.length} vacancies across all departments`}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {isPending && (
          <div className="flex items-center justify-center py-24 text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-label)]">
            Loading positions…
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center py-24 text-red-500 font-[family-name:var(--font-label)]">
            Failed to load vacancies.
          </div>
        )}
        {!isPending && !isError && jobs.length === 0 && (
          <div className="flex items-center justify-center py-24 text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-label)]">
            No open positions at the moment.
          </div>
        )}
        {jobs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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

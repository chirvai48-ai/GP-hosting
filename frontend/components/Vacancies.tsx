"use client";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
// ── Types ──────────────────────────────────────────────────────────────────
interface Vacancy {
  id: number;
  title: string;
  department: string;
  salary: string;
  type: "Full-time" | "Part-time" | "Contract";
  datePosted: string;
  location: string;
  image: string;
}

// ── Dummy Data ─────────────────────────────────────────────────────────────
const vacancies: Vacancy[] = [
  {
    id: 1,
    title: "Senior Product Designer",
    department: "Design",
    salary: "¥8,500,000",
    type: "Full-time",
    datePosted: "Apr 14, 2025",
    location: "Tokyo",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    department: "Engineering",
    salary: "¥11,200,000",
    type: "Full-time",
    datePosted: "Apr 10, 2025",
    location: "Osaka",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Marketing Manager",
    department: "Marketing",
    salary: "¥7,800,000",
    type: "Full-time",
    datePosted: "Apr 7, 2025",
    location: "Tokyo",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Financial Analyst",
    department: "Finance",
    salary: "¥9,300,000",
    type: "Contract",
    datePosted: "Apr 3, 2025",
    location: "Nagoya",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    title: "UX Researcher",
    department: "Design",
    salary: "¥7,200,000",
    type: "Part-time",
    datePosted: "Mar 28, 2025",
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    department: "Engineering",
    salary: "¥12,500,000",
    type: "Full-time",
    datePosted: "Mar 22, 2025",
    location: "Tokyo",
    image:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&auto=format&fit=crop&q=80",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const TYPE_STYLES: Record<Vacancy["type"], string> = {
  "Full-time": "bg-[#e8f4f3] text-[color:var(--color-primary)]",
  "Part-time": "bg-[#fdf0d0] text-[#6b5a1e]",
  Contract: "bg-[#f2ece4] text-[#7a5c3a]",
};

// ── VacancyCard ────────────────────────────────────────────────────────────
function VacancyCard({ vacancy }: { vacancy: Vacancy }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[rgba(20,86,82,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(20,86,82,0.12)] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Square image — aspect-square enforces 1:1 ratio */}
      <div className="relative aspect-square w-full overflow-hidden bg-[color:var(--color-container-low)]">
        <Image
          src={vacancy.image}
          alt={vacancy.title}
          fill
          className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Bottom gradient for legibility of the type tag */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Department badge — top left */}
        <span className="absolute top-3 left-3 bg-[color:var(--color-primary)] text-[#e0f0ef] font-[family-name:var(--font-label)] text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded">
          {vacancy.department}
        </span>

        {/* Employment type — bottom right */}
        <span
          className={`absolute bottom-3 right-3 ${TYPE_STYLES[vacancy.type]} font-[family-name:var(--font-label)] text-[10px] font-medium px-2.5 py-1 rounded`}
        >
          {vacancy.type}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 px-5 pt-2 pb-2">
        {/* Title */}
        <h3 className="font-[family-name:var(--font-headline)] text-[14px] md:text-[16px] font-medium leading-snug text-[color:var(--color-on-surface)] mb-3">
          {vacancy.title}
        </h3>

        {/* Location & date */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
          <span className="flex items-center gap-1.5 text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-label)] text-[11px]">
            <MapPin size={15} />
            {vacancy.location}
          </span>
          <span className="flex items-center gap-1.5 text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-label)] text-[11px]">
            <CalendarDays size={15} />
            {vacancy.datePosted}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-[rgba(20,86,82,0.1)] mb-2" />

        {/* Salary */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="font-[family-name:var(--font-label)] text-[11px] font-semibold text-[color:var(--color-secondary)]">
            Annual
          </span>
          <span className="font-[family-name:var(--font-display)] text-[18px] font-medium text-[color:var(--color-primary)] leading-none tracking-tight">
            {vacancy.salary}
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

      {/* Gold accent line sweeps in on hover */}
      <div
        className={`absolute bottom-0 left-0 h-[3px] bg-[color:var(--color-secondary)] transition-all duration-300 ${
          hovered ? "w-full" : "w-0"
        }`}
      />
    </article>
  );
}

// ── VacancySection (main export) ───────────────────────────────────────────
export default function VacancySection() {
  return (
    <section className="min-h-screen bg-[color:var(--color-surface)] px-6 py-6 md:px-12 lg:px-20">
      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="border-l-[3px] border-[color:var(--color-secondary)] pl-5">
          <p className="font-[family-name:var(--font-label)] text-[10px] md:text-[11px] font-semibold tracking-[0.12em] uppercase text-[color:var(--color-secondary)] mb-1">
            We're hiring
          </p>
          <h1 className="font-[family-name:var(--font-headline)] text-[24px] md:text-[32px] font-normal italic text-[color:var(--color-primary)] leading-[1.1]">
            Open Positions
          </h1>
          <p className="font-[family-name:var(--font-label)] text-[10px] md:text-[11px] text-[color:var(--color-on-surface-variant)] mt-2">
            {vacancies.length} vacancies across all departments
          </p>
        </div>
      </div>

      {/* Vacancy grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {vacancies.map((vacancy) => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </div>
      </div>
    </section>
  );
}

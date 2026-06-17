"use client";

import { motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const businesses = [
  { slug: "career-counseling", label: "Job Search Support", number: "01" },
  { slug: "staffing", label: "Temporary Staffing", number: "02" },
  { slug: "placement", label: "Recruitment & Placement", number: "03" },
  { slug: "ssw-support", label: "Specified Skilled Worker Support", number: "04" },
];

const totalLabel = String(businesses.length).padStart(2, "0");

export function BusinessProgressRail() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const currentSlug = pathname?.split("/").pop();

  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-[color:var(--color-secondary)] origin-left z-[60]"
      />

      <nav className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
        {businesses.map((b) => {
          const active = b.slug === currentSlug;
          return (
            <Link
              key={b.slug}
              href={`/business/${b.slug}`}
              className="group flex items-center justify-end gap-3"
            >
              <span
                className={`font-[var(--font-label)] text-[10px] tracking-[0.3em] uppercase transition-all duration-300 ${
                  active
                    ? "opacity-100 text-[color:var(--color-primary)]"
                    : "opacity-0 group-hover:opacity-70 text-[color:var(--color-on-surface)]"
                }`}
              >
                {b.label}
              </span>
              <span
                className={`block transition-all duration-500 ${
                  active
                    ? "h-8 w-[2px] bg-[color:var(--color-primary)]"
                    : "h-4 w-[2px] bg-[color:var(--color-on-surface)]/30 group-hover:bg-[color:var(--color-on-surface)]/60"
                }`}
              />
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function NextBusinessCue() {
  const pathname = usePathname();
  const currentSlug = pathname?.split("/").pop();
  const currentIdx = businesses.findIndex((b) => b.slug === currentSlug);
  const next = businesses[(currentIdx + 1) % businesses.length];
  if (!next) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.8 }}
      className="border-t border-[color:var(--color-on-surface)]/10 bg-[color:var(--color-surface)]"
    >
      <Link
        href={`/business/${next.slug}`}
        className="group block max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28"
      >
        <p className="font-[var(--font-label)] text-[10px] tracking-[0.4em] uppercase text-[color:var(--color-on-surface-variant)] mb-4">
          Next &mdash; {next.number} / {totalLabel}
        </p>
        <div className="flex items-baseline justify-between gap-6">
          <h3 className="font-display text-4xl md:text-6xl text-[color:var(--color-on-surface)] transition-colors duration-500 group-hover:text-[color:var(--color-primary)]">
            {next.label}.
          </h3>
          <motion.span
            aria-hidden
            whileHover={{ x: 12 }}
            className="font-display italic text-3xl md:text-5xl text-[color:var(--color-secondary)] inline-block"
          >
            &rarr;
          </motion.span>
        </div>
        <div className="mt-6 h-px w-full bg-[color:var(--color-on-surface)]/10 relative overflow-hidden">
          <span className="absolute inset-y-0 left-0 w-0 group-hover:w-full bg-[color:var(--color-primary)] transition-all duration-[900ms] ease-out" />
        </div>
      </Link>
    </motion.div>
  );
}

"use client";

import { motion } from "motion/react";

export type Stat = {
  value: string;
  label: string;
  sub?: string;
};

export default function StatGraphic({
  eyebrow,
  heading,
  headingNowrap,
  stats,
}: {
  eyebrow?: string;
  heading?: string;
  headingNowrap?: boolean;
  stats: Stat[];
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24 border-t border-[color:var(--color-on-surface)]/10">
      {(eyebrow || heading) && (
        <div className="mb-12 max-w-3xl">
          {eyebrow && (
            <p className="font-[var(--font-label)] text-[10px] tracking-[0.4em] uppercase text-[color:var(--color-primary)] mb-4">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2
              className={`font-display text-3xl md:text-4xl lg:text-5xl leading-tight text-[color:var(--color-on-surface)] ${
                headingNowrap ? "whitespace-nowrap" : ""
              }`}
            >
              {heading}
            </h2>
          )}
        </div>
      )}
      <div className={`grid gap-px bg-[color:var(--color-on-surface)]/10 ${stats.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="bg-white p-8 md:p-10"
          >
            <div className="font-display text-5xl md:text-6xl text-[color:var(--color-primary)] leading-none">
              {s.value}
            </div>
            <div className="mt-5 font-[var(--font-label)] text-[11px] tracking-[0.3em] uppercase text-[color:var(--color-on-surface)]">
              {s.label}
            </div>
            {s.sub && (
              <div className="mt-3 text-sm leading-relaxed text-[color:var(--color-on-surface-variant)] font-[var(--font-label)]">
                {s.sub}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

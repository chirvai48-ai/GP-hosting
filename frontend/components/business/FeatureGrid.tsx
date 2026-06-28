"use client";

import { motion } from "motion/react";

export type Feature = {
  title: string;
  body: string;
  icon?: React.ReactNode;
};

export default function FeatureGrid({
  eyebrow,
  heading,
  features,
}: {
  eyebrow?: string;
  heading?: string;
  features: Feature[];
}) {
  const cols = features.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : features.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
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
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight text-[color:var(--color-on-surface)]">
              {heading}
            </h2>
          )}
        </div>
      )}
      <div className={`grid gap-6 ${cols}`}>
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="border border-[color:var(--color-on-surface)]/10 p-8 hover:border-[color:var(--color-primary)]/40 transition-colors duration-300 bg-white"
          >
            {f.icon && (
              <div className="mb-6 text-[color:var(--color-primary)]">{f.icon}</div>
            )}
            <h3 className="font-display text-xl md:text-2xl text-[color:var(--color-on-surface)] leading-snug">
              {f.title}
            </h3>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-[color:var(--color-on-surface-variant)] font-[var(--font-label)]">
              {f.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

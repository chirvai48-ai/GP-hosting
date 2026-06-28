"use client";

import { motion } from "motion/react";

export default function ExternalLinkCard({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5 }}
        className="group block border border-[color:var(--color-on-surface)]/15 hover:border-[color:var(--color-primary)] transition-colors duration-300 p-8 md:p-10 bg-[color:var(--color-surface)]"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="font-[var(--font-label)] text-[10px] tracking-[0.4em] uppercase text-[color:var(--color-primary)] mb-3">
                {eyebrow}
              </p>
            )}
            <h3 className="font-display text-2xl md:text-3xl text-[color:var(--color-on-surface)] leading-snug">
              {title}
            </h3>
            {description && (
              <p className="mt-3 text-sm md:text-base text-[color:var(--color-on-surface-variant)] font-[var(--font-label)] leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 font-[var(--font-label)] text-[11px] tracking-[0.3em] uppercase text-[color:var(--color-primary)]">
            <span className="border-b border-[color:var(--color-primary)] pb-1 group-hover:tracking-[0.4em] transition-all duration-300">
              {linkLabel}
            </span>
            <motion.span aria-hidden whileHover={{ x: 4 }} className="text-lg">
              &rarr;
            </motion.span>
          </div>
        </div>
      </motion.a>
    </section>
  );
}

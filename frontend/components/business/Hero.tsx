"use client";

import { motion } from "motion/react";

export default function Hero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16 md:pb-24">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-[var(--font-label)] text-[11px] tracking-[0.4em] uppercase text-[color:var(--color-primary)]"
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-[color:var(--color-on-surface)] max-w-4xl"
      >
        {title}
      </motion.h1>
      {lede && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-8 max-w-3xl text-lg md:text-xl leading-relaxed text-[color:var(--color-on-surface-variant)] font-[var(--font-label)] font-normal"
        >
          {lede}
        </motion.p>
      )}
    </section>
  );
}

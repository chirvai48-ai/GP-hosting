"use client";

import { motion } from "motion/react";
import Link from "next/link";

type Props = {
  kicker: string;
  headline: string;
  body: string;
  href: string;
  ctaLabel: string;
  image: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function ContactCTA({
  kicker,
  headline,
  body,
  href,
  ctaLabel,
  image,
}: Props) {
  return (
    <section className="relative border-t border-[color:var(--color-on-surface)]/10 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[color:var(--color-surface)]/85" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <motion.p
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="font-[var(--font-label)] text-[11px] tracking-[0.4em] uppercase text-[color:var(--color-secondary)] mb-6"
        >
          {kicker}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl leading-[1.05] text-[color:var(--color-on-surface)] max-w-3xl"
        >
          {headline}
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.3 }}
          className="mt-8 h-px w-20 bg-[color:var(--color-primary)] origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.35 }}
          className="mt-8 font-display text-lg md:text-xl leading-relaxed text-[color:var(--color-on-surface-variant)] max-w-2xl"
        >
          {body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.5 }}
          className="mt-12"
        >
          <Link
            href={href}
            className="group inline-flex items-center gap-5 px-8 py-5 bg-[color:var(--color-primary)] text-white relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-[color:var(--color-secondary)] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
            <span className="relative font-[var(--font-label)] text-xs tracking-[0.3em] uppercase">
              {ctaLabel}
            </span>
            <motion.span
              aria-hidden
              className="relative font-display italic text-2xl"
              animate={{ x: [0, 6, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              &rarr;
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

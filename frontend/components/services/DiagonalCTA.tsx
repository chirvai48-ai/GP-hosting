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

export default function DiagonalCTA({
  kicker,
  headline,
  body,
  href,
  ctaLabel,
  image,
}: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-[color:var(--color-primary)] md:h-[90vh] md:min-h-[600px]">
      {/* MOBILE: stacked photo + teal panel below */}
      <div className="md:hidden">
        <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden">
          <motion.img
            src={image}
            alt=""
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, ease: easeOut }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="px-6 py-16 text-white"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, x: -16 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="font-[var(--font-label)] text-[11px] tracking-[0.4em] uppercase text-[color:var(--color-secondary)] mb-5"
          >
            {kicker}
          </motion.p>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="font-display text-3xl sm:text-4xl leading-[1.05] mb-6"
          >
            {headline}
          </motion.h2>
          <motion.div
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="h-px w-14 bg-white/60 mb-6 origin-left"
          />
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="font-display text-base leading-relaxed text-white/85"
          >
            {body}
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="mt-8"
          >
            <Link
              href={href}
              className="group inline-flex items-center gap-4 px-6 py-4 bg-white text-[color:var(--color-primary)] relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-[color:var(--color-secondary)] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
              <span className="relative font-[var(--font-label)] text-[11px] tracking-[0.3em] uppercase">
                {ctaLabel}
              </span>
              <motion.span
                aria-hidden
                className="relative font-display italic text-xl"
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
        </motion.div>
      </div>

      {/* DESKTOP: diagonal split */}
      <div className="hidden md:block absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(0 0, 55% 0, 40% 100%, 0 100%)",
            WebkitClipPath: "polygon(0 0, 55% 0, 40% 100%, 0 100%)",
          }}
        >
          <motion.img
            src={image}
            alt=""
            initial={{ opacity: 0, x: "-3%" }}
            whileInView={{ opacity: 1, x: "0%" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.3, ease: easeOut }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: easeOut, delay: 0.3 }}
          style={{
            clipPath: "polygon(54.7% 0, 55.3% 0, 40.3% 100%, 39.7% 100%)",
            WebkitClipPath:
              "polygon(54.7% 0, 55.3% 0, 40.3% 100%, 39.7% 100%)",
          }}
          className="absolute inset-0 bg-[color:var(--color-secondary)] pointer-events-none"
        />

        <div className="absolute inset-0 flex items-center justify-end">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15%" }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.45 }}
            className="relative w-1/2 px-16 max-w-2xl text-white"
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, x: 24 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="font-[var(--font-label)] text-[11px] tracking-[0.45em] uppercase text-[color:var(--color-secondary)] mb-6"
            >
              {kicker}
            </motion.p>
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: easeOut }}
              className="font-display text-6xl leading-[1.02] mb-8"
            >
              {headline}
            </motion.h2>
            <motion.div
              variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="h-px w-16 bg-white/60 mb-8 origin-left"
            />
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="font-display text-lg leading-relaxed text-white/85"
            >
              {body}
            </motion.p>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: easeOut }}
              className="mt-10"
            >
              <Link
                href={href}
                className="group inline-flex items-center gap-5 px-8 py-5 bg-white text-[color:var(--color-primary)] relative overflow-hidden"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}

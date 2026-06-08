"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Props = {
  kicker: string;
  title: string;
  intro: string;
  image: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function DiagonalHero({ kicker, title, intro, image }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      data-navbar-tint="light"
      className="relative h-screen min-h-[600px] w-full overflow-hidden"
    >
      {/* MOBILE: photo as full background with dark overlay */}
      <div className="md:hidden absolute inset-0">
        <motion.img
          src={image}
          alt=""
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, ease: easeOut }}
          style={{ y: imageY }}
          className="absolute inset-0 h-[120%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* DESKTOP: diagonal photo on the right (static clip) */}
      <div
        className="hidden md:block absolute inset-0"
        style={{
          clipPath: "polygon(40% 0, 100% 0, 100% 100%, 25% 100%)",
          WebkitClipPath: "polygon(40% 0, 100% 0, 100% 100%, 25% 100%)",
        }}
      >
        <motion.img
          src={image}
          alt=""
          initial={{ opacity: 0, x: "3%" }}
          animate={{ opacity: 1, x: "0%" }}
          transition={{ duration: 1.4, ease: easeOut, delay: 0.15 }}
          style={{ y: imageY }}
          className="absolute inset-0 h-[108%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Surface-tinted fade over the photo's left edge — lifts text readability
          without darkening the photo or moving the diagonal */}
      <div
        aria-hidden
        className="hidden md:block absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, var(--color-surface) 0%, var(--color-surface) 30%, rgba(248,250,248,0.85) 42%, rgba(248,250,248,0) 55%)",
        }}
      />

      {/* Gold diagonal seam (desktop only) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: easeOut, delay: 0.6 }}
        style={{
          clipPath: "polygon(39.7% 0, 40.3% 0, 25.3% 100%, 24.7% 100%)",
          WebkitClipPath:
            "polygon(39.7% 0, 40.3% 0, 25.3% 100%, 24.7% 100%)",
        }}
        className="hidden md:block absolute inset-0 bg-[color:var(--color-secondary)] pointer-events-none"
      />

      {/* Ghost word (hidden on small mobile to reduce clutter) */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="hidden sm:block absolute -bottom-6 -left-4 font-display italic text-[140px] sm:text-[180px] md:text-[280px] leading-none text-white/[0.06] md:text-[color:var(--color-on-surface)]/[0.04] select-none pointer-events-none"
      >
        Glowing
      </motion.span>

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center"
      >
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.4 }}
            className="font-[var(--font-label)] text-[11px] tracking-[0.45em] uppercase text-[color:var(--color-secondary)] mb-6 flex items-center gap-3"
          >
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 24 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="inline-block h-px bg-[color:var(--color-secondary)]"
            />
            {kicker}
          </motion.p>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.98] text-white md:text-[color:var(--color-on-surface)] overflow-hidden">
            {title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  ease: easeOut,
                  delay: 0.55 + i * 0.1,
                }}
                className="inline-block mr-[0.22em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: easeOut, delay: 1.1 }}
            className="mt-8 h-px w-20 bg-[color:var(--color-primary)] origin-left"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeOut, delay: 1.25 }}
            className="mt-8 font-display italic text-base sm:text-lg md:text-xl text-white/85 md:text-[color:var(--color-on-surface-variant)] leading-relaxed"
          >
            {intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="mt-12 flex items-center gap-3 text-white/70 md:text-[color:var(--color-on-surface-variant)]"
          >
            <span className="font-[var(--font-label)] text-[10px] tracking-[0.4em] uppercase">
              Scroll
            </span>
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block h-8 w-px bg-white/50 md:bg-[color:var(--color-on-surface)]/40"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Props = {
  kicker: string;
  title: string;
  intro: string;
  image: string;
};

export default function BusinessHero({ kicker, title, intro, image }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      data-navbar-tint="light"
      className="relative h-[88vh] min-h-[560px] w-full overflow-hidden flex items-end"
    >
      <motion.img
        src={image}
        alt=""
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 h-[110%] w-full object-cover will-change-transform"
      />
      {/* Base darkening layer — full coverage so text is legible on any photo */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Bottom gradient for headline area */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20"
      />

      {/* Directional vignette pulling focus toward the lower-left text block */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_25%_85%,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.15)_55%,rgba(0,0,0,0)_85%)]"
      />

      {/* Animated decorative side rail */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="absolute left-6 md:left-10 top-24 bottom-24 w-px bg-white/30 origin-top"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-20 md:pb-28 w-full"
      >
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="font-[var(--font-label)] text-[11px] tracking-[0.45em] uppercase text-[color:var(--color-secondary)] mb-6 flex items-center gap-3"
        >
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: 24 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="inline-block h-px bg-[color:var(--color-secondary)]"
          />
          {kicker}
        </motion.p>

        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-white max-w-4xl overflow-hidden"
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}
        >
          {title.split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.4 + i * 0.12,
              }}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.9 }}
          className="mt-8 h-px w-20 bg-white/60 origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 1.05 }}
          className="mt-6 sm:mt-8 font-display italic text-base sm:text-xl md:text-2xl text-white max-w-2xl leading-relaxed"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
        >
          {intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-14 flex items-center gap-3 text-white/70"
        >
          <span className="font-[var(--font-label)] text-[10px] tracking-[0.4em] uppercase">
            Scroll
          </span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block h-8 w-px bg-white/50"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { useRef } from "react";

export type MagazineSectionData = {
  number: string;
  label: string;
  headline: string;
  body: string;
  image: string;
  spreadImage?: string;
  quote?: { text: string; attribution: string };
  bullets?: string[];
};

type Props = {
  data: MagazineSectionData;
  index: number;
};

const easeOut = [0.22, 1, 0.36, 1] as const;
const easeSoft = [0.4, 0, 0.2, 1] as const;

// ── 4 distinct choreographies, cycled by section index ──
type Variant = {
  // text column container — controls direction children come from
  textInitial: object;
  textAnimate: object;
  // staggered child item
  itemHidden: object;
  itemVisible: object;
  // headline reveal mode
  headlineMode: "words-up" | "mask-right" | "blur" | "letters";
  // image reveal panel: which edge does the cover panel exit toward
  panelOrigin: "origin-right" | "origin-left" | "origin-top" | "origin-bottom";
  // image entry transform
  imageInitial: object;
  imageAnimate: object;
  // number entry
  numberInitial: object;
  numberAnimate: object;
  // bullet direction
  bulletHidden: object;
  bulletVisible: object;
};

const variants: Variant[] = [
  // ── Variant A: classic vertical lift, wipe from the right ──
  {
    textInitial: { opacity: 0, y: 40 },
    textAnimate: { opacity: 1, y: 0 },
    itemHidden: { opacity: 0, y: 24 },
    itemVisible: { opacity: 1, y: 0 },
    headlineMode: "words-up",
    panelOrigin: "origin-right",
    imageInitial: { opacity: 0, y: 50 },
    imageAnimate: { opacity: 1, y: 0 },
    numberInitial: { opacity: 0, y: 60 },
    numberAnimate: { opacity: 1, y: 0 },
    bulletHidden: { opacity: 0, x: -12 },
    bulletVisible: { opacity: 1, x: 0 },
  },
  // ── Variant B: lateral slide-in, image cropped open vertically ──
  {
    textInitial: { opacity: 0, x: 60 },
    textAnimate: { opacity: 1, x: 0 },
    itemHidden: { opacity: 0, x: 32 },
    itemVisible: { opacity: 1, x: 0 },
    headlineMode: "mask-right",
    panelOrigin: "origin-bottom",
    imageInitial: { opacity: 0, scale: 1.15, filter: "blur(8px)" },
    imageAnimate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    numberInitial: { opacity: 0, x: -40, rotate: -8 },
    numberAnimate: { opacity: 1, x: 0, rotate: 0 },
    bulletHidden: { opacity: 0, y: 8 },
    bulletVisible: { opacity: 1, y: 0 },
  },
  // ── Variant C: blur-in, image scales from small with horizontal wipe ──
  {
    textInitial: { opacity: 0, filter: "blur(10px)" },
    textAnimate: { opacity: 1, filter: "blur(0px)" },
    itemHidden: { opacity: 0, scale: 0.92 },
    itemVisible: { opacity: 1, scale: 1 },
    headlineMode: "blur",
    panelOrigin: "origin-left",
    imageInitial: { opacity: 0, scale: 0.88 },
    imageAnimate: { opacity: 1, scale: 1 },
    numberInitial: { opacity: 0, scale: 0.4 },
    numberAnimate: { opacity: 1, scale: 1 },
    bulletHidden: { opacity: 0, scale: 0.95 },
    bulletVisible: { opacity: 1, scale: 1 },
  },
  // ── Variant D: lift from below, image curtain drops from top ──
  {
    textInitial: { opacity: 0, y: -32 },
    textAnimate: { opacity: 1, y: 0 },
    itemHidden: { opacity: 0, y: -16 },
    itemVisible: { opacity: 1, y: 0 },
    headlineMode: "letters",
    panelOrigin: "origin-top",
    imageInitial: { opacity: 0, x: -30 },
    imageAnimate: { opacity: 1, x: 0 },
    numberInitial: { opacity: 0, rotate: 12, y: -20 },
    numberAnimate: { opacity: 1, rotate: 0, y: 0 },
    bulletHidden: { opacity: 0, x: 12 },
    bulletVisible: { opacity: 1, x: 0 },
  },
];

function Headline({
  text,
  mode,
}: {
  text: string;
  mode: Variant["headlineMode"];
}) {
  if (mode === "words-up") {
    return (
      <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-[color:var(--color-on-surface)] mb-6">
        <span className="inline-block overflow-hidden align-bottom">
          {text.split(" ").map((w, i) => (
            <motion.span
              key={i}
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{
                duration: 0.8,
                ease: easeOut,
                delay: 0.15 + i * 0.06,
              }}
              className="inline-block mr-[0.22em]"
            >
              {w}
            </motion.span>
          ))}
        </span>
      </h2>
    );
  }

  if (mode === "mask-right") {
    return (
      <h2 className="relative font-display text-4xl md:text-5xl leading-[1.05] text-[color:var(--color-on-surface)] mb-6 overflow-hidden inline-block w-full">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.01, delay: 0.5 }}
          className="block"
        >
          {text}
        </motion.span>
        <motion.span
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: easeOut, delay: 0.2 }}
          className="absolute inset-0 bg-[color:var(--color-surface)] origin-right"
          aria-hidden
        />
      </h2>
    );
  }

  if (mode === "blur") {
    return (
      <motion.h2
        initial={{ opacity: 0, filter: "blur(12px)", y: 12 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.1, ease: easeSoft, delay: 0.2 }}
        className="font-display text-4xl md:text-5xl leading-[1.05] text-[color:var(--color-on-surface)] mb-6"
      >
        {text}
      </motion.h2>
    );
  }

  // letters
  return (
    <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-[color:var(--color-on-surface)] mb-6">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{
            duration: 0.5,
            ease: easeOut,
            delay: 0.2 + i * 0.018,
          }}
          className="inline-block whitespace-pre"
        >
          {ch}
        </motion.span>
      ))}
    </h2>
  );
}

function FeatureSpread({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Gentle parallax only — no wipes, no scale, no blur
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 1.4, ease: easeSoft }}
      className="mt-20 relative h-[55vh] min-h-[420px] w-full overflow-hidden"
    >
      <motion.img
        src={src}
        alt=""
        style={{ y }}
        className="absolute inset-0 h-[112%] w-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.9, ease: easeSoft, delay: 0.3 }}
          className="font-[var(--font-label)] text-[10px] tracking-[0.4em] uppercase text-white/80"
        >
          Feature spread &mdash; {label}
        </motion.p>
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 1, ease: easeSoft, delay: 0.5 }}
          className="inline-block h-px bg-[color:var(--color-secondary)]"
        />
      </div>
    </motion.div>
  );
}

export default function MagazineSection({ data, index }: Props) {
  const flipped = index % 2 === 1;
  const v = variants[index % variants.length];
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const numberParallaxY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  // Different image hover / panel-direction details
  const panelHidden =
    v.panelOrigin === "origin-top" || v.panelOrigin === "origin-bottom"
      ? { scaleY: 1 }
      : { scaleX: 1 };
  const panelVisible =
    v.panelOrigin === "origin-top" || v.panelOrigin === "origin-bottom"
      ? { scaleY: 0 }
      : { scaleX: 0 };

  const itemVariants: Variants = {
    hidden: v.itemHidden,
    visible: v.itemVisible,
  };

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 border-t border-[color:var(--color-on-surface)]/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15%" }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
            className={`col-span-12 md:col-span-5 ${
              flipped ? "md:order-2 md:col-start-8" : "md:order-1"
            }`}
          >
            <div className="flex items-baseline gap-5 mb-6">
              <motion.span
                initial={v.numberInitial}
                whileInView={{
                  ...v.numberAnimate,
                  transition: { duration: 1, ease: easeOut },
                }}
                viewport={{ once: true, margin: "-15%" }}
                style={{ y: numberParallaxY }}
                className="font-display italic font-light leading-none text-[color:var(--color-secondary)] text-7xl md:text-8xl will-change-transform"
                aria-hidden
              >
                {data.number}
              </motion.span>
              <motion.span
                variants={itemVariants}
                transition={{ duration: 0.7, ease: easeOut }}
                className="font-[var(--font-label)] text-xs tracking-[0.3em] uppercase text-[color:var(--color-on-surface-variant)]"
              >
                {data.label}
              </motion.span>
            </div>

            <Headline text={data.headline} mode={v.headlineMode} />

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }}
              className="h-px w-16 bg-[color:var(--color-primary)] mb-6 origin-left"
            />

            <motion.p
              variants={itemVariants}
              transition={{ duration: 0.8, ease: easeOut }}
              className="font-display text-lg md:text-xl leading-relaxed text-[color:var(--color-on-surface-variant)]"
            >
              {data.body}
            </motion.p>

            {data.bullets && (
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                transition={{ staggerChildren: 0.08, delayChildren: 0.3 }}
                className="mt-6 space-y-2"
              >
                {data.bullets.map((b) => (
                  <motion.li
                    key={b}
                    variants={{
                      hidden: v.bulletHidden,
                      visible: v.bulletVisible,
                    }}
                    transition={{ duration: 0.55, ease: easeOut }}
                    className="font-[var(--font-label)] text-sm text-[color:var(--color-on-surface)] flex items-start gap-3"
                  >
                    <span className="mt-2 inline-block h-1 w-3 bg-[color:var(--color-secondary)] flex-shrink-0" />
                    {b}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </motion.div>

          <motion.div
            initial={v.imageInitial}
            whileInView={v.imageAnimate}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.1, ease: easeOut, delay: 0.15 }}
            className={`col-span-12 md:col-span-6 ${
              flipped ? "md:order-1 md:col-start-1" : "md:order-2 md:col-start-7"
            }`}
          >
            <div className="group relative aspect-[4/5] w-full overflow-hidden shadow-2xl">
              <motion.img
                src={data.image}
                alt={data.label}
                style={{ y: imageY }}
                className="absolute inset-0 h-[115%] w-full object-cover will-change-transform transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[color:var(--color-primary)]/0 group-hover:bg-[color:var(--color-primary)]/10 transition-colors duration-500" />
              <motion.div
                initial={panelHidden}
                whileInView={panelVisible}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 1.1, ease: easeOut, delay: 0.2 }}
                className={`absolute inset-0 bg-[color:var(--color-surface)] ${v.panelOrigin}`}
              />
            </div>
            {data.quote && (
              <motion.figure
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.9, ease: easeOut, delay: 0.4 }}
                className={`mt-8 max-w-md ${flipped ? "ml-auto text-right" : ""}`}
              >
                <blockquote className="font-display italic text-2xl md:text-3xl leading-snug text-[color:var(--color-primary)]">
                  &ldquo;{data.quote.text}&rdquo;
                </blockquote>
                <figcaption className="mt-3 font-[var(--font-label)] text-xs tracking-[0.25em] uppercase text-[color:var(--color-on-surface-variant)]">
                  &mdash; {data.quote.attribution}
                </figcaption>
              </motion.figure>
            )}
          </motion.div>
        </div>

        {data.spreadImage && (
          <FeatureSpread src={data.spreadImage} label={data.label} />
        )}
      </div>
    </section>
  );
}

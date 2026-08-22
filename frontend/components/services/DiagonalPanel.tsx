"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Image from "next/image";

export type DiagonalPanelData = {
  number: string;
  label: string;
  headline: string;
  body: string;
  image: string;
  bullets?: string[];
  imagePosition?: string;
};

type Props = {
  data: DiagonalPanelData;
  index: number;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

// Mobile: photo stacks above text with a diagonal bottom edge.
// Desktop: side-by-side diagonal split.
const MOBILE_PHOTO_CLIP = "polygon(0 0, 100% 0, 100% 88%, 0 100%)";
const MOBILE_SEAM_CLIP = "polygon(0 99.7%, 100% 87.7%, 100% 88.3%, 0 100.3%)";

export default function DiagonalPanel({ data, index }: Props) {
  const photoLeft = index % 2 === 0;
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const numberY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);

  const desktopPhotoClip = photoLeft
    ? "polygon(0 0, 62% 0, 47% 100%, 0 100%)"
    : "polygon(53% 0, 100% 0, 100% 100%, 38% 100%)";
  const desktopSeamClip = photoLeft
    ? "polygon(61.7% 0, 62.3% 0, 47.3% 100%, 46.7% 100%)"
    : "polygon(52.7% 0, 53.3% 0, 38.3% 100%, 37.7% 100%)";

  return (
    <section
      ref={ref}
      className={`relative w-full overflow-hidden bg-[color:var(--color-surface)] md:h-[100vh] md:min-h-[640px] ${
        index === 0 ? "mt-14 md:mt-16" : ""
      }`}
    >
      {/* ── MOBILE: stacked photo (top) + text (bottom) ── */}
      <div className="md:hidden">
        <div
          className="relative w-full h-[52vh] min-h-[340px] overflow-hidden"
          style={{
            clipPath: MOBILE_PHOTO_CLIP,
            WebkitClipPath: MOBILE_PHOTO_CLIP,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.1, ease: easeOut }}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={data.image}
              alt={data.label}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center 30%" }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: easeOut, delay: 0.2 }}
          style={{
            clipPath: MOBILE_SEAM_CLIP,
            WebkitClipPath: MOBILE_SEAM_CLIP,
          }}
          className="absolute left-0 right-0 top-0 h-[52vh] min-h-[340px] bg-[color:var(--color-secondary)] pointer-events-none"
          aria-hidden
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="relative px-6 pt-10 pb-16"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="flex items-baseline gap-3 mb-5"
          >
            <span className="font-display italic text-3xl text-[color:var(--color-secondary)] leading-none">
              {data.number}
            </span>
            <span className="font-[var(--font-label)] text-[10px] tracking-[0.3em] uppercase text-[color:var(--color-on-surface-variant)]">
              {data.label}
            </span>
          </motion.div>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="font-display text-3xl sm:text-4xl leading-[1.05] text-[color:var(--color-on-surface)] mb-6"
          >
            {data.headline}
          </motion.h2>

          <motion.div
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="h-px w-14 bg-[color:var(--color-primary)] mb-6 origin-left"
          />

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="font-display text-base leading-relaxed text-[color:var(--color-on-surface-variant)]"
          >
            {data.body}
          </motion.p>

          {data.bullets && (
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              transition={{ staggerChildren: 0.07, delayChildren: 0.4 }}
              className="mt-5 space-y-2"
            >
              {data.bullets.map((b) => (
                <motion.li
                  key={b}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.45, ease: easeOut }}
                  className="font-[var(--font-label)] text-xs sm:text-sm text-[color:var(--color-on-surface)] flex items-start gap-3"
                >
                  <span className="mt-1.5 inline-block h-1 w-3 bg-[color:var(--color-secondary)] flex-shrink-0" />
                  {b}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </div>

      {/* ── DESKTOP: side-by-side diagonal split ── */}
      <div className="hidden md:block absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            clipPath: desktopPhotoClip,
            WebkitClipPath: desktopPhotoClip,
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              x: photoLeft ? "-4%" : "4%",
            }}
            whileInView={{ opacity: 1, x: "0%" }}
            viewport={{ once: true, margin: "-10%" }}
            style={{ y: imageY }}
            className={`absolute inset-y-0 h-[108%] w-[70%] will-change-transform ${
              photoLeft ? "left-0" : "right-0"
            }`}
          >
            <Image
              src={data.image}
              alt={data.label}
              fill
              sizes="70vw"
              className="object-cover"
              style={{
                objectPosition:
                  data.imagePosition ??
                  (photoLeft ? "80% center" : "20% center"),
              }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/35" />
        </div>

        {/* Surface-tinted fade over the text side — keeps copy readable even
            where it sits over the dark photo region */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: photoLeft
              ? "linear-gradient(270deg, var(--color-surface) 0%, var(--color-surface) 30%, rgba(248,250,248,0.85) 42%, rgba(248,250,248,0) 55%)"
              : "linear-gradient(90deg, var(--color-surface) 0%, var(--color-surface) 30%, rgba(248,250,248,0.85) 42%, rgba(248,250,248,0) 55%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scaleY: 0.6 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: easeOut, delay: 0.3 }}
          style={{
            clipPath: desktopSeamClip,
            WebkitClipPath: desktopSeamClip,
          }}
          className="absolute inset-0 bg-[color:var(--color-secondary)] pointer-events-none origin-center"
        />

        <motion.span
          aria-hidden
          style={{ y: numberY }}
          className={`absolute font-display italic font-light leading-none select-none pointer-events-none ${
            photoLeft ? "right-16 top-12" : "left-16 top-12"
          } text-[220px] text-[color:var(--color-on-surface)]/5 z-0`}
        >
          {data.number}
        </motion.span>

        {/* Reserve the seam zone on the outer container so text can never cross
            the diagonal golden line. The seam runs 62%->47% (photoLeft) / 53%->38%
            (photo-right); starting text at 64% / ending at 36% clears its widest
            point at every viewport width and zoom level. */}
        <div
          className={`absolute inset-0 z-10 flex items-center ${
            photoLeft
              ? "justify-end pl-[64%] pr-[4%]"
              : "justify-start pr-[64%] pl-[4%]"
          }`}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15%" }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
            className="relative w-full max-w-2xl"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, x: photoLeft ? 30 : -30 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="flex items-baseline gap-4 mb-6"
            >
              <span className="font-display italic text-4xl lg:text-5xl text-[color:var(--color-secondary)] leading-none">
                {data.number}
              </span>
              <span className="font-[var(--font-label)] text-[10px] tracking-[0.35em] uppercase text-[color:var(--color-on-surface-variant)]">
                {data.label}
              </span>
            </motion.div>

            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: easeOut }}
              className="font-display text-4xl lg:text-5xl xl:text-6xl leading-[1.05] xl:leading-[1.02] text-[color:var(--color-on-surface)] mb-8"
            >
              {data.headline}
            </motion.h2>

            <motion.div
              variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="h-px w-16 bg-[color:var(--color-primary)] mb-8 origin-left"
            />

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="font-display text-base lg:text-lg leading-relaxed text-[color:var(--color-on-surface-variant)]"
            >
              {data.body}
            </motion.p>

            {data.bullets && (
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-15%" }}
                transition={{ staggerChildren: 0.08, delayChildren: 0.6 }}
                className="mt-6 space-y-2"
              >
                {data.bullets.map((b) => (
                  <motion.li
                    key={b}
                    variants={{
                      hidden: { opacity: 0, x: photoLeft ? 12 : -12 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.5, ease: easeOut }}
                    className="font-[var(--font-label)] text-sm text-[color:var(--color-on-surface)] flex items-start gap-3"
                  >
                    <span className="mt-2 inline-block h-1 w-3 bg-[color:var(--color-secondary)] flex-shrink-0" />
                    {b}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

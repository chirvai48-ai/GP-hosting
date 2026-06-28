"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function PhotoStrip({
  eyebrow,
  heading,
  photos,
}: {
  eyebrow?: string;
  heading?: string;
  photos: { src: string; caption?: string; alt?: string }[];
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
      {(eyebrow || heading) && (
        <div className="mb-10">
          {eyebrow && (
            <p className="font-[var(--font-label)] text-[10px] tracking-[0.4em] uppercase text-[color:var(--color-primary)] mb-4">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h3 className="font-display text-2xl md:text-3xl text-[color:var(--color-on-surface)] max-w-3xl">
              {heading}
            </h3>
          )}
        </div>
      )}
      <div className={`grid gap-4 md:gap-6 ${photos.length === 2 ? "md:grid-cols-2" : photos.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}>
        {photos.map((p, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--color-container-low)]">
              <Image
                src={p.src}
                alt={p.alt || p.caption || ""}
                fill
                className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
              />
            </div>
            {p.caption && (
              <figcaption className="mt-3 font-[var(--font-label)] text-[11px] tracking-[0.2em] uppercase text-[color:var(--color-on-surface-variant)]">
                {p.caption}
              </figcaption>
            )}
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

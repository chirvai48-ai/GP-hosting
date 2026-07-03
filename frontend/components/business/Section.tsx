"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function Section({
  eyebrow,
  heading,
  body,
  image,
  image2,
  imageAlt,
  reverse = false,
  children,
}: {
  eyebrow?: string;
  heading: string;
  body?: string | React.ReactNode;
  image?: string;
  image2?: string;
  imageAlt?: string;
  reverse?: boolean;
  children?: React.ReactNode;
}) {
  const hasMedia = Boolean(image);
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24 border-t border-[color:var(--color-on-surface)]/10">
      <div className={`grid gap-10 md:gap-16 ${hasMedia ? "md:grid-cols-2" : ""} ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6 }}
        >
          {eyebrow && (
            <p className="font-[var(--font-label)] text-[10px] tracking-[0.4em] uppercase text-[color:var(--color-primary)] mb-5">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight text-[color:var(--color-on-surface)]">
            {heading}
          </h2>
          {body && (
            <div className="mt-6 text-base md:text-lg leading-relaxed text-[color:var(--color-on-surface-variant)] font-[var(--font-label)] space-y-4">
              {typeof body === "string" ? <p>{body}</p> : body}
            </div>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>

        {hasMedia && (
          <div className={`flex flex-col ${image2 ? "gap-4 md:gap-5" : ""}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.7 }}
              className={`relative ${image2 ? "aspect-[16/10]" : "aspect-[4/3]"} overflow-hidden bg-[color:var(--color-container-low)]`}
            >
              <Image
                src={image!}
                alt={imageAlt || ""}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </motion.div>
            {image2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="relative aspect-[16/10] overflow-hidden bg-[color:var(--color-container-low)]"
              >
                <Image
                  src={image2}
                  alt={imageAlt || ""}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

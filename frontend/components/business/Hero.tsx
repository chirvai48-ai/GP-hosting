"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

export default function Hero({
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  sideBySide,
}: {
  eyebrow: string;
  title: string;
  lede?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  sideBySide?: boolean;
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16 md:pb-24">
      {sideBySide ? (
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-[var(--font-label)] text-base md:text-lg tracking-[0.25em] uppercase text-[color:var(--color-primary)]"
            >
              {eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-[color:var(--color-on-surface)]"
            >
              {title}
            </motion.h1>
            {lede && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mt-8 text-lg md:text-xl leading-relaxed text-[color:var(--color-on-surface-variant)] font-[var(--font-label)] font-normal"
              >
                {lede}
              </motion.p>
            )}
          </div>
          {image && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative aspect-[4/3] overflow-hidden bg-[color:var(--color-container-low)]"
            >
              <Image
                src={image}
                alt={imageAlt || title}
                fill
                className="object-contain"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </motion.div>
          )}
        </div>
      ) : (
        <>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-[var(--font-label)] text-base md:text-lg tracking-[0.25em] uppercase text-[color:var(--color-primary)]"
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
          {image && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-12 md:mt-16 relative aspect-[21/9] overflow-hidden bg-[color:var(--color-container-low)]"
            >
              <Image
                src={image}
                alt={imageAlt || title}
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 1024px, 100vw"
                priority
              />
            </motion.div>
          )}
        </>
      )}
    </section>
  );
}

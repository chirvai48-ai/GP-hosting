"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { businesses } from "./PageShell";

export default function CrossSell() {
  const pathname = usePathname();
  const currentSlug = pathname?.split("/").pop();
  const others = businesses.filter((b) => b.slug !== currentSlug);

  return (
    <section className="border-t border-[color:var(--color-on-surface)]/10 bg-[color:var(--color-surface)] mt-10">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid md:grid-cols-[1fr_auto] gap-10 md:items-end mb-12">
          <div>
            <p className="font-[var(--font-label)] text-[10px] tracking-[0.4em] uppercase text-[color:var(--color-primary)] mb-4">
              Explore our businesses
            </p>
            <h2 className="font-display text-3xl md:text-5xl leading-tight text-[color:var(--color-on-surface)] max-w-2xl">
              Four practices, one mission.
            </h2>
          </div>
          <Link
            href="/contact/company"
            className="inline-flex items-center gap-3 font-[var(--font-label)] text-[11px] tracking-[0.35em] uppercase text-[color:var(--color-primary)] border border-[color:var(--color-primary)] px-6 py-4 hover:bg-[color:var(--color-primary)] hover:text-white transition-colors duration-300 self-start md:self-end"
          >
            Contact us <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        <div className="grid gap-px bg-[color:var(--color-on-surface)]/10 md:grid-cols-3">
          {others.map((b, i) => (
            <motion.div
              key={b.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="bg-white"
            >
              <Link
                href={`/business/${b.slug}`}
                className="group block p-8 md:p-10 h-full hover:bg-[color:var(--color-container-low)] transition-colors duration-300"
              >
                <p className="font-[var(--font-label)] text-[10px] tracking-[0.4em] uppercase text-[color:var(--color-on-surface-variant)]">
                  {b.number}
                </p>
                <h3 className="mt-4 font-display text-2xl md:text-3xl text-[color:var(--color-on-surface)] leading-snug group-hover:text-[color:var(--color-primary)] transition-colors duration-300">
                  {b.label}
                </h3>
                <div className="mt-6 inline-flex items-center gap-2 font-[var(--font-label)] text-[11px] tracking-[0.3em] uppercase text-[color:var(--color-primary)]">
                  Read <motion.span aria-hidden whileHover={{ x: 4 }}>&rarr;</motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

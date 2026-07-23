"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "motion/react";

export const businesses = [
  { slug: "career-counseling", label: "就職活動支援事業", number: "01" },
  { slug: "staffing", label: "労働者派遣事業", number: "02" },
  { slug: "placement", label: "人材紹介事業", number: "03" },
  { slug: "ssw-support", label: "特定技能外国人の支援事業", number: "04" },
] as const;

export const totalLabel = String(businesses.length).padStart(2, "0");

export default function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentSlug = pathname?.split("/").pop();
  const current = businesses.find((b) => b.slug === currentSlug);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div className="min-h-screen bg-white text-[color:var(--color-on-surface)]">
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-[color:var(--color-primary)] origin-left z-[60]"
      />

      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-28 md:pt-36">
        <div className="flex items-center justify-between font-[var(--font-label)] text-[10px] tracking-[0.35em] uppercase text-[color:var(--color-on-surface-variant)]">
          <Link href="/" className="hover:text-[color:var(--color-primary)] transition-colors">
            Glowing Partner TOP
          </Link>
          <span>
            {current?.number} <span className="opacity-40">/ {totalLabel}</span>
          </span>
        </div>
        <div className="mt-3 h-px w-full bg-[color:var(--color-on-surface)]/10" />
      </div>

      {children}
    </div>
  );
}

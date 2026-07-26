"use client";

import { useEffect, useRef, useState } from "react";

// Mission / Vision / Value framework — Glowing Partner MVV ('26.1.17).
// Scroll-pinned panels below carry Vision / Mission / Identity; the Value
// band beneath carries the three named values. Copy marked "支持文（調整可）"
// is restrained supporting text — client may replace.
const philosophyData = [
  {
    id: "vision",
    label: "01 — Vision",
    title: "「違うから良い」と\n思える社会に",
    // 支持文（調整可）
    description:
      "違いは、組織を弱める要素ではなく、新しい可能性を生み出す原動力です。私たちは、誰もが自分らしく活躍できる社会の実現を目指します。",
    image: "/Philosophy1.jpg",
  },
  {
    id: "mission",
    label: "02 — Mission",
    title: "組織の生産性と\n可能性を最大化する",
    description:
      "コミュニケーションの齟齬の解消をサポートし、組織の生産性と可能性を最大化させる。それが、私たちが果たすべき使命です。",
    image: "/Philosophy2.jpg",
  },
  {
    id: "identity",
    label: "03 — Identity",
    title: "We are\nChance Maker.",
    description:
      "日本とネパールの信頼の架け橋となり、人と企業に新しいチャンスを生み出し続けます。",
    image: "/Philosophy3.jpg",
  },
];

const values = [
  {
    en: "Integrity",
    ja: "誠実さ",
    body: "あるものはある、ないものはないと言える正直さを持つ。",
  },
  {
    en: "Possibility",
    ja: "可能性",
    body: "違いを尊重し合い、違いの中から新しい可能性を創る。",
  },
  {
    en: "Adaptability",
    ja: "適応力",
    body: "高い成長意欲を持ち、変化にすばやく適応するための努力をする。",
  },
];

export default function PhilosophySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Pick the section whose center is closest to the viewport center.
    // Avoids the dual-intersection flicker you get from per-section observers.
    let ticking = false;

    const update = () => {
      ticking = false;
      const viewportCenter = window.innerHeight / 2;
      let bestIndex = 0;
      let bestDistance = Infinity;
      sectionRefs.current.forEach((section, i) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - viewportCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      });
      setActiveIndex((prev) => (prev === bestIndex ? prev : bestIndex));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="relative bg-[var(--color-surface)] text-[var(--color-on-surface)]">
      {/* ── Vision / Mission / Identity — scroll-pinned panels ─────────── */}
      <div className="relative flex">
        {/* LEFT: scrollable text column */}
        <div className="w-full md:w-1/2">
          {philosophyData.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              className="min-h-screen flex flex-col justify-center px-10 md:px-16 py-24"
            >
              {/* Label */}
              <p
                className="text-lg tracking-[0.3em] uppercase mb-8 transition-all duration-500"
                style={{
                  fontFamily: "var(--font-label)",
                  color:
                    activeIndex === i
                      ? "var(--color-secondary)"
                      : "var(--color-on-surface-variant)",
                  opacity: activeIndex === i ? 1 : 0.35,
                }}
              >
                {item.label}
              </p>

              {/* Title */}
              <h2
                className="text-5xl md:text-[3.5rem] font-light leading-tight mb-8 transition-all duration-700"
                style={{
                  fontFamily: "var(--font-headline)",
                  color: "var(--color-primary)",
                  whiteSpace: "pre-line",
                  opacity: activeIndex === i ? 1 : 0.25,
                  transform:
                    activeIndex === i ? "translateY(0px)" : "translateY(18px)",
                }}
              >
                {item.title}
              </h2>

              {/* Accent rule */}
              <div
                className="mb-8 h-px transition-all duration-700"
                style={{
                  background: "var(--color-secondary)",
                  width: activeIndex === i ? "3rem" : "1.25rem",
                  opacity: activeIndex === i ? 1 : 0.25,
                }}
              />

              {/* Description */}
              <p
                className="text-lg md:text-xl leading-relaxed max-w-md transition-all duration-700 "
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-on-surface-variant)",
                  opacity: activeIndex === i ? 1 : 0.2,
                  transform:
                    activeIndex === i ? "translateY(0px)" : "translateY(14px)",
                }}
              >
                {item.description}
              </p>

              {/* Progress dashes */}
              <div className="flex items-center gap-2 mt-12">
                {philosophyData.map((_, di) => (
                  <div
                    key={di}
                    className="transition-all duration-500 h-px"
                    style={{
                      width: activeIndex === di ? "2rem" : "0.5rem",
                      background:
                        activeIndex === di
                          ? "var(--color-primary)"
                          : "var(--color-on-surface-variant)",
                      opacity: activeIndex === di ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: sticky image column */}
        <div className="hidden md:block w-1/2 sticky top-0 h-screen overflow-hidden">
          {/* Counter */}
          <div
            className="absolute top-8 right-8 z-20 text-xs tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-label)",
              color: "var(--color-secondary)",
              opacity: 0.7,
            }}
          >
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(philosophyData.length).padStart(2, "0")}
          </div>

          {/* Stacked images — position is a pure function of activeIndex */}
          {philosophyData.map((item, i) => {
            const isActive = activeIndex === i;
            // Already-seen cards (i <= activeIndex) sit on stage; later cards wait off-screen right.
            const onStage = i <= activeIndex;

            const transform = onStage
              ? "translateX(0%) rotate(0deg)"
              : "translateX(108%) rotate(4deg)";

            // Later cards stack on top of earlier ones so the newest slide-in covers the previous.
            const zIndex = i + 1;

            return (
              <div
                key={item.id}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform,
                  transition: "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)",
                  zIndex,
                  transformOrigin: "right center",
                  willChange: "transform",
                }}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-3/5 h-4/5 object-cover block rounded-md"
                />

                {/* Bottom caption */}
                <div
                  className="absolute bottom-10 left-30"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.45s 0.25s",
                  }}
                >
                  <div
                    className="h-px mb-3"
                    style={{
                      background: "rgba(201,168,76,0.65)",
                      width: "2.5rem",
                    }}
                  />
                  <p
                    className="text-primary text-xs tracking-widest uppercase "
                    style={{ fontFamily: "var(--font-label)", opacity: 0.85 }}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Value — three named values ────────────────────────────────── */}
      <div className="px-10 md:px-16 py-24 border-t border-[color:var(--color-on-surface)]/10">
        <p
          className="text-lg tracking-[0.3em] uppercase mb-4 text-center"
          style={{
            fontFamily: "var(--font-label)",
            color: "var(--color-secondary)",
          }}
        >
          04 — Value
        </p>
        <h2
          className="text-4xl md:text-5xl font-light leading-tight mb-14 text-center"
          style={{
            fontFamily: "var(--font-headline)",
            color: "var(--color-primary)",
          }}
        >
          私たちの価値観
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 max-w-6xl mx-auto justify-items-center">
          {values.map((v, i) => (
            <div key={v.en} className="flex flex-col items-center text-center">
              <span
                className="text-sm tracking-[0.2em] uppercase mb-2"
                style={{
                  fontFamily: "var(--font-label)",
                  color: "var(--color-secondary)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="text-2xl md:text-3xl font-light mb-1"
                style={{
                  fontFamily: "var(--font-headline)",
                  color: "var(--color-primary)",
                }}
              >
                {v.en}
              </h3>
              <p
                className="text-sm tracking-widest mb-5"
                style={{
                  fontFamily: "var(--font-label)",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                {v.ja}
              </p>
              <div
                className="h-px w-8 mb-5"
                style={{ background: "var(--color-secondary)" }}
              />
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

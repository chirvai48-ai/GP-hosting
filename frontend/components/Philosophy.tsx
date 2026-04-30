"use client";

import { useEffect, useRef, useState } from "react";

const philosophyData = [
  {
    id: "mission",
    label: "01 — Mission",
    title: "Rooted in Purpose,Driven by Impact",
    description:
      "We exist to cultivate meaningful change at the intersection of people and possibility. Every decision we make is anchored in a commitment to create lasting value — not just for those we serve today, but for the generations that will inherit the world we shape together.",
    image:
      "/Philosophy1.jpg",
  },
  {
    id: "vision",
    label: "02 — Vision",
    title: "A Future We Build Together",
    description:
      "We envision a world where growth is not measured in metrics alone, but in the quality of relationships forged, communities strengthened, and ideas brought to life. Our horizon is vast — and we pursue it with the quiet confidence of those who understand that enduring things are built slowly, and with great care.",
    image:
      "/Philosophy2.jpg",
  },
  {
    id: "philosophy",
    label: "03 — Corporate Philosophy",
    title: "Integrity as the Foundation of All",
    description:
      "Our philosophy is not a document — it is a living practice. We believe that commerce and conscience are not in opposition, but in conversation. Transparency guides our governance, humility shapes our ambitions, and a deep respect for the natural world informs every choice we make as stewards of something larger than ourselves.",
    image:
      "/Philosophy3.jpg",
  },
];

export default function PhilosophySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [animatingImage, setAnimatingImage] = useState<number | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((section, i) => {
      if (!section) return;

      const isLast = i === philosophyData.length - 1;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(i);
            setAnimatingImage(i);
            setTimeout(() => {
              setImageIndex(i);
              setAnimatingImage(null);
            }, 750);
          }
        },
        { threshold: isLast ? 0.2 : 0.35, }
      );

      obs.observe(section);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="relative flex bg-[var(--color-surface)] text-[var(--color-on-surface)]">

      {/* ── LEFT: scrollable text column ─────────────────────────────── */}
      <div className="w-full md:w-1/2">
        {philosophyData.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => { sectionRefs.current[i] = el; }}
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

      {/* ── RIGHT: sticky image column ───────────────────────────────── */}
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

        {/* Stacked images */}
        {philosophyData.map((item, i) => {
          const isActive = imageIndex === i;
          const isAnimating = animatingImage === i;

          // Off-screen right with slight tilt → slides in flat on scroll
          const transform = isAnimating || isActive
            ? "translateX(0%) rotate(0deg)"
            : "translateX(108%) rotate(4deg)";

          const transition = isAnimating
            ? "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)"
            : "none";

          const zIndex = isAnimating ? 10 : isActive ? 5 : 1;

          return (
            <div
              key={item.id}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform,
                transition,
                zIndex,
                transformOrigin: "right center",
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
                  opacity: isActive && !isAnimating ? 1 : 0,
                  transition: "opacity 0.45s 0.45s",
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
    </section>
  );
}
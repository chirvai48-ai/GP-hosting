"use client";
import Image from "next/image";
import { useState, useRef, useEffect, ReactNode } from "react";
import SvgComponent from "./ExploreButtonSVG";
import { motion, AnimatePresence } from "motion/react";

interface HoverImageProps {
  alt: string;
  src: string;
  insetPercent?: number;
  eyebrow: string;
  title: string;
  expand: boolean;
}

function HoverImage({ alt, src, insetPercent = 10, eyebrow, title, expand }: HoverImageProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  // Self-managed cursor follower: position updated via ref (no re-renders),
  // visibility driven by `hovered`. Hard-resets on unmount / when `expand` flips,
  // so the cursor can never get stuck.
  useEffect(() => {
    if (!hovered) return;
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      // Defensive: if pointer is outside the bounds (e.g. mouseleave never fired
      // because of clip-path edges), clear hover state.
      if (!inside) {
        setHovered(false);
        return;
      }
      if (cursorRef.current) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [hovered]);

  // Reset hover when the card collapses/expands externally.
  useEffect(() => {
    setHovered(false);
  }, [expand]);

  return (
    <div ref={containerRef}>
      <div
        className="overflow-hidden max-w-md relative hover:cursor-none group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          clipPath:
            hovered || expand
              ? "inset(0 0 0 0)"
              : `inset(0 ${insetPercent}% 0 ${insetPercent}%)`,
          transition:
            "clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}
      >
        <Image
          alt={alt}
          src={src}
          width={500}
          height={500}
          className="rounded-sm block"
        />

        {/* Self-managed cursor follower */}
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="absolute top-0 left-0 pointer-events-none z-30"
          style={{
            width: 60,
            height: 60,
            opacity: hovered ? 0.85 : 0,
            transition: "opacity 0.2s",
            willChange: "transform",
          }}
        >
          <SvgComponent width={60} height={60} />
        </div>

        {/* Bottom-to-top primary gradient — keeps the image readable up top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(20,86,82,0.85) 0%, rgba(20,86,82,0.45) 35%, rgba(20,86,82,0.1) 70%, rgba(20,86,82,0) 100%)",
          }}
        />

        {/* Gold hairline frame on hover */}
        <div
          className="absolute inset-2 pointer-events-none transition-opacity duration-500"
          style={{
            border: "1px solid rgba(201,168,76,0.55)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Bottom label block — centered so it stays inside the clipped middle 80% */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col items-center text-center">
          <p
            className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3"
            style={{
              fontFamily: "var(--font-label)",
              color: "rgba(201,168,76,0.95)",
            }}
          >
            {eyebrow}
          </p>
          <h3
            className="font-light leading-tight mb-3"
            style={{
              fontFamily: "var(--font-headline)",
              color: "white",
              fontSize: hovered ? "2.25rem" : "2rem",
              transition: "font-size 0.5s",
            }}
          >
            {title}
          </h3>
          <div
            className="flex items-center justify-center gap-2 text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-label)",
              color: "rgba(255,255,255,0.85)",
              transform: hovered ? "translateX(4px)" : "translateX(0)",
              transition: "transform 0.4s",
            }}
          >
            <span>Explore</span>
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
}

interface StepsPanelProps {
  heading: string;
  steps: Step[];
  onClose: () => void;
}

function StepsPanel({ heading, steps, onClose }: StepsPanelProps) {
  return (
    <div className="relative flex flex-col max-w-md w-full px-2">
      <button
        className="absolute -top-2 right-0 w-8 h-8 flex items-center justify-center text-[color:var(--color-primary)]/60 hover:text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/5 transition-colors"
        aria-label="Close"
        onClick={onClose}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="1" y1="1" x2="13" y2="13" />
          <line x1="13" y1="1" x2="1" y2="13" />
        </svg>
      </button>

      <p
        className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2"
        style={{
          fontFamily: "var(--font-label)",
          color: "var(--color-secondary)",
        }}
      >
        How it works
      </p>
      <h3
        className="font-light italic mb-1"
        style={{
          fontFamily: "var(--font-headline)",
          color: "var(--color-primary)",
          fontSize: "1.75rem",
        }}
      >
        {heading}
      </h3>
      <div
        className="h-px mb-6 mt-2"
        style={{
          background: "var(--color-secondary)",
          width: "2rem",
        }}
      />

      {steps.map((step, i) => (
        <div key={i} className="flex gap-4 items-start py-1">
          <div className="flex flex-col items-center shrink-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white"
              style={{
                border: "1px solid var(--color-primary)",
                color: "var(--color-primary)",
              }}
            >
              {step.icon}
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-px flex-1 min-h-12 mt-1"
                style={{ background: "rgba(201,168,76,0.35)" }}
              />
            )}
          </div>
          <div className="pt-1.5">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1"
              style={{
                fontFamily: "var(--font-label)",
                color: "var(--color-secondary)",
              }}
            >
              {step.number}
            </p>
            <p
              className="text-base font-medium mb-1"
              style={{
                fontFamily: "var(--font-headline)",
                color: "var(--color-on-surface)",
              }}
            >
              {step.title}
            </p>
            <p
              className="text-sm leading-relaxed pb-3"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-on-surface-variant)",
              }}
            >
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

const messageIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const searchIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const fastForwardIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13 17 18 12 13 7" />
    <polyline points="6 17 11 12 6 7" />
  </svg>
);

const teamIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const documentIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="13" y2="17" />
  </svg>
);

const matchIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const planeIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.2.6-.6.5-1.1z" />
  </svg>
);

const recruiterSteps: Step[] = [
  {
    number: "Step 1",
    title: "Tell us your hiring needs",
    description: "Share your requirements, timeline, and the type of talent you're looking for.",
    icon: messageIcon,
  },
  {
    number: "Step 2",
    title: "We find & match candidates",
    description: "We interview and screen candidates individually to ensure the right fit for your company.",
    icon: searchIcon,
  },
  {
    number: "Step 3",
    title: "Get candidates fast",
    description: "Receive qualified, ready-to-work talent — sometimes as soon as the same day.",
    icon: fastForwardIcon,
  },
  {
    number: "Step 4",
    title: "Ongoing support",
    description: "Our consultants stay involved after hiring to ensure smooth onboarding and long-term success.",
    icon: teamIcon,
  },
];

const seekerSteps: Step[] = [
  {
    number: "Step 1",
    title: "Send us your resume",
    description: "Submit your details and let us know what kind of role you're looking for in Japan.",
    icon: documentIcon,
  },
  {
    number: "Step 2",
    title: "We assess your fit",
    description: "Our consultants review your background and match you with companies that align with your skills and goals.",
    icon: matchIcon,
  },
  {
    number: "Step 3",
    title: "Interview & placement",
    description: "We prepare you for interviews and guide you through every step until you receive your offer.",
    icon: searchIcon,
  },
  {
    number: "Step 4",
    title: "Settlement support",
    description: "From visa paperwork to your first weeks in Japan, we stay by your side to help you settle in.",
    icon: planeIcon,
  },
];

export const Infopoint = () => {
  const [card, setCard] = useState<number>(0);
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <section className="bg-[color:var(--color-surface)] py-20 md:py-28 px-4">
      <div className="flex flex-col gap-6 items-center justify-center min-h-[80vh] w-full">
        {/* Header */}
        <div className="flex flex-col justify-center items-center text-center mb-6">
          <p
            className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-4"
            style={{
              fontFamily: "var(--font-label)",
              color: "var(--color-secondary)",
            }}
          >
            Choose Your Path
          </p>
          <h2
            className="text-5xl md:text-[3.5rem] font-light italic leading-tight mb-5"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--color-primary)",
              whiteSpace: "pre-line",
            }}
          >
            Who are you here for?
          </h2>
          <div
            className="h-0.5 mb-6"
            style={{ background: "var(--color-secondary)", width: "4rem" }}
          />
          <p
            className="text-lg md:text-xl leading-relaxed max-w-md"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            Pick your path and we'll guide you from there.
          </p>
        </div>

        <div className="flex justify-center p-4 items-center w-full">
          <div className="max-w-6xl w-full px-4 md:px-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              <AnimatePresence mode="popLayout">
                {(card === 0 || card === 1 || expand === false) && (
                  <motion.div
                    onClick={() => { setCard(1); setExpand(true); }}
                    key="recruiters"
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    className="flex flex-1/2 items-center justify-center"
                  >
                    <HoverImage
                      src="/recruiters.jpg"
                      alt="Image of recruiters"
                      insetPercent={10}
                      eyebrow="For Companies"
                      title="For Recruiters"
                      expand={expand}
                    />
                  </motion.div>
                )}

                {card === 1 && expand === true && (
                  <motion.div
                    key="recruitersteps"
                    layout
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    className="flex flex-1/2 items-center justify-center"
                  >
                    <StepsPanel
                      heading="Hiring with us"
                      steps={recruiterSteps}
                      onClose={() => setExpand(false)}
                    />
                  </motion.div>
                )}

                {card === 2 && expand === true && (
                  <motion.div
                    className="flex flex-1/2 items-center justify-center"
                    key="seekersteps"
                    layout
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <StepsPanel
                      heading="Your journey to Japan"
                      steps={seekerSteps}
                      onClose={() => setExpand(false)}
                    />
                  </motion.div>
                )}

                {(card === 0 || card === 2 || expand === false) && (
                  <motion.div
                    key="jobseekers"
                    onClick={() => { setCard(2); setExpand(true); }}
                    layout
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    className="flex flex-1/2 items-center justify-center"
                  >
                    <HoverImage
                      src="/jobseekers.jpg"
                      alt="Image of job seekers"
                      insetPercent={10}
                      eyebrow="For Candidates"
                      title="For Job Seekers"
                      expand={expand}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

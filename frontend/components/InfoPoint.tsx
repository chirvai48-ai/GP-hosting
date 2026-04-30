"use client";
import Image from "next/image";
import { useState } from "react";
import ReactCursor from "@holmesdev/cursors";
import SvgComponent from "./ExploreButtonSVG";
import { motion, AnimatePresence } from "motion/react";

interface HoverImageProps {
  alt: string;
  src: string;
  insetPercent?: number;
  content: string;
  expand: boolean;
}

function HoverImage({ alt, src, insetPercent = 10, content, expand }: HoverImageProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ReactCursor
        enable={hovered}
        hoverSelector="*"
        layers={[
          {
            SVG: SvgComponent,
            size: { height: 60, width: 60 },
            opacity: 0.7,
          },
        ]}
      />
      <div
        className={"overflow-hidden max-w-md relative hover:cursor-none"}
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
          className="rounded-sm"
        />
        <div className="absolute inset-0 bg-[var(--color-primary)]/30 flex justify-center items-center">
          <div
            className=" font-black"
            style={{
              fontFamily: "var(--font-headline)",
              color: "white",
              fontSize: hovered ? "1.7rem" : "1.4rem",
              transition: "font-size 0.6s ",
            }}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Infopoint = () => {
  const [card, setCard] = useState<Number>(0);
  const [expand, setExpand] = useState<boolean>(false);
  const steps = [
    {
      number: "Step 1",
      title: "Tell us your hiring needs",
      description:
        "Share your requirements, timeline, and the type of talent you're looking for.",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      number: "Step 2",
      title: "We find & match candidates",
      description:
        "We interview and screen candidates individually to ensure the right fit for your company.",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      ),
    },
    {
      number: "Step 3",
      title: "Get candidates fast",
      description:
        "Receive qualified, ready-to-work talent — sometimes as soon as the same day.",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
      ),
    },
    {
      number: "Step 4",
      title: "Ongoing support",
      description:
        "Our consultants stay involved after hiring to ensure smooth onboarding and long-term success.",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-16 items-center justify-center min-h-screen w-full">
      <div className="flex flex-col justify-center items-center">
        <h2
          className="text-5xl md:text-[3.5rem] font-light leading-tight mb-8 "
          style={{
            fontFamily: "var(--font-headline)",
            color: "var(--color-primary)",
            whiteSpace: "pre-line",
          }}
        >
          Who are you here for?
        </h2>
        <p
          className="text-lg md:text-xl leading-relaxed max-w-md "
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          Pick your path and we'll guide you from there.
        </p>
      </div>
      <div className="flex justify-center p-4 items-center">
        <div className="max-w-6xl w-full px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center ">
            <AnimatePresence mode="popLayout">
              {(card == 0 || card == 1 || expand == false) && (
                <motion.div
                  onClick={() => {setCard(1);setExpand(true)} }
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
                    content="For Recruiters"
                    expand = {expand}
                  />
                </motion.div>
              )}
              {(card == 1 && expand == true) && (
                <motion.div
                  key="jobseekerstext"
                  layout
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  className="flex flex-1/2 items-center justify-center"
                >
                  <div className="relative flex flex-col">
                    <button
                      className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      aria-label="Close"
                      onClick={() => setExpand(false)}
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
                    {steps.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start py-2">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700">
                            {step.icon}
                          </div>
                          {i < steps.length - 1 && (
                            <div className="w-px flex-1 min-h-12 bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div className="pt-2">
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                            {step.number}
                          </p>
                          <p className="text-base font-medium text-gray-900 mb-1">
                            {step.title}
                          </p>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {(card == 2 && expand == true) && (
                <motion.div
                  className="flex-1/2 flex flex-1/2 items-center justify-center"
                  key="recruiterstext"
                  layout
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                >
                   <div className="relative flex flex-col">
                    <button
                      className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      aria-label="Close"
                      onClick={() => setExpand(false)}
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
                    {steps.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start py-2">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700">
                            {step.icon}
                          </div>
                          {i < steps.length - 1 && (
                            <div className="w-px flex-1 min-h-12 bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div className="pt-2">
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                            {step.number}
                          </p>
                          <p className="text-base font-medium text-gray-900 mb-1">
                            {step.title}
                          </p>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {(card == 0 || card == 2 || expand == false) && (
                <motion.div
                  key="jobseekers"
                  onClick={() => {setCard(2);setExpand(true)} }
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
                    content="For Job Seekers"
                    expand = {expand}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Leader {
  id: number;
  name: string;
  title: string;
  href?: string;
  description: string;
  imageUrl: string;
  logoUrl: string;
}

const leaders: Leader[] = [
  {
    id: 1,
    name: "Narayan Pokhrel",
    title: "CEO, World Partner",
    description: `I believe in always moving forward — working hard and taking on new challenges. You never know what's possible until you try, and true results come through persistence.

What seems difficult often becomes achievable once you take that first step. Don't be afraid to fail — every experience leads to future success.

Through 12 years of experience in Japan, I've learned and grown in many ways. I hope to share those insights with people interested in Japan and inspire new challenges ahead.

Driven by a desire to help others, I have also been actively involved in volunteer activities. Contributing to others' happiness is my greatest motivation.

Together, let's continue to grow and build a better future.`,
    imageUrl: "/CEO.jpg",
    logoUrl: "/logogreen.jpeg",
  },
  {
    id: 2,
    name: "Go Uenaka",
    title: "CEO, Glowing Partner",
    href: "https://www.glowing-partner.jp/",
    description: `First of all, as a Japanese national, I would like to express my sincere appreciation for your interest in Japan.

Glowing Partner Co., Ltd., based in Japan, is a company in which all employees are foreign nationals, and approximately 95% of them are from Nepal. I hold great admiration for Nepalese people. They are friendly, place strong value on family and community, and I believe they possess a deep understanding of the "truly important things in life," which many Japanese may have begun to overlook.

By utilizing the bridge we have established between Nepal and Japan through the collaboration of World Partner Pvt. Ltd. and Glowing Partner Co., Ltd., we hope to welcome many more Nepali individuals to Japan.

After your arrival in Japan, we will provide our fullest support to ensure that you genuinely feel, "I am truly glad I came to Japan."`,
    imageUrl: "/CEO.jpg",
    logoUrl: "/GpLogoTransparent.png",
  },
];

function LeaderCard({ leader }: { leader: Leader }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {/* Profile image */}
      <div className="relative mb-8">
        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-[color:var(--color-secondary)]/30">
          <img
            src={leader.imageUrl}
            alt={leader.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Logo badge */}
        <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full border-2 border-white shadow-md bg-white overflow-hidden flex items-center justify-center">
          <img src={leader.logoUrl} alt="logo" className="w-10 h-10 object-contain" />
        </div>
      </div>

      {/* Name & title */}
      <div className="text-center mb-6">
        <h3 className="font-headline text-3xl font-light text-[color:var(--color-on-surface)] mb-1">
          {leader.name}
        </h3>
        <p className="font-label text-sm text-[color:var(--color-primary)] font-medium">
          {leader.title}
          {leader.href && (
            <a
              href={leader.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-[color:var(--color-secondary)] underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              ↪ Visit
            </a>
          )}
        </p>
      </div>

      {/* Expandable description */}
      <div className="w-full max-w-lg mx-auto">
        <div className="relative">
          <AnimatePresence initial={false}>
            <p
              className={`font-body text-base text-[color:var(--color-on-surface-variant)] leading-relaxed text-left whitespace-pre-line ${
                !expanded ? "line-clamp-5" : ""
              }`}
            >
              {leader.description}
            </p>
          </AnimatePresence>

          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[color:var(--color-container-low)] to-transparent pointer-events-none" />
          )}
        </div>

        <button
          onClick={() => setExpanded((p) => !p)}
          className="mt-4 inline-flex items-center gap-1.5 font-label text-sm text-[color:var(--color-primary)] hover:text-[color:var(--color-secondary)] transition-colors duration-200"
        >
          {expanded ? "Show Less" : "Read More"}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex"
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>
      </div>
    </div>
  );
}

export default function LeadershipSection() {
  return (
    <section className="bg-[color:var(--color-container-low)] py-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-label text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--color-secondary)] mb-4">
            The People Behind the Mission
          </p>
          <h2 className="font-headline text-5xl font-light italic text-[color:var(--color-primary)]">
            Leadership
          </h2>
          <div className="w-16 h-0.5 bg-[color:var(--color-secondary)] mx-auto mt-5" />
        </div>

        <div className="bg-white rounded-2xl border border-[rgba(20,86,82,0.08)] shadow-sm overflow-hidden">
          {/* Top accent */}
          <div
            className="h-1"
            style={{ background: "linear-gradient(to right, #145652, #c9a84c)" }}
          />

          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
              {leaders.map((leader) => (
                <LeaderCard key={leader.id} leader={leader} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

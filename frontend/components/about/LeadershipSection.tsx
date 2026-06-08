"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Leader {
  id: number;
  name: string;
  title: string;
  description: string;
  email: string;
  imageUrl: string;
  logo: string;
  href?: string;
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
    email: "ramesh@worldpartners.com",
    imageUrl: "/CEO.jpg",
    logo: "/logogreen.jpeg",
  },
  {
    id: 2,
    name: "Go Uenaka",
    title: "CEO, Glowing Partner",
    href: "https://www.glowing-partner.jp/",
    description: `First of all, as a Japanese national, I would like to express my sincere appreciation for your interest in Japan.

Glowing Partner Co., Ltd., based in Japan, is a company in which all employees are foreign nationals, and approximately 95% of them are from Nepal.
I hold great admiration for Nepalese people. They are friendly, place strong value on family and community, and I believe they possess a deep understanding of the "truly important things in life," which many Japanese may have begun to overlook.
By utilizing the bridge we have established between Nepal and Japan through the collaboration of World Partner Pvt. Ltd. and Glowing Partner Co., Ltd., we hope to welcome many more Nepali individuals to Japan.

Furthermore, after your arrival in Japan, we will provide our fullest support to ensure that you genuinely feel, "I am truly glad I came to Japan."`,
    email: "sita@worldpartners.com",
    imageUrl: "/CEO.jpg",
    logo: "/GpLogoTransparent.png",
  },
];

const LeadershipSection: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (id: number): void => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="w-full bg-[color:var(--color-surface)] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-label text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--color-secondary)] mb-4">
            The People Behind the Mission
          </p>
          <h2 className="font-headline text-4xl md:text-5xl font-light italic text-[color:var(--color-primary)]">
            Leadership
          </h2>
          <div className="w-16 h-0.5 bg-[color:var(--color-secondary)] mx-auto mt-5" />
        </div>

        {/* Card */}
        <div className="bg-white border border-[rgba(20,86,82,0.08)] shadow-sm overflow-hidden">
          {/* Top accent — primary → secondary */}
          <div
            className="h-1"
            style={{ background: "linear-gradient(to right, #145652, #c9a84c)" }}
          />

          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Map */}
            <div className="mb-12">
              <div className="max-w-5xl mx-auto">
                <div className="relative overflow-hidden border border-[rgba(20,86,82,0.15)] shadow-md h-48 sm:h-56 md:h-[344px]">
                  <Image
                    src="/Map1.png"
                    alt="Bridge between Nepal and Japan"
                    fill
                    className="object-contain sm:object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-[color:var(--color-primary)]/5 pointer-events-none" />
                </div>
                <p className="font-label text-center text-[10px] tracking-[0.25em] uppercase text-[color:var(--color-on-surface-variant)] mt-4">
                  Bridging Nepal &amp; Japan
                </p>
              </div>
            </div>

            {/* Leaders grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
              {leaders.map((leader) => (
                <div key={leader.id} className="flex flex-col items-center">
                  {/* Profile image */}
                  <div className="relative mb-8">
                    <div className="relative">
                      <div className="relative w-34 h-34 md:w-42 md:h-42 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-[color:var(--color-secondary)]/30">
                        <Image
                          src={leader.imageUrl}
                          alt={leader.name}
                          fill
                          className="object-cover transform scale-125 hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {/* Logo badge */}
                      <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden bg-white">
                        <Image
                          src={leader.logo}
                          alt={`${leader.name} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full text-center max-w-lg mx-auto">
                    <div className="mb-6">
                      <h3 className="font-headline text-3xl md:text-4xl font-light text-[color:var(--color-on-surface)] mb-1">
                        {leader.name}
                      </h3>
                      <p className="font-label text-sm tracking-wide text-[color:var(--color-primary)] font-medium">
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
                    <div className="mb-2">
                      <div className="relative">
                        <p
                          className={`font-body text-base md:text-lg leading-relaxed text-left whitespace-pre-line text-[color:var(--color-on-surface-variant)] ${
                            !expanded[leader.id] ? "line-clamp-5" : ""
                          }`}
                        >
                          {leader.description}
                        </p>

                        {!expanded[leader.id] && (
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        )}
                      </div>

                      <button
                        onClick={() => toggleExpand(leader.id)}
                        className="mt-4 inline-flex items-center gap-1.5 font-label text-sm text-[color:var(--color-primary)] hover:text-[color:var(--color-secondary)] font-medium transition-colors duration-200"
                      >
                        {expanded[leader.id] ? "Show Less" : "Read More"}
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${
                            expanded[leader.id] ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;

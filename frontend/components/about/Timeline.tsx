"use client";

import { motion } from "framer-motion";
import { Building2, Handshake, Shield, Globe, Heart, Zap, Star, ChevronRight } from "lucide-react";

const companyHistory = [
  {
    year: "2018",
    milestone: "Founded",
    title: "A Bold Beginning",
    description:
      "Glowing Partner Co., Ltd. is established in Japan with a clear mission: to build a society where diversity is celebrated and every individual's potential can shine.",
    primary: true,
    icon: <Building2 size={20} />,
  },
  {
    year: "2019",
    milestone: "Partnership",
    title: "Bridging Two Nations",
    description:
      "A landmark partnership with World Partner Pvt. Ltd. in Nepal creates a powerful bridge, connecting talented Nepali professionals with forward-thinking Japanese companies.",
    primary: false,
    icon: <Handshake size={20} />,
  },
  {
    year: "2020",
    milestone: "Resilience",
    title: "Thriving Through Change",
    description:
      "Despite global challenges, Glowing Partner adapts and grows — demonstrating that diversity and international collaboration are sources of strength, not vulnerability.",
    primary: true,
    icon: <Shield size={20} />,
  },
  {
    year: "2021",
    milestone: "Expansion",
    title: "A Growing Network",
    description:
      "Partnerships with Japanese companies across diverse industries multiply, placing international talent where it matters most and proving that integration creates innovation.",
    primary: false,
    icon: <Globe size={20} />,
  },
  {
    year: "2022",
    milestone: "Community",
    title: "More Than a Business",
    description:
      "Glowing Partner deepens its commitment to community through active volunteer initiatives, reinforcing the belief that contributing to others' happiness is the greatest motivation.",
    primary: true,
    icon: <Heart size={20} />,
  },
  {
    year: "2023",
    milestone: "Innovation",
    title: "Reshaping the Future of Work",
    description:
      "New processes and digital tools streamline the journey from application to employment, expanding access to opportunity for international talent across Japan.",
    primary: false,
    icon: <Zap size={20} />,
  },
  {
    year: "2024",
    milestone: "Today",
    title: "A Cycle of Success",
    description:
      "With a dedicated team — 95% from Nepal — Glowing Partner continues to prove that international talent drives a cycle of innovation, success, and genuine human connection.",
    primary: true,
    icon: <Star size={20} />,
  },
];

export default function Timeline() {
  return (
    <section className="bg-[color:var(--color-surface)] py-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-label text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--color-secondary)] mb-4">
            Our Journey
          </p>
          <h2 className="font-headline text-5xl font-light italic text-[color:var(--color-primary)]">
            Company Timeline
          </h2>
          <div className="w-16 h-0.5 bg-[color:var(--color-secondary)] mx-auto mt-5" />
        </div>

        <div className="relative">
          {/* Center vertical line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-px h-full hidden lg:block"
            style={{ background: "linear-gradient(to bottom, #145652, #c9a84c, #145652)" }}
          />

          <div className="space-y-14">
            {companyHistory.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -48 : 48 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                className={`relative flex flex-col lg:flex-row items-center ${
                  index % 2 === 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Year badge */}
                <div
                  className={`lg:w-1/2 flex mb-6 lg:mb-0 ${
                    index % 2 === 0 ? "lg:justify-start lg:pl-12" : "lg:justify-end lg:pr-12"
                  }`}
                >
                  <motion.div whileHover={{ scale: 1.08 }} className="relative">
                    <div
                      className="w-28 h-28 rounded-full p-[3px] shadow-lg"
                      style={{
                        background: item.primary
                          ? "linear-gradient(135deg, #145652, #1e7a74)"
                          : "linear-gradient(135deg, #c9a84c, #e0c06a)",
                      }}
                    >
                      <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center gap-1">
                        <span className="font-headline text-xl font-semibold text-[color:var(--color-primary)]">
                          {item.year}
                        </span>
                        <span className="font-label text-[9px] font-semibold tracking-widest uppercase text-[color:var(--color-on-surface-variant)] bg-[color:var(--color-container-low)] px-2 py-0.5 rounded-full">
                          {item.milestone}
                        </span>
                      </div>
                    </div>
                    {/* Mobile connector */}
                    <div className="lg:hidden absolute top-full left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-[#145652]/40 to-transparent" />
                  </motion.div>
                </div>

                {/* Center dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-[color:var(--color-primary)] z-10 hidden lg:block shadow-sm" />

                {/* Content card */}
                <div
                  className={`lg:w-1/2 ${
                    index % 2 === 0 ? "lg:pr-12" : "lg:pl-12"
                  }`}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl p-6 border border-[rgba(20,86,82,0.1)] shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white"
                        style={{
                          background: item.primary
                            ? "linear-gradient(135deg, #145652, #1e7a74)"
                            : "linear-gradient(135deg, #c9a84c, #e0c06a)",
                        }}
                      >
                        {item.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3 className="font-headline text-xl text-[color:var(--color-primary)]">
                            {item.title}
                          </h3>
                          <span className="font-label text-[10px] text-[color:var(--color-on-surface-variant)] bg-[color:var(--color-container-low)] px-2.5 py-1 rounded-full shrink-0">
                            {item.year}
                          </span>
                        </div>
                        <p className="font-body text-sm text-[color:var(--color-on-surface-variant)] leading-relaxed">
                          {item.description}
                        </p>

                        {/* Mobile milestone indicator */}
                        <div className="lg:hidden mt-3 pt-3 border-t border-[color:var(--color-container-low)]">
                          <div className="flex items-center text-xs text-[color:var(--color-on-surface-variant)] font-label">
                            <ChevronRight size={14} className="mr-1" />
                            Milestone {index + 1} of {companyHistory.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

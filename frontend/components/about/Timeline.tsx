"use client";

import { motion } from "motion/react";
import { Building2, Handshake, Shield, Globe, Heart, Zap, Star, ChevronRight } from "lucide-react";

const companyHistory = [
  {
    year: "1998/09/07",
    milestone: "設立",
    title: "(株)日本医学総合研究振興協会\n設立\n調剤薬局事業を開始",
    description: "",
    primary: true,
    icon: <Building2 size={20} />,
  },
  {
    year: "2003/09/01",
    milestone: "事業開始",
    title: "薬剤師の労働者派遣事業、\n有料職業紹介事業を開始",
    description: "",
    primary: false,
    icon: <Handshake size={20} />,
  },
  {
    year: "2018/08/01",
    milestone: "社名変更",
    title: "社名変更と事業転換",
    description: "",
    primary: true,
    icon: <Shield size={20} />,
  },
  {
    year: "2018/12/01",
    milestone: "スクール事業開始",
    title:
      "留学生向けの就職支援スクール「GP 内定 Academy」を開講し、3年間で500名以上の内定者を輩出",
    description: "",
    primary: false,
    icon: <Globe size={20} />,
  },
  {
    year: "2023/02/01",
    milestone: "スタッフ50人突破",
    title: "派遣スタッフ数が50人を超える",
    description: "",
    primary: true,
    nowrap: true,
    icon: <Zap size={20} />,
  },
  {
    year: "2025/04/10",
    milestone: "現地法人設立",
    title: "ネパール現地法人 World Partner Pvt.,Ltd.を設立",
    description: "",
    primary: false,
    icon: <Heart size={20} />,
  },
  {
    year: "2025/09/01",
    milestone: "スタッフ100人突破",
    title: "派遣スタッフ数が100人を超える",
    description: "",
    primary: true,
    nowrap: true,
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
            これまでの歩み
          </p>
          <h2 className="font-headline text-5xl font-light italic text-[color:var(--color-primary)]">
            沿革・ヒストリー
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
                        <span className="font-headline text-sm sm:text-base font-semibold tracking-tight whitespace-nowrap text-[color:var(--color-primary)]">
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
                          <h3
                            className={`font-headline text-xl text-[color:var(--color-primary)] whitespace-pre-line ${
                              "nowrap" in item && item.nowrap ? "sm:whitespace-nowrap" : ""
                            }`}
                          >
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

"use client";

import { motion } from "framer-motion";
import { Building2, Handshake, Shield, Globe, Heart, Zap, Star, ChevronRight } from "lucide-react";

const companyHistory = [
  {
    year: "2018年",
    milestone: "会社設立",
    title: "新たな挑戦のスタート",
    description:
      "確かな使命を掲げ、日本にて株式会社Glowing Partnerを設立。多様性を尊重し、すべての個人の可能性が輝く社会づくりへの第一歩を踏み出しました。",
    primary: true,
    icon: <Building2 size={20} />,
  },
  {
    year: "2019年",
    milestone: "業務提携",
    title: "二国間を繋ぐ架け橋の構築",
    description:
      "ネパールの現地法人「World Partner Pvt. Ltd.」との強固なパートナーシップを締結。優秀なネパール人求職者と、未来を見据える日本企業を結ぶ確かなルートを確立しました。",
    primary: false,
    icon: <Handshake size={20} />,
  },
  {
    year: "2020年",
    milestone: "柔軟な変化と適応",
    title: "逆境を乗り越える組織力",
    description:
      "世界的な社会情勢の変化に直面する中、柔軟に事業を適応させ成長を維持。多様性と国際的な連携こそが、困難に負けない真の強みであることを証明しました。",
    primary: true,
    icon: <Shield size={20} />,
  },
  {
    year: "2021年",
    milestone: "事業の拡大",
    title: "拡大する信頼のネットワーク",
    description:
      "幅広い業種の日本企業との取引が急速に拡大。国際的な人材が現場の中核として活躍し、多様性の受け入れが組織にイノベーションをもたらすことを示しました。",
    primary: false,
    icon: <Globe size={20} />,
  },
  {
    year: "2022年",
    milestone: "地域社会への貢献",
    title: "ビジネスを超えた絆",
    description:
      "社会貢献活動やボランティアへ積極的に取り組み、地域社会との結びつきを強化。「誰かの幸福に寄与することこそが最大の原動力である」という理念を実践しました。",
    primary: true,
    icon: <Heart size={20} />,
  },
  {
    year: "2023年",
    milestone: "プロセスの革新",
    title: "雇用手続きのDX推進",
    description:
      "新しいデジタルツールの導入により、応募から採用・就労までの手続きを効率化。日本全国の企業へ、よりスムーズに国際人材を紹介できる環境を整えました。",
    primary: false,
    icon: <Zap size={20} />,
  },
  {
    year: "2024年",
    milestone: "現在、そして未来へ",
    title: "成功と信頼のグローバル循環",
    description:
      "メンバーの多くをネパール国籍のスタッフが占める強みを活かし、国際人材がもたらす組織の成長、ビジネスの成功、そして国境を超えた真の人間関係の好循環を証明し続けています。",
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

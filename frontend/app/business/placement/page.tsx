import Hero from "@/components/business/Hero";
import Section from "@/components/business/Section";
import FeatureGrid from "@/components/business/FeatureGrid";
import StatGraphic from "@/components/business/StatGraphic";
import CrossSell from "@/components/business/CrossSell";

export const metadata = {
  title: "人材紹介事業（有料職業紹介） | 株式会社Glowing Partner",
  description:
    "直接雇用を希望される企業様に対して、完全成功報酬型の人材紹介サービスを提供しております。採用が決定するまで費用は一切かからないため、リスクなく確実な採用活動を進められます。",
};

function IconHandshake() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 24l8-8 6 4 6-4 8 8" />
      <path d="M4 24l6 6 6-2 4 4 6-2 6-6" />
    </svg>
  );
}

function IconCoin() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="22" cy="22" r="14" />
      <path d="M22 14v16M18 18h6a3 3 0 1 1 0 6h-4a3 3 0 1 0 0 6h6" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="22" cy="22" r="16" />
      <circle cx="22" cy="22" r="10" />
      <circle cx="22" cy="22" r="4" />
    </svg>
  );
}

export default function PlacementPage() {
  return (
    <>
      <Hero
        eyebrow="③ 人材紹介事業"
        title="人材紹介サービス"
        lede="弊社では、直接雇用を希望される企業様に対して、完全成功報酬型の人材紹介を実施しております。採用が正式に決定するまで費用は発生しないため、無駄なコストをかけずに最適な人材を確保できます。"
        image="/Business3.jpeg"
        imageAlt="Recruitment and Placement Services"
      />

      <StatGraphic
        eyebrow="仕組みと特徴"
        heading="初期費用ゼロの完全成功報酬型モデル。"
        headingNowrap
        stats={[
          { value: "0", label: "初期費用", sub: "採用が決定するまでの着手金や掲載料などは一切かかりません。" },
          { value: "100%", label: "完全成功報酬制", sub: "紹介した候補者の入社が確定した段階で 初めて費用が発生します。" },
          { value: "1", label: "目指すゴール", sub: "貴社チームの即戦力となる、直接雇用に最適な人材とのマッチング。" },
        ]}
      />

      <Section
        eyebrow="直接雇用のメリット"
        heading="長期的な活躍を見据えた、直接雇用の基盤づくり。"
        headingNowrap
        body="弊社の有料職業紹介は、派遣スタッフではなく、自社のコアメンバーとして長期的に活躍する直接雇用枠での採用を目指す企業様に最適なサービスです。完全成功報酬制だからこそ、私たちは単に「枠を埋める」ための紹介はいたしません。貴社の要件や社風に本当にマッチする人材の厳選に徹底してこだわります。"
      />

      <FeatureGrid
        features={[
          {
            icon: <IconHandshake />,
            title: "ミスマッチのない厳選紹介",
            body: "採用決定までは費用をいただきません。そのため、手当たり次第に候補者を推薦するのではなく、貴社の要件に真に合致する人材のみをご提案します。",
          },
          {
            icon: <IconCoin />,
            title: "リスクゼロでのスタート",
            body: "着手金や登録料といった前払いの費用は一切不要です。候補者が内定を承諾し、直接雇用として入社を迎えるまで費用は発生しません。",
          },
          {
            icon: <IconTarget />,
            title: "厳選された候補者リスト",
            body: "独自の採用パイプラインを活用し、膨大な履歴書で人事担当者様の手間を煩わせることなく、スクリーニングを重ねた最適な候補者のみを絞り込んで提示します。",
          },
        ]}
      />

      <CrossSell />
    </>
  );
}

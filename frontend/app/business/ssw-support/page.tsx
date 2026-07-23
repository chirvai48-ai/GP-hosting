import Hero from "@/components/business/Hero";
import Section from "@/components/business/Section";
import FeatureGrid from "@/components/business/FeatureGrid";
import StatGraphic from "@/components/business/StatGraphic";
import CrossSell from "@/components/business/CrossSell";

export const metadata = {
  title: "特定技能外国人の支援事業（登録支援機関） | 株式会社Glowing Partner",
  description:
    "ネパール現地法人「World Partner Pvt.Ltd.」をグループ会社として有し、現地での人材育成・募集から、国家資格を持つキャリアコンサルタントによる採用後の支援業務まで一貫して対応しています。",
};

function IconFlag() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M10 4v36" />
      <path d="M10 6h22l-4 6 4 6H10" />
    </svg>
  );
}

function IconBridge() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 30c6 0 6-10 18-10s12 10 18 10" />
      <path d="M4 36h36M12 30v6M20 26v10M28 26v10M36 30v6" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M22 4l14 4v14c0 10-8 16-14 18-6-2-14-8-14-18V8l14-4Z" />
      <path d="M16 22l4 4 8-8" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="15" cy="16" r="5" />
      <circle cx="29" cy="16" r="5" />
      <path d="M5 34c0-5 4-9 10-9s10 4 10 9M22 34c0-5 4-9 10-9s7 4 7 9" />
    </svg>
  );
}

export default function SswSupportPage() {
  return (
    <>
      <Hero
        eyebrow="④ 特定技能外国人の支援事業（登録支援機関）"
        title="特定技能外国人 支援サービス"
        lede="ネパール現地法人「World Partner Pvt.Ltd.」をグループ会社として有し、ネパール現地での人材育成・募集が可能です。日本での採用後も、国家資格を持つキャリアコンサルタントが支援業務を担当します。"
        image="/Business4.jpeg"
        imageAlt="SSW Support Services"
        sideBySide
      />

      <Section
        eyebrow="ネパール現地のパイプライン"
        heading="グループ会社を通じた現地での人材育成と募集。"
        body="ネパール現地法人「World Partner Pvt.Ltd.」をグループ会社として有しているため、ネパール現地での直接の人材育成・募集が可能です。来日前から日本での就労や生活に向けた確かなパイプラインを構築しています。"
      />

      <StatGraphic
        eyebrow="選考アドバイス体制"
        heading="実績豊富なプロフェッショナルによる選考サポート。"
        stats={[
          { value: "10,000+", label: "10,000人以上の実績", sub: "選考の際には、これまでのべ10,000人以上のネパール人選考実績がある日本人が対応します。" },
          { value: "12+ yrs", label: "日本在住12年以上", sub: "日本在住12年以上のネパール人スタッフが、双方の文化や考え方を深く理解し選考を行います。" },
          { value: "2", label: "的確なアドバイス", sub: "日本人とネパール人が、それぞれの視点から選考のポイントを分かりやすくアドバイスいたします。" },
        ]}
      />

      <FeatureGrid
        eyebrow="サービスの特徴"
        heading="募集から採用後の支援までトータルサポート。"
        features={[
          {
            icon: <IconFlag />,
            title: "ネパール現地での人材育成・募集",
            body: "ネパール現地法人「World Partner Pvt.Ltd.」をグループ会社として有し、現地でのダイレクトな人材育成と募集を行います。",
          },
          {
            icon: <IconUsers />,
            title: "実績に基づく選考アドバイス",
            body: "これまでのべ10,000人以上の選考実績がある日本人が、日本在住12年以上のネパール人とともに選考のポイントをアドバイスいたします。",
          },
          {
            icon: <IconBridge />,
            title: "文化の違いを埋めるマッチング",
            body: "双方の求めていることを深く理解した上で選考を行うため、ミスマッチがなく、スムーズに日本での就労を開始できます。",
          },
          {
            icon: <IconShield />,
            title: "国家資格保持者による採用後支援",
            body: "採用後の義務的支援業務やアフターケアについては、国家資格を持つプロのキャリアコンサルタントが全面的に担当いたします。",
          },
        ]}
      />

      <CrossSell />
    </>
  );
}

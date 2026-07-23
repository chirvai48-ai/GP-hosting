import Hero from "@/components/business/Hero";
import Section from "@/components/business/Section";
import FeatureGrid from "@/components/business/FeatureGrid";
import StatGraphic from "@/components/business/StatGraphic";
import CrossSell from "@/components/business/CrossSell";

export const metadata = {
  title: "労働者派遣事業（人材派遣） | 株式会社Glowing Partner",
  description:
    "学校とのつながりを活かし、主に留学生を採用・派遣しております。社会保険料がかからない留学生を雇用することで派遣手数料を抑えたご提案を可能にし、365日対応の通訳コールセンターで企業様をサポートします。",
};

function IconGlobe() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="22" cy="22" r="16" />
      <path d="M6 22h32M22 6c4 5 6 10 6 16s-2 11-6 16c-4-5-6-10-6-16s2-11 6-16Z" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M8 8h12a6 6 0 0 1 6 6v22a4 4 0 0 0-4-4H8V8Z" />
      <path d="M36 8H24a6 6 0 0 0-6 6v22a4 4 0 0 1 4-4h14V8Z" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="14" y="4" width="16" height="36" rx="2" />
      <path d="M20 34h4" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M8 38V12l14-6 14 6v26" />
      <path d="M8 38h28M16 18h4M24 18h4M16 26h4M24 26h4M20 38v-6h4v6" />
    </svg>
  );
}

export default function StaffingPage() {
  return (
    <>
      <Hero
        eyebrow="② 労働者派遣事業"
        title="人材派遣サービス"
        lede="弊社では学校とのつながりを活かし、主に留学生を採用して派遣しております。意欲あふれる優秀な人材をマッチングすると同時に、留学生雇用の強みを活かして派遣手数料を抑えた最適なご提案を実現しています。"
        image="/Business2.jpeg"
        imageAlt="人材派遣サービス"
      />

      <Section
        eyebrow="弊社の特徴・強み"
        heading="学校との強い絆と、派遣手数料を抑えたコストメリット。"
        body="社会保険料がかからない留学生を雇用することで、派遣手数料を抑えたご提案ができるというのが弊社の大きな特徴です。派遣先の業種に関しては、主にビルクリーニング事業者様（清掃業務）へスタッフを派遣しております。"
      />

      <StatGraphic
        eyebrow="実績と特徴"
        heading="留学生の強みを最大限に活かした派遣モデル。"
        stats={[
          { value: "365", label: "365日対応コールセンター", sub: "派遣先企業様と外国籍スタッフとの間に入り、通訳サポートを通年で実施。" },
          { value: "0", label: "社会保険料のコストカット", sub: "社会保険料がかからない留学生の雇用により、低価格な手数料を実現。" },
          { value: "1°", label: "学校との強固なつながり", sub: "各種教育機関との独自のネットワークから、優秀な留学生を安定採用。" },
        ]}
      />

      <FeatureGrid
        eyebrow="支援・サポート体制"
        heading="企業様と外国籍スタッフの双方に安心をお届けする仕組み。"
        features={[
          {
            icon: <IconBook />,
            title: "母国語での業務マニュアル作成",
            body: "派遣スタッフ（外国籍）が現場で迷わず安全に働けるよう、それぞれの母国語に翻訳した分かりやすい業務マニュアルを作成・完備しています。",
          },
          {
            icon: <IconPhone />,
            title: "365日対応のコールセンター",
            body: "365日いつでも対応可能なコールセンターを設置し、派遣先企業様と外国籍スタッフとの円滑な通訳サポートを行っています。",
          },
          {
            icon: <IconBuilding />,
            title: "ビルクリーニング（清掃業務）中心",
            body: "主にビルクリーニング事業者様に対して人材を派遣しており、清掃業務の現場において確かな稼働実績を誇ります。",
          },
          {
            icon: <IconGlobe />,
            title: "学校連携による留学生採用",
            body: "大学・専門学校・日本語学校との深い信頼関係のもと、日本での就労意欲が非常に高い留学生を安定的かつ継続的に採用しています。",
          },
        ]}
      />

      <CrossSell />
    </>
  );
}

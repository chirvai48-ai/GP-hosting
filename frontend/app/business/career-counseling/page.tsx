import Hero from "@/components/business/Hero";
import Section from "@/components/business/Section";
import PhotoStrip from "@/components/business/PhotoStrip";
import ExternalLinkCard from "@/components/business/ExternalLinkCard";
import StatGraphic from "@/components/business/StatGraphic";
import CrossSell from "@/components/business/CrossSell";

export const metadata = {
  title: "就職活動支援事業 | 株式会社Glowing Partner",
  description:
    "キャリアコンサルタントの国家資格を有する代表の上中が中心となり、個人および学校法人に対して、就職活動に関するノウハウ提供やキャリア支援を行っています。",
};

export default function CareerCounselingPage() {
  return (
    <>
      <Hero
        eyebrow="① 就職活動支援事業"
        title="就職活動支援サービス"
        lede="キャリアコンサルタントの国家資格を有する、代表の上中が中心となり、個人および学校に対して、就職活動に関するノウハウ提供をしています。"
        image="/Seminar3.jpg"
        imageAlt="就職活動支援サービス"
      />

      <ExternalLinkCard
        eyebrow="国家資格"
        title="＜キャリアコンサルタントとは？＞"
        description="特定非営利活動法人 日本キャリア開発協会のウェブサイトで、国家資格「キャリアコンサルタント」の公式な説明をご覧いただけます。"
        href="https://www.career-cc.org/"
        linkLabel="外部サイトへ移動（career-cc.org）"
      />

      <Section
        eyebrow="個人向け"
        heading="就活スクール「GP内定アカデミー」"
        body="コロナ禍で求人が激減した際、「優秀でありながら就職活動のやり方が分からず苦労している方々のお役に少しでも立ちたい」という強い想いからスタートしました。その結果、これまでに500社以上の内定実績を誇り、多くの方のキャリア形成に貢献しています。"
        image="/Seminar1.jpg"
        image2="/Seminar2.jpg"
        imageAlt="就活スクール「GP内定アカデミー」"
      >
        <p className="text-base md:text-lg leading-relaxed text-[color:var(--color-on-surface-variant)] font-[var(--font-label)]">
          「面接対策」など、ご自身で納得のいく就職活動ができるよう（自分自身の経験をより効果的に企業に提案するノウハウ）、丁寧に指導・伴走するのが私たちの特徴です。国家資格を持つプロのキャリアコンサルタントが、求職者様ひとりひとりの就職活動を全面的にサポートいたします。
        </p>
      </Section>

      <StatGraphic
        stats={[
          { value: "500+", label: "500社以上", sub: "多くの受講生が希望の企業より内定を獲得しています。" },
          { value: "1:1", label: "徹底的な伴走支援", sub: "国家資格を持つプロのキャリアコンサルタントが個別指導。" },
          { value: "2 yrs", label: "2年連続の実績", sub: "北海道観光人材発掘事業の一環として就職活動セミナーを実施" },
        ]}
      />

      <Section
        eyebrow="学校法人向け"
        heading="就活セミナー"
        body="留学生が多数在籍する大学・専門学校・日本語学校にて、就職活動のノウハウを提供することにより、学校全体の就職率UPに貢献しています。2年連続で、北海道観光人材発掘事業の一環での就職活動セミナーを実施した実績があります。"
        image="/Seminar4.jpg"
        imageAlt="学校法人向け就活セミナーの風景"
        reverse
      />

      <PhotoStrip
        eyebrow="2024年度、2025年度"
        heading="北海道観光人材発掘事業の就職支援講座を担当"
        photos={[
          { src: "/Seminar1.jpg", caption: "個別面談・指導" },
          { src: "/Seminar2.jpg", caption: "就活ワークショップ" },
          { src: "/Seminar3.jpg", caption: "キャリアカウンセリング" },
          { src: "/Seminar4.jpg", caption: "学内就職ガイダンス" },
        ]}
      />

      <CrossSell />
    </>
  );
}

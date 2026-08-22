import DiagonalPanel, {
  DiagonalPanelData,
} from "@/components/services/DiagonalPanel";
import DiagonalCTA from "@/components/services/DiagonalCTA";

const panels: DiagonalPanelData[] = [
  {
    number: "01",
    label: "サポート内容",
    headline: "次のキャリアを、ともに真剣に考えます。",
    body:
      "一般的な求職アドバイスは画一的なものになりがちですが、当社のサポートは異なります。国家資格キャリアコンサルタントとチームで候補者一人ひとりとじっくり向き合い、これからの10年をどう過ごしたいかを伺った上で、大量の求人ではなく、本当にマッチする厳選されたポジションのみをご紹介します。膨大な求人検索の手間を省き、対話を通じたより良いマッチングを実現します。",
    image: "/2panel01.jpg",
    bullets: [
      "一斉送信メールではなく、1対1の個別面談",
      "表面的なお世辞ではない、適性に対する率直なフィードバック",
      "日本語と英語のバイリンガルサポート",
    ],
  },
  {
    number: "02",
    label: "カウンセリング・選考対策",
    headline: "スクール形式と個別形式での就職・転職コンサルティング",
    body:
      "Glowing Partner Naitei Academy（GPNA）を通じ、就職活動を行う学生向けに体系的な選考対策プログラムを実施しています。また、中途採用やブランクのある方向けには、国家資格を持つキャリアコンサルタントとチームで個別相談を承ります。10年にわたる実績に基づき、秘密厳守でじっくりと時間をかけてサポートします。",
    image: "/Seminar2.jpg",
    bullets: [
      "GPNA — 新卒・学生向けプログラム",
      "専任チームによるキャリアコンサルティング",
      "エントリーシート（ES）、面接、模擬選考対策",
    ],
  },
  {
    number: "03",
    label: "幅広い就業機会",
    headline: "アルバイトから正社員まで、あらゆる働き方に対応。",
    body:
      "短期間のアルバイトから、正社員としてのキャリアチェンジ、あるいは特定技能を活用した長期的なキャリア形成まで、幅広い働き方の求人を扱っています。一度お話を伺うだけで、あなたに最適なキャリアパスをご提案します。",
    image: "/2panel03.jpg",
    imagePosition: "100% center",
    bullets: [
      "アルバイトの直接雇用紹介",
      "正社員・中途採用（転職）",
      "特定技能ビザの求人",
    ],
  },
];

export default function ForJobSeekerPage() {
  return (
    <main className="bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)]">
      {panels.map((p, i) => (
        <DiagonalPanel key={p.number} data={p} index={i} />
      ))}
      <DiagonalCTA
        kicker="お問い合わせ"
        headline="次のキャリアについて、まずはご相談ください。"
        body="ご自身の経歴、ご希望の条件、ご連絡先を簡単なメッセージでお送りください。専任のカウンセラーが、個別にご返信いたします。"
        href="/contact/customer"
        ctaLabel="求職者様向けお問い合わせ"
        image="/message.jpg"
      />
    </main>
  );
}

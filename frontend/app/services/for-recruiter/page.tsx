import DiagonalPanel, {
  DiagonalPanelData,
} from "@/components/services/DiagonalPanel";
import DiagonalCTA from "@/components/services/DiagonalCTA";

const panels: DiagonalPanelData[] = [
  {
    number: "01",
    label: "当社が選ばれる理由",
    headline: "ミスマッチのない、確実な採用を。",
    body:
      "採用活動には多大なコストと労力がかかります。当社は求人掲載から内定までの煩雑な業務（書類選考、面接調整、カルチャーフィットの確認、語学力チェックなど）をすべて代行します。貴社の貴重な時間を奪うことなく、面接の場には「本当に会うべき人材」だけをご案内します。",
    image: "/Panel01.jpg",
    bullets: [
      "スクリーニング済みの、要件に完全にマッチした人材のみをご紹介",
      "国内外のネットワークを活かしたバイリンガル人材の確保",
      "選考プロセスの各段階における透明性の高い進捗報告",
    ],
  },
  {
    number: "02",
    label: "幅広い人材層に対応",
    headline: "アルバイトから特定技能人材まで。",
    body:
      "パート・アルバイトスタッフ、フルタイムのバイリンガル事務職、特定技能人材のまとまった採用、技能実習生まで、貴社のあらゆる採用ニーズに応える独自のパイプラインを備えています。窓口を一つに絞り、採用から定着までをワンストップでサポートします。",
    image: "/panel02.jpg",
    imagePosition: "0% center",
    bullets: [
      "アルバイト派遣・紹介",
      "正社員・派遣社員の人材紹介",
      "特定技能人材",
      "技能実習生",
    ],
  },
  {
    number: "03",
    label: "コンプライアンスと就業後のフォロー",
    headline: "内定を出して終わり、ではありません。",
    body:
      "採用はゴールではなく、定着してこそ成功と言えます。入社時のオンボーディングから入社1ヶ月後の面談、初期段階での課題解決まで、当社が継続してサポートします。外国籍人材の採用においては、送出機関や監理団体との連携も行い、貴社の人事部門がコンプライアンス対応で負担を抱えることのないよう徹底してフォローします。",
    image: "/panel03.jpg",
    bullets: [
      "入社後1年間にわたる定期的なフォローアップ面談",
      "試用期間中の早期離職に対する保証制度",
      "ビザ申請、雇用契約、労務関連のサポート",
    ],
  },
];

export default function ForRecruiterPage() {
  return (
    <main className="bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)]">
      {panels.map((p, i) => (
        <DiagonalPanel key={p.number} data={p} index={i} />
      ))}
      <DiagonalCTA
        kicker="お問い合わせ"
        headline="貴社の採用ニーズをお聞かせください。"
        body="募集ポジション、採用予定人数、ご希望의 時期などを簡単なメッセージでお送りください。一方的な営業のご連絡ではなく、貴社に最適な採用プランを具体的にご提案いたします。"
        href="/contact/company"
        ctaLabel="企業様向けお問い合わせ"
        image="/company.jpg"
      />
    </main>
  );
}

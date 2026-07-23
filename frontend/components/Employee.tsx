import ThreeDCarousel, { ThreeDCarouselItem } from "./lightswind/3d-carousel";

const items: ThreeDCarouselItem[] = [
  {
    id: 1,
    title: "代表取締役",
    brand: "上中 豪",
    description:
      "2018年8月の創業以来、「社員は全員外国人」という独自の理念のもとGlowing Partnerを築き上げ、自らが提案・推奨する取り組みを率先して実践することに尽力しています。",
    tags: ["リーダーシップ", "戦略", "外国人雇用", "創業者"],
    imageUrl: "/UenkaGO.jpg",
    link: "/about#uenaka",
    isFeatured: true,
  },
  {
    id: 2,
    title: "",
    brand: "ポケレル・ナラヤン",
    description:
      "私は12年前から日本に住んでいます。その経験があるので、日本企業と、外国人社員の双方の求めていることや考え方を深く理解することができます。リアルな声を聞き、文化の違いを埋めながら「双方向の100%な意思疎通」を目指したサポートを心がけています。私も12年前に海を渡って日本に来た外国人の一人です。だからこそ、外国人社員の気持ちや、活かし方を誰よりも理解しています。質の高いコミュニケーション力で双方を繋ぐ架け橋として、全力でサポートいたします。",
    tags: ["ブリッジパートナー", "日本・ネパール", "コミュニケーション", "アドバイザー"],
    imageUrl: "/Narayan.jpeg",
    link: "/about#narayan",
  },
  {
    id: 3,
    title: "",
    brand: "グルン・アルン",
    description:
      "外国人材の採用支援から、入社後の労務管理・教育、装置して企業様へのアフターフォローまで、一貫して担当しております。私自身も外国人として日本で働く中で、周囲の温かいサポートに助けられ、成長してきました。その経験があるからこそ、求職者の皆様の不安に心から寄り添い、的確なアドバイスができます。企業様には「現場で活躍し定着する人材」の提供とフォローを。求職者の皆様には「安心して働ける環境」への橋渡しを。「人とのつながり」を何よりも大切にし、双方にとって最良のパートナーとなれるよう尽力いたします。",
    tags: ["採用支援", "労務管理", "研修", "フォローアップ"],
    imageUrl: "/Arun.jpeg",
    link: "/about#arun",
  },
  {
    id: 4,
    title: "",
    brand: "サニュクタ・アマチャ",
    description:
      "Glowing Partnerは、一人ひとりの目標や希望に寄り添い、安心して成長できる職場との出会いをサポートしています。私たちは、新たな挑戦や新しいスタートには大きな可能性があると信じています。共に明るい未来を築いていきましょう。",
    tags: ["キャリアサポート", "候補者サポート", "メンターシップ"],
    imageUrl: "/Amatya.jpeg",
    link: "/about#sanyukta",
  },
  {
    id: 5,
    title: "",
    brand: "シュレスタ・ノリン",
    description:
      "私にとって、チームワーク、相手への敬意、そして継続的な学びはとても大切です。常に学び、貢献できる機会をいただけることに感謝しています。また、一緒に働く皆様に対して、信頼される存在として、親切で丁寧なサポートを提供することを目標としています。",
    tags: ["お客様サポート", "チームワーク", "信頼性"],
    imageUrl: "/Norin.jpeg",
    link: "/about#norin",
  },
  {
    id: 6,
    title: "",
    brand: "ポカレル・ニラジャン",
    description:
      "日々の業務において、企業様やスタッフの皆様との「信頼関係」を築くことを何よりも大切にしています。いただいたご相談や業務の一つひとつに誠実向き合い、責任を持って取り組んでおります。皆様にとって最も身近で頼れる存在となれるよう、誠心誠意サポートさせていただきます。",
    tags: ["アカウントマネジメント", "スタッフサポート", "Trust"],
    imageUrl: "/Nirajan.jpeg",
    link: "/about#nirajan",
  },
];

function EmployeeSection() {
  return (
    <div className="flex flex-col p-10 h-auto">
      <h2 className="flex items-center justify-center pt-12 text-4xl font-headline text-primary">
        チーム紹介
      </h2>
      <div className="w-32 h-0.5 mx-auto mb-2 bg-secondary mb-12" />
      <ThreeDCarousel
        items={items}
        autoRotate={true}
        rotateInterval={3500}
        cardHeight={500}
      />
    </div>
  );
}

export default EmployeeSection;

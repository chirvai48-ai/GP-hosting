export default function IntroSection() {
  return (
    <section className="bg-[color:var(--color-container-low)] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">

        {/* Section label */}
        <p className="font-label text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--color-secondary)] mb-6">
          当社について
        </p>

        {/* Headline */}
        <h1 className="font-headline text-6xl sm:text-7xl lg:text-8xl font-light italic text-[color:var(--color-primary)] leading-[1.05] mb-6">
          「違うから良い」と思える社会へ
        </h1>

        {/* Gold accent */}
        <div className="w-20 h-0.5 bg-[color:var(--color-secondary)] mx-auto mb-10" />

        {/* Introduction */}
        <p className="font-body text-lg text-[color:var(--color-on-surface-variant)] leading-relaxed max-w-3xl mx-auto">
          株式会社Glowing Partnerは、「違い」こそが組織を強くする原動力であると信じています。2018年の創業以来、多様性が認められ、一人ひとりの可能性が最大限に輝く社会の実現を目指してまいりました。私たちは外国人雇用のスペシャリストとして、優秀な外国人求職者の皆様と、未来を見据える企業様とを繋ぐ架け橋です。「チャンスは人を通じてやってくる」という信念のもと、国際的な人材の活躍がイノベーションと成長の好循環を生むことを証明し、日本における新しい雇用の未来を切り拓いていきます。
        </p>

      </div>
    </section>
  );
}

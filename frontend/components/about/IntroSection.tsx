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

      </div>
    </section>
  );
}

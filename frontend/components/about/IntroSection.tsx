export default function IntroSection() {
  return (
    <section className="bg-[color:var(--color-container-low)] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">

        {/* Section label */}
        <p className="font-label text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--color-secondary)] mb-6">
          About Us
        </p>

        {/* Headline */}
        <h1 className="font-headline text-6xl sm:text-7xl lg:text-8xl font-light italic text-[color:var(--color-primary)] leading-[1.05] mb-6">
          Differences create new opportunities
        </h1>

        {/* Gold accent */}
        <div className="w-20 h-0.5 bg-[color:var(--color-secondary)] mx-auto mb-10" />

        {/* Introduction */}
        <p className="font-body text-lg text-[color:var(--color-on-surface-variant)] leading-relaxed max-w-3xl mx-auto">
          At Glowing Partner Co., Ltd., we believe that being different is what makes us stronger.
          Founded in 2018, our mission is to build a society where diversity is celebrated and every
          individual's potential can shine. As specialists in foreign national employment, we bridge
          the gap between talented job seekers and forward-thinking companies. Guided by the
          philosophy that &ldquo;opportunities come through people,&rdquo; we are committed to
          reshaping the future of work in Japan by proving that integrating international talent
          creates a cycle of innovation and success.
        </p>

      </div>
    </section>
  );
}

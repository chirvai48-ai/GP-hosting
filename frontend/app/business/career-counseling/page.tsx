import BusinessHero from "@/components/business/BusinessHero";
import { NextBusinessCue } from "@/components/business/BusinessChrome";
import MagazineSection, {
  MagazineSectionData,
} from "@/components/business/MagazineSection";

const sections: MagazineSectionData[] = [
  {
    number: "01",
    label: 'Job-Hunting School "GP Naitei Academy"',
    headline: "A school for the offer letter.",
    body:
      "This program was launched during the COVID-19 pandemic when job opportunities sharply declined. It was driven by a strong desire to help talented individuals who were struggling simply because they did not know how to navigate the job-hunting process. As a result, the academy has helped participants secure job offers from more than 500 companies, contributing significantly to their career development. One of our key strengths is providing personalized guidance and support — including interview preparation and practical job-search strategies — enabling participants to conduct their job search with confidence and satisfaction. We teach effective methods for presenting their experiences and strengths to potential employers. Our nationally certified professional career consultants provide comprehensive support tailored to each job seeker.",
    image: "/meiter.jpg",
    quote: {
      text: "An offer letter is not the goal. The goal is to know why you accepted it.",
      attribution: "GP Naitei Academy philosophy",
    },
    bullets: [
      "500+ companies have extended offers to our participants",
      "1-on-1 mentorship with nationally certified career consultants",
      "Interview preparation, ES coaching, and self-presentation training",
      "Personalized strategies for each job seeker's strengths",
    ],
  },
  {
    number: "02",
    label: "Job Hunting Seminars",
    headline: "Brought directly into the classroom.",
    body:
      "We provide job-hunting know-how to universities, vocational schools, and Japanese language schools with large international student populations, helping improve overall employment rates for the institutions. We have also conducted job-hunting seminars for two consecutive years as part of a subsidized project sponsored by the Hokkaido government — including delivery in October 2025 and January 2026.",
    image: "/seminal.jpg",
    bullets: [
      "Universities, vocational schools, and Japanese language schools",
      "Specialized programs for international student populations",
      "Two consecutive years of Hokkaido government subsidized projects",
      "On-site delivery — October 2025 and January 2026",
    ],
  },
];

export default function CareerCounselingPage() {
  return (
    <main className="bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)]">
      <BusinessHero
        kicker="Business — 01 / 04"
        title="Job Search Support Services."
        intro="Led by our representative, Kaminaka, who holds Japan's national Career Consultant qualification, we provide job-hunting expertise and guidance to both individuals and educational institutions."
        image="/careercounseling.jpg"
      />

      <section className="border-t border-[color:var(--color-on-surface)]/10 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
          <p className="font-[var(--font-label)] text-[10px] tracking-[0.4em] uppercase text-[color:var(--color-on-surface-variant)] mb-4">
            What is a Career Consultant?
          </p>
          <p className="font-display text-lg md:text-xl leading-relaxed text-[color:var(--color-on-surface-variant)]">
            For more information about Japan&apos;s national Career Consultant qualification, please refer to the
            {" "}
            <a
              href="https://www.career-cc.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--color-primary)] underline underline-offset-4 decoration-[color:var(--color-secondary)] hover:decoration-[color:var(--color-primary)] transition-colors"
            >
              Japan Career Development Association
            </a>
            .
          </p>
        </div>
      </section>

      {sections.map((s, i) => (
        <MagazineSection key={s.number} data={s} index={i} />
      ))}
      <NextBusinessCue />
    </main>
  );
}

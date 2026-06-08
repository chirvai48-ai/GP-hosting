import BusinessHero from "@/components/business/BusinessHero";
import { NextBusinessCue } from "@/components/business/BusinessChrome";
import MagazineSection, {
  MagazineSectionData,
} from "@/components/business/MagazineSection";

const sections: MagazineSectionData[] = [
  {
    number: "01",
    label: "Glowing Partner Naitei Academy",
    headline: "A school for the offer letter — GPNA.",
    body:
      "Glowing Partner Naitei Academy (GPNA) is our flagship career preparation program. We walk students through self-analysis, industry research, ES writing, and interview practice — every step calibrated to the realities of the Japanese job-hunting calendar. Students leave with a clear narrative, a target list, and the confidence to defend their choices in a final interview.",
    image: "/meiter.jpg",
    quote: {
      text: "An offer letter is not the goal. The goal is to know why you accepted it.",
      attribution: "GPNA program philosophy",
    },
    bullets: [
      "1-on-1 mentorship with industry-experienced advisors",
      "Mock interviews recorded and reviewed line-by-line",
      "ES and resume workshops in Japanese and English",
    ],
  },
  {
    number: "02",
    label: "Seminar Business",
    headline: "Brought directly into the classroom.",
    body:
      "We run career seminars at high schools, vocational schools, and universities across the region. Sessions cover everything from how an interview is actually scored, to how to read a job posting, to what employers wish students knew before graduation. Photos from recent on-site seminars below — the conversations rarely end when the slides do.",
    image: "/seminal.jpg",
    spreadImage: "/schoolbusiness.jpg",
    bullets: [
      "On-site delivery at partner schools",
      "Curricula tailored per grade level and faculty",
      "Follow-up office hours for individual questions",
    ],
  },
  {
    number: "03",
    label: "Career Consulting",
    headline: "Ms. Uenaka, and a quiet office in Shiki.",
    body:
      "Our career consulting practice is led by Ms. Uenaka, a nationally certified career consultant with over a decade of experience guiding mid-career professionals, returners, and bilingual candidates. Sessions are held at our Shiki Satellite Office — a deliberately small space where confidentiality and unhurried conversation matter more than throughput.",
    image: "/CEO.jpg",
    quote: {
      text: "Career change is rarely about the next job. It is about deciding what the next ten years should feel like.",
      attribution: "Ms. Uenaka, Certified Career Consultant",
    },
    bullets: [
      "Certified career consultant (キャリアコンサルタント)",
      "Shiki Satellite Office — by appointment",
      "Mid-career, returners, and bilingual specialization",
    ],
  },
];

export default function CareerCounselingPage() {
  return (
    <main className="bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)]">
      <BusinessHero
        kicker="Business — 01 / 03"
        title="Career Counseling."
        intro="Three practices, one belief: the right work begins with the right question. From classroom seminars to one-on-one consulting, we build the conversations that lead to better careers."
        image="/careercounseling.jpg"
      />
      {sections.map((s, i) => (
        <MagazineSection key={s.number} data={s} index={i} />
      ))}
      <NextBusinessCue />
    </main>
  );
}

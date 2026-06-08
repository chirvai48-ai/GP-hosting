import BusinessHero from "@/components/business/BusinessHero";
import { NextBusinessCue } from "@/components/business/BusinessChrome";
import MagazineSection, {
  MagazineSectionData,
} from "@/components/business/MagazineSection";

const sections: MagazineSectionData[] = [
  {
    number: "01",
    label: "Part-time Placement",
    headline: "The right shift, the right person.",
    body:
      "Direct part-time placement, with the candidate hired by the employer — not dispatched through us. We handle sourcing, screening, and the first conversation; you handle the offer. Best for retail, food service, and hospitality roles where chemistry on the floor matters as much as the resume.",
    image: "/forjobseeker.jpg",
    bullets: [
      "Direct-hire part-time roles",
      "Pre-screened candidates only",
      "Replacement support during probation",
    ],
  },
  {
    number: "02",
    label: "Specified Skilled Worker (特定技能)",
    headline: "Specified Skilled Worker placements.",
    body:
      "We support employers hiring under the Specified Skilled Worker (SSW / 特定技能) visa framework. From candidate identification overseas, to skill assessment, to onboarding inside Japan — we coordinate the moving parts so the worker arrives ready, and the employer stays compliant.",
    image: "/jobseekers.jpg",
    quote: {
      text: "The visa is paperwork. The placement is people. We treat them differently.",
      attribution: "Placement team",
    },
    bullets: [
      "Coverage across designated SSW industry fields",
      "Coordination with registered support organizations",
      "Japanese-language readiness assessment",
    ],
  },
  {
    number: "03",
    label: "Technical Intern Training (技能実習)",
    headline: "Technical Intern Training, end to end.",
    body:
      "For employers participating in the Technical Intern Training Program, we work with accredited sending and supervising organizations to source and place interns whose training plan actually matches the work they will do. We stay involved past arrival, because the first six months are where most problems either surface or quietly fester.",
    image: "/Employe3.jpg",
    bullets: [
      "Partnerships with sending organizations in multiple countries",
      "Training-plan alignment with on-site supervisors",
      "Post-arrival check-ins for the first 12 months",
    ],
  },
  {
    number: "04",
    label: "Job Hunting & Career Change",
    headline: "For job hunters and career changers.",
    body:
      "Direct full-time placement for new graduates job hunting (就職) and mid-career professionals changing roles (転職). We do not flood inboxes with postings; we present a small number of roles that fit the candidate's actual trajectory, with honest notes on why.",
    image: "/Employe2.jpg",
    spreadImage: "/forrecruiter.jpg",
    bullets: [
      "新卒就職 — new graduate placement",
      "転職 — mid-career change",
      "Bilingual roles and cross-border searches",
    ],
  },
];

export default function PlacementPage() {
  return (
    <main className="bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)]">
      <BusinessHero
        kicker="Business — 03 / 03"
        title="Paid Employment Placement."
        intro="Direct-hire placement, done with care. Four practices — part-time, Specified Skilled Worker, Technical Intern Training, and full-time career placement — each with its own rhythm and rules."
        image="/jobseekers.jpg"
      />
      {sections.map((s, i) => (
        <MagazineSection key={s.number} data={s} index={i} />
      ))}
      <NextBusinessCue />
    </main>
  );
}

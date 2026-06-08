import DiagonalHero from "@/components/services/DiagonalHero";
import DiagonalPanel, {
  DiagonalPanelData,
} from "@/components/services/DiagonalPanel";
import DiagonalCTA from "@/components/services/DiagonalCTA";

const panels: DiagonalPanelData[] = [
  {
    number: "01",
    label: "Why Partner With Us",
    headline: "Recruitment, with fewer surprises.",
    body:
      "Hiring decisions are expensive and noisy. We sit between the posting and the offer letter and absorb the noise — screening, scheduling, cultural fit checks, language assessment — so the people who reach your interview room are the ones worth your time.",
    image: "/forrecruiter.jpg",
    bullets: [
      "Pre-screened, role-matched candidates only",
      "Bilingual sourcing across Japan and overseas",
      "Transparent reporting at every stage",
    ],
  },
  {
    number: "02",
    label: "Breadth of Talent",
    headline: "From cleaning crews to specified skilled workers.",
    body:
      "Whatever your headcount looks like — a shift of part-time cleaning staff, a full-time bilingual back-office hire, an SSW visa cohort, or a technical intern training program — we have the pipeline. One agency, one point of contact, end-to-end coverage.",
    image: "/recruiters.jpg",
    bullets: [
      "Part-time dispatch — cleaning specialty",
      "Full-time dispatch and direct placement",
      "Specified Skilled Worker (特定技能)",
      "Technical Intern Training (技能実習)",
    ],
  },
  {
    number: "03",
    label: "Compliance & Aftercare",
    headline: "We don't disappear after the offer letter.",
    body:
      "Recruitment is the easy part — retention is the work. We stay involved through onboarding, first-month check-ins, and the inevitable first issues. For visa-based hires, we coordinate with sending and supervising organizations so compliance never lands on your HR team unprepared.",
    image: "/Employe2.jpg",
    bullets: [
      "Post-placement check-ins for the first 12 months",
      "Replacement guarantees during probation",
      "Visa, contract, and labor-law support",
    ],
  },
];

export default function ForRecruiterPage() {
  return (
    <main className="bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)]">
      <DiagonalHero
        kicker="For Recruiters"
        title="Hiring partners, not job boards."
        intro="We work alongside HR teams across Japan to fill roles that matter — from a same-week cleaning shift to a long-horizon specialist hire."
        image="/forrecruiter.jpg"
      />
      {panels.map((p, i) => (
        <DiagonalPanel key={p.number} data={p} index={i} />
      ))}
      <DiagonalCTA
        kicker="Get in touch"
        headline="Tell us who you need to hire."
        body="A short message about the role, the headcount, and the timeline is enough to start. We will reply with a candidate plan — not a sales pitch."
        href="/contact/company"
        ctaLabel="Contact us — for companies"
        image="/company.jpg"
      />
    </main>
  );
}

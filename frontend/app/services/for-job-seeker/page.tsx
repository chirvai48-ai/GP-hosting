import DiagonalPanel, {
  DiagonalPanelData,
} from "@/components/services/DiagonalPanel";
import DiagonalCTA from "@/components/services/DiagonalCTA";

const panels: DiagonalPanelData[] = [
  {
    number: "01",
    label: "How We Help",
    headline: "Your next job, considered carefully.",
    body:
      "Most job-search advice is generic. Ours is not. We sit with each candidate, learn what the next ten years should feel like, and then introduce a small number of roles that fit — not a flood of postings. Less scrolling, more talking, better outcomes.",
    image: "/2panel01.jpg",
    bullets: [
      "1-on-1 consultations, not impersonal mailing lists",
      "Honest feedback on fit, not flattery",
      "Bilingual support in Japanese and English",
    ],
  },
  {
    number: "02",
    label: "Counseling & Preparation",
    headline: "GPNA, and one-on-one consulting.",
    body:
      "Through Glowing Partner Naitei Academy (GPNA) we run structured preparation programs for students entering the job market. For mid-career professionals and returners, our certified career consultant Ms. Uenaka offers private sessions at the Shiki Satellite Office — unhurried, confidential, and grounded in a decade of real placements.",
    image: "/Seminar2.jpg",
    bullets: [
      "GPNA — for new graduates and students",
      "Career consulting with Ms. Uenaka",
      "ES, interview, and mock-screening practice",
    ],
  },
  {
    number: "03",
    label: "Breadth of Opportunities",
    headline: "Part-time, full-time, and everything between.",
    body:
      "Whether you are looking for a part-time shift to bridge a month, a full-time career change, or a long-term path under the SSW or Technical Intern Training programs — we represent roles across the spectrum. One conversation will tell us which path actually fits.",
    image: "/2panel03.jpg",
    imagePosition: "100% center",
    bullets: [
      "Part-time direct placement",
      "Full-time and mid-career change (転職)",
      "Specified Skilled Worker visa roles",
      "Technical Intern Training placements",
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
        kicker="Get in touch"
        headline="Start a conversation about your next role."
        body="Send a short message — your background, what you are looking for, and a way to reach you. A counselor will reply personally, usually within two business days."
        href="/contact/customer"
        ctaLabel="Contact us — for candidates"
        image="/message.jpg"
      />
    </main>
  );
}

import BusinessHero from "@/components/business/BusinessHero";
import { NextBusinessCue } from "@/components/business/BusinessChrome";
import MagazineSection, {
  MagazineSectionData,
} from "@/components/business/MagazineSection";

const sections: MagazineSectionData[] = [
  {
    number: "01",
    label: "Success-Based Placement",
    headline: "Fees only when the hire is made.",
    body:
      "For companies seeking direct hires, we provide recruitment and placement services on a fully success-based fee model — meaning fees are charged only when a candidate is successfully hired. No retainers, no upfront commitments. The incentives stay aligned with the outcome our clients actually want: the right person, signed.",
    image: "/jobseekers.jpg",
    spreadImage: "/forrecruiter.jpg",
    quote: {
      text: "If the hire doesn't happen, we don't get paid. That's the deal — and it keeps us honest about who we present.",
      attribution: "Placement team",
    },
    bullets: [
      "Fully success-based fee model",
      "No upfront cost, no retainer",
      "Direct-hire placement for full-time roles",
      "Aligned incentives — paid only on successful hire",
    ],
  },
];

export default function PlacementPage() {
  return (
    <main className="bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)]">
      <BusinessHero
        kicker="Business — 03 / 04"
        title="Recruitment and Placement."
        intro="For companies seeking direct hires, we provide recruitment and placement services on a fully success-based fee model — fees are charged only when a candidate is successfully hired."
        image="/jobseekers.jpg"
      />
      {sections.map((s, i) => (
        <MagazineSection key={s.number} data={s} index={i} />
      ))}
      <NextBusinessCue />
    </main>
  );
}

import BusinessHero from "@/components/business/BusinessHero";
import { NextBusinessCue } from "@/components/business/BusinessChrome";
import MagazineSection, {
  MagazineSectionData,
} from "@/components/business/MagazineSection";

const sections: MagazineSectionData[] = [
  {
    number: "01",
    label: "Part-time — Cleaning Specialty",
    headline: "Cleaning work, taken seriously.",
    body:
      "Our part-time staffing practice has a particular strength: cleaning. Office buildings, commercial facilities, hotels, and post-construction sites — we dispatch trained, reliable cleaning staff at the scale clients need, when they need them. We treat cleaning as skilled labor, because it is: the difference between adequate and excellent is visible the moment a guest walks in.",
    image: "/forrecruiter.jpg",
    spreadImage: "/recruiters.jpg",
    quote: {
      text: "A clean space is the first thing people notice and the last thing they thank you for. We make sure both happen.",
      attribution: "Operations team",
    },
    bullets: [
      "Cleaning crews for offices, hotels, and commercial sites",
      "Same-week dispatch for short-notice requests",
      "Trained staff with on-site supervision available",
      "Daily, weekly, and one-off engagements",
    ],
  },
  {
    number: "02",
    label: "Full-time Dispatch",
    headline: "Full-time hands, on your team.",
    body:
      "When part-time isn't enough, we place full-time dispatched staff who integrate into your operations. From back-office roles to facility management to specialist positions, we screen for fit before we send anyone — because a placement that doesn't last serves nobody.",
    image: "/Employe2.jpg",
    bullets: [
      "Long-term dispatch with attentive HR support",
      "Bilingual candidates available across roles",
      "Replacement guarantees during onboarding period",
    ],
  },
];

export default function StaffingPage() {
  return (
    <main className="bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)]">
      <BusinessHero
        kicker="Business — 02 / 03"
        title="Temporary Staffing."
        intro="From a cleaning crew tomorrow morning to a full-time dispatched specialist, we match the right hands to the right shift — at the scale your operation actually runs."
        image="/recruiters.jpg"
      />
      {sections.map((s, i) => (
        <MagazineSection key={s.number} data={s} index={i} />
      ))}
      <NextBusinessCue />
    </main>
  );
}

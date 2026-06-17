import BusinessHero from "@/components/business/BusinessHero";
import { NextBusinessCue } from "@/components/business/BusinessChrome";
import MagazineSection, {
  MagazineSectionData,
} from "@/components/business/MagazineSection";

const sections: MagazineSectionData[] = [
  {
    number: "01",
    label: "Nepal — Direct Recruitment & Training",
    headline: "Talent sourced and trained at the source.",
    body:
      "Through our group company, World Partner Pvt. Ltd., we are able to recruit, train, and develop human resources directly in Nepal. Pre-arrival preparation — language, work readiness, cultural orientation — happens before candidates ever leave home, so they arrive ready to contribute, not ready to start learning.",
    image: "/forrecruiter.jpg",
    spreadImage: "/recruiters.jpg",
    quote: {
      text: "Preparation at the source is the difference between an arrival and a fresh start.",
      attribution: "World Partner Pvt. Ltd.",
    },
    bullets: [
      "Group-company recruitment and training in Nepal",
      "Pre-arrival language and cultural preparation",
      "Direct talent pipeline — no third-party brokers",
    ],
  },
  {
    number: "02",
    label: "Expert-Led Candidate Selection",
    headline: "Two perspectives, one careful selection.",
    body:
      "During the selection process, candidates receive guidance from Japanese professionals with experience evaluating more than 10,000 Nepalese candidates, and Nepalese professionals who have lived in Japan for over 12 years. These experts provide valuable insights and advice on candidate assessment and selection — bridging the two contexts that matter most for a successful placement.",
    image: "/meiter.jpg",
    bullets: [
      "Japanese evaluators with 10,000+ Nepalese candidates assessed",
      "Nepalese professionals with 12+ years of life in Japan",
      "Dual-perspective interviews and assessment",
    ],
  },
  {
    number: "03",
    label: "Post-Employment Support",
    headline: "The first year is where placements succeed or fail.",
    body:
      "Post-employment support services are managed by nationally certified career consultants, ensuring comprehensive assistance for both employers and foreign workers after hiring. As a Registered Support Organization, we handle the legally required support items — and stay engaged for everything beyond the checklist.",
    image: "/Employe2.jpg",
    bullets: [
      "Nationally certified career consultants on the support team",
      "Registered Support Organization for SSW workers",
      "Support for both employers and foreign workers",
      "Ongoing engagement past the legally required minimum",
    ],
  },
];

export default function SSWSupportPage() {
  return (
    <main className="bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)]">
      <BusinessHero
        kicker="Business — 04 / 04"
        title="Specified Skilled Worker Support."
        intro="As a Registered Support Organization, we recruit, train, and place Specified Skilled Workers — backed by direct operations in Nepal, dual-perspective candidate selection, and certified post-employment support."
        image="/forrecruiter.jpg"
      />
      {sections.map((s, i) => (
        <MagazineSection key={s.number} data={s} index={i} />
      ))}
      <NextBusinessCue />
    </main>
  );
}

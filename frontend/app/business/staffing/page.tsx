import BusinessHero from "@/components/business/BusinessHero";
import { NextBusinessCue } from "@/components/business/BusinessChrome";
import MagazineSection, {
  MagazineSectionData,
} from "@/components/business/MagazineSection";

const sections: MagazineSectionData[] = [
  {
    number: "01",
    label: "International Student Dispatch",
    headline: "Strong school ties, lower dispatch fees.",
    body:
      "By leveraging our strong relationships with educational institutions, we primarily recruit and dispatch international students. Because international students are generally exempt from certain social insurance costs, we can offer staffing services with lower dispatch fees — one of our key advantages. We primarily dispatch staff to building maintenance and cleaning companies for cleaning-related work.",
    image: "/forrecruiter.jpg",
    spreadImage: "/recruiters.jpg",
    quote: {
      text: "Strong school relationships are the quiet edge — they translate directly into lower fees for our clients.",
      attribution: "Staffing operations",
    },
    bullets: [
      "Primary focus: international students from partner institutions",
      "Lower dispatch fees via social insurance exemptions",
      "Building maintenance and cleaning specialization",
      "Same-week dispatch available for short-notice needs",
    ],
  },
  {
    number: "02",
    label: "Multilingual Support & Manuals",
    headline: "Communication that doesn't break on the shift floor.",
    body:
      "Beyond placement, we provide creation of work manuals in the native languages of dispatched foreign staff, plus interpretation support between client companies and foreign staff through a 365-day multilingual call center. The goal is simple: remove the language friction that turns a good hire into an avoidable problem.",
    image: "/Employe2.jpg",
    bullets: [
      "Native-language work manuals for dispatched staff",
      "365-day multilingual call center for client–staff communication",
      "Real-time interpretation support during operations",
    ],
  },
];

export default function StaffingPage() {
  return (
    <main className="bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)]">
      <BusinessHero
        kicker="Business — 02 / 04"
        title="Temporary Staffing Services."
        intro="By leveraging our strong relationships with educational institutions, we primarily recruit and dispatch international students — backed by native-language manuals and a 365-day multilingual call center."
        image="/recruiters.jpg"
      />
      {sections.map((s, i) => (
        <MagazineSection key={s.number} data={s} index={i} />
      ))}
      <NextBusinessCue />
    </main>
  );
}

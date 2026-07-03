import Hero from "@/components/business/Hero";
import Section from "@/components/business/Section";
import PhotoStrip from "@/components/business/PhotoStrip";
import ExternalLinkCard from "@/components/business/ExternalLinkCard";
import StatGraphic from "@/components/business/StatGraphic";
import CrossSell from "@/components/business/CrossSell";

export const metadata = {
  title: "Job Hunting Support Services | Glowing Partner",
  description:
    "Led by representative Kaminaka, nationally certified Career Consultant, we provide job-hunting know-how and career support to individuals and educational institutions.",
};

export default function CareerCounselingPage() {
  return (
    <>
      <Hero
        eyebrow="Business 01"
        title="Job Hunting Support Services"
        lede="Led by our representative, Kaminaka, who holds a national qualification as a Career Consultant, we provide job-hunting know-how and career support to both individuals and educational institutions."
        image="/Seminar3.jpg"
        imageAlt="Job Hunting Support Services"
      />

      <ExternalLinkCard
        eyebrow="National qualification"
        title="What is a Career Consultant?"
        description="Read the official explanation of the Career Consultant national qualification on the Japan Career Consulting Association website."
        href="https://www.career-cc.org/"
        linkLabel="Visit career-cc.org"
      />

      <Section
        eyebrow="For individuals"
        heading="GP Job Offer Academy"
        body="This program was launched during the COVID-19 pandemic when job opportunities drastically decreased. It was driven by a strong desire to support talented individuals who were struggling simply because they did not know how to approach job hunting effectively. As a result, our academy has helped participants secure job offers from more than 500 companies, contributing significantly to their career development."
        image="/Seminar1.jpg"
        image2="/Seminar2.jpg"
        imageAlt="GP Job Offer Academy"
      >
        <p className="text-base md:text-lg leading-relaxed text-[color:var(--color-on-surface-variant)] font-[var(--font-label)]">
          One of our key strengths is our personalized guidance and ongoing support, enabling individuals to conduct a job search they can feel confident and satisfied with. We provide practical know-how on how to effectively present their experiences and strengths to potential employers, including interview preparation and other essential job-hunting skills. Our nationally certified professional Career Consultants provide comprehensive support tailored to each job seeker.
        </p>
      </Section>

      <StatGraphic
        stats={[
          { value: "500+", label: "Companies", sub: "have extended offers to academy participants." },
          { value: "1:1", label: "Mentorship", sub: "with nationally certified Career Consultants." },
          { value: "2 yrs", label: "Hokkaido Program", sub: "of consecutive subsidized seminar delivery." },
        ]}
      />

      <Section
        eyebrow="For educational institutions"
        heading="Job Hunting Seminars"
        body="By providing job-hunting expertise to universities, vocational schools, and Japanese language schools with large international student populations, we help improve overall employment rates for educational institutions. We have successfully conducted job-hunting seminars for two consecutive years as part of a Hokkaido government subsidy program."
        image="/Seminar4.jpg"
        imageAlt="Job hunting seminar"
        reverse
      />

      <PhotoStrip
        eyebrow="Hokkaido Subsidy Program"
        heading="Achievements in Hokkaido Government Subsidized Programs."
        photos={[
          { src: "/Seminar1.jpg", caption: "Academy mentorship" },
          { src: "/Seminar2.jpg", caption: "Group workshop" },
          { src: "/Seminar3.jpg", caption: "Career consultation" },
          { src: "/Seminar4.jpg", caption: "Institution seminar" },
          { src: "/Seminar5.jpg", caption: "October 2025" },
        ]}
      />

      <CrossSell />
    </>
  );
}

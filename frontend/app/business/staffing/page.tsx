import Hero from "@/components/business/Hero";
import Section from "@/components/business/Section";
import FeatureGrid from "@/components/business/FeatureGrid";
import StatGraphic from "@/components/business/StatGraphic";
import CrossSell from "@/components/business/CrossSell";

export const metadata = {
  title: "Temporary Staffing Services | Glowing Partner",
  description:
    "Leveraging strong relationships with educational institutions, we recruit and dispatch international students with reduced staffing fees and 365-day language support.",
};

function IconGlobe() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="22" cy="22" r="16" />
      <path d="M6 22h32M22 6c4 5 6 10 6 16s-2 11-6 16c-4-5-6-10-6-16s2-11 6-16Z" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M8 8h12a6 6 0 0 1 6 6v22a4 4 0 0 0-4-4H8V8Z" />
      <path d="M36 8H24a6 6 0 0 0-6 6v22a4 4 0 0 1 4-4h14V8Z" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="14" y="4" width="16" height="36" rx="2" />
      <path d="M20 34h4" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M8 38V12l14-6 14 6v26" />
      <path d="M8 38h28M16 18h4M24 18h4M16 26h4M24 26h4M20 38v-6h4v6" />
    </svg>
  );
}

export default function StaffingPage() {
  return (
    <>
      <Hero
        eyebrow="Business 02"
        title="Temporary Staffing Services"
        lede="Leveraging our strong relationships with educational institutions, we primarily recruit and dispatch international students — pairing client companies with motivated, capable staff while keeping dispatch fees competitive."
        image="/Business2.jpeg"
        imageAlt="Temporary Staffing Services"
      />

      <Section
        eyebrow="Our advantage"
        heading="Strong school ties, lower dispatch fees."
        body="One of our unique advantages is that employing international students — who are exempt from certain social insurance costs — enables us to offer staffing services with reduced dispatch fees. Our staffing services are mainly provided to building cleaning and maintenance companies for cleaning-related operations."
      />

      <StatGraphic
        eyebrow="By the numbers"
        heading="A staffing model built around international student talent."
        stats={[
          { value: "365", label: "Day call center", sub: "Interpretation & communication support, every day of the year." },
          { value: "0", label: "Social insurance overhead", sub: "International students are exempt — savings passed to clients." },
          { value: "1°", label: "Direct school pipeline", sub: "Sourced through strong long-term institutional partnerships." },
        ]}
      />

      <FeatureGrid
        eyebrow="Support services"
        heading="Built to support both clients and dispatched staff."
        features={[
          {
            icon: <IconBook />,
            title: "Native-language work manuals",
            body: "Operating manuals are prepared in the native languages of our international staff so on-site work starts clearly and safely.",
          },
          {
            icon: <IconPhone />,
            title: "365-day call center",
            body: "Year-round interpretation and communication support connecting client companies with foreign employees whenever needed.",
          },
          {
            icon: <IconBuilding />,
            title: "Cleaning & maintenance focus",
            body: "Staffing is primarily provided to building cleaning and maintenance companies for cleaning-related operations.",
          },
          {
            icon: <IconGlobe />,
            title: "Institution-sourced talent",
            body: "Long-standing relationships with universities, vocational schools, and Japanese language schools feed a steady talent pipeline.",
          },
        ]}
      />

      <CrossSell />
    </>
  );
}

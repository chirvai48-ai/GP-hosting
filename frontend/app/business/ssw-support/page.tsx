import Hero from "@/components/business/Hero";
import Section from "@/components/business/Section";
import FeatureGrid from "@/components/business/FeatureGrid";
import StatGraphic from "@/components/business/StatGraphic";
import CrossSell from "@/components/business/CrossSell";

export const metadata = {
  title: "Support Services for Specified Skilled Workers | Glowing Partner",
  description:
    "As a Registered Support Organization, we recruit and develop Specified Skilled Worker candidates through our Nepal group company and provide post-employment career support.",
};

function IconFlag() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M10 4v36" />
      <path d="M10 6h22l-4 6 4 6H10" />
    </svg>
  );
}

function IconBridge() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 30c6 0 6-10 18-10s12 10 18 10" />
      <path d="M4 36h36M12 30v6M20 26v10M28 26v10M36 30v6" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M22 4l14 4v14c0 10-8 16-14 18-6-2-14-8-14-18V8l14-4Z" />
      <path d="M16 22l4 4 8-8" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="15" cy="16" r="5" />
      <circle cx="29" cy="16" r="5" />
      <path d="M5 34c0-5 4-9 10-9s10 4 10 9M22 34c0-5 4-9 10-9s7 4 7 9" />
    </svg>
  );
}

export default function SswSupportPage() {
  return (
    <>
      <Hero
        eyebrow="Business 04"
        title="Support Services for Specified Skilled Workers"
        lede="As a Registered Support Organization, we recruit and develop human resources directly in Nepal through our group company, World Partner Pvt. Ltd., and provide ongoing support after employment in Japan."
      />

      <Section
        eyebrow="Our Nepal pipeline"
        heading="Recruited and developed directly at the source."
        body="Through our group company in Nepal, World Partner Pvt. Ltd., we are able to recruit and develop human resources directly in Nepal — building a pipeline of candidates who are prepared for life and work in Japan before they ever board the plane."
      />

      <StatGraphic
        eyebrow="Dual-panel evaluation"
        heading="Candidates assessed by experts on both sides."
        stats={[
          { value: "10,000+", label: "Nepali candidates", sub: "Collectively assessed by our Japanese professional panel." },
          { value: "12+ yrs", label: "In Japan", sub: "Nepali professionals on our team with deep cross-cultural knowledge." },
          { value: "2", label: "Cultures, one team", sub: "Japanese rigor and Nepali insight in every selection decision." },
        ]}
      />

      <FeatureGrid
        eyebrow="What you get"
        heading="End-to-end Specified Skilled Worker support."
        features={[
          {
            icon: <IconFlag />,
            title: "Source in Nepal",
            body: "Direct recruitment through our group company, World Partner Pvt. Ltd., based in Nepal.",
          },
          {
            icon: <IconUsers />,
            title: "Dual-panel selection",
            body: "Candidates evaluated by Japanese professionals and Nepali specialists who have lived in Japan for over 12 years.",
          },
          {
            icon: <IconBridge />,
            title: "Cross-cultural readiness",
            body: "Candidates are prepared for Japanese workplace culture before placement, reducing onboarding friction.",
          },
          {
            icon: <IconShield />,
            title: "Post-employment support",
            body: "Ongoing assistance from nationally certified Career Consultants ensures successful integration after hiring.",
          },
        ]}
      />

      <CrossSell />
    </>
  );
}

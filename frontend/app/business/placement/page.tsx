import Hero from "@/components/business/Hero";
import Section from "@/components/business/Section";
import FeatureGrid from "@/components/business/FeatureGrid";
import StatGraphic from "@/components/business/StatGraphic";
import CrossSell from "@/components/business/CrossSell";

export const metadata = {
  title: "Recruitment & Placement Services | Glowing Partner",
  description:
    "For companies seeking direct-hire employees, we provide recruitment and placement services on a fully success-fee basis — fees are charged only upon successful placement.",
};

function IconHandshake() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 24l8-8 6 4 6-4 8 8" />
      <path d="M4 24l6 6 6-2 4 4 6-2 6-6" />
    </svg>
  );
}

function IconCoin() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="22" cy="22" r="14" />
      <path d="M22 14v16M18 18h6a3 3 0 1 1 0 6h-4a3 3 0 1 0 0 6h6" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="22" cy="22" r="16" />
      <circle cx="22" cy="22" r="10" />
      <circle cx="22" cy="22" r="4" />
    </svg>
  );
}

export default function PlacementPage() {
  return (
    <>
      <Hero
        eyebrow="Business 03"
        title="Recruitment and Placement Services"
        lede="For companies seeking direct-hire employees, we provide recruitment and placement services on a fully success-fee basis — meaning fees are charged only upon successful placement."
      />

      <StatGraphic
        eyebrow="How it works"
        heading="A success-fee model, with no upfront cost."
        stats={[
          { value: "0", label: "Upfront fee", sub: "No engagement charge before a successful placement is made." },
          { value: "100%", label: "Success-based", sub: "Fees are paid only when a candidate is successfully hired." },
          { value: "1", label: "Goal", sub: "The right direct-hire match for your team — nothing else." },
        ]}
      />

      <Section
        eyebrow="Direct-hire focus"
        heading="Built for companies hiring for the long term."
        body="Our placement service is designed for companies seeking direct-hire employees who will join your team on your own terms — not as dispatched staff. Because we are compensated only on successful placement, our incentives are fully aligned with finding the right person, not filling the role at any cost."
      />

      <FeatureGrid
        features={[
          {
            icon: <IconHandshake />,
            title: "Aligned incentives",
            body: "We earn only when you successfully hire — so we recommend candidates who actually fit, not just any available profile.",
          },
          {
            icon: <IconCoin />,
            title: "No risk to start",
            body: "There is no engagement fee. You only pay once a candidate accepts and joins your company on a direct-hire basis.",
          },
          {
            icon: <IconTarget />,
            title: "Targeted shortlists",
            body: "Drawing on our recruitment pipelines, we present focused shortlists rather than overwhelming you with profiles.",
          },
        ]}
      />

      <CrossSell />
    </>
  );
}

import IntroSection from "@/components/about/IntroSection";
import Timeline from "@/components/about/Timeline";
import LeadershipSection from "@/components/about/LeadershipSection";
import TeamSection from "@/components/about/TeamSection";
import CorporateInfo from "@/components/about/CorporateInfo";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[color:var(--color-surface)] pt-20">
      <IntroSection />
      <Timeline />
      <TeamSection />
      <LeadershipSection />
      <CorporateInfo />
    </main>
  );
}

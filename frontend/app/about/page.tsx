import IntroSection from "@/components/about/IntroSection";
import Timeline from "@/components/about/Timeline";
import LeadershipSection from "@/components/about/LeadershipSection";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[color:var(--color-surface)] pt-20">
      <IntroSection />
      <Timeline />
      <LeadershipSection />
    </main>
  );
}

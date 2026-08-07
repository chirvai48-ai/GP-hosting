import HeroSection from '../components/HeroSection'
import Navbar from '@/components/Navbar';
import PhilosophyPage from '@/components/Philosophy';
import PartnerRibbon from '@/components/Swiper';
import { Infopoint } from '@/components/InfoPoint';
import EmployeeSection from '@/components/Employee';
import NewsSection from '@/components/news/News';
import FAQ from '@/components/FAQ';
export default function Home() {
  return (
    <div>
      <HeroSection />
      <PartnerRibbon />
      <PhilosophyPage />
      <Infopoint />
      <EmployeeSection />
      <NewsSection />
      {/* <FAQ /> */}
    </div>
  );
}

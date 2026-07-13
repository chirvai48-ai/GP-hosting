import ThreeDCarousel, { ThreeDCarouselItem } from "./lightswind/3d-carousel";

const items: ThreeDCarouselItem[] = [
  {
    id: 1,
    title: "Founder & CEO",
    brand: "Uenaka Go",
    description:
      "Since founding the company in August 2018, Uenaka has built Glowing Partner on a unique philosophy — every employee is a foreign national — and a commitment to practicing what we recommend.",
    tags: ["Leadership", "Strategy", "Foreign Workforce", "Founder"],
    imageUrl: "/UenkaGO.jpg",
    link: "/about#uenaka",
    isFeatured: true,
  },
  {
    id: 2,
    title: "",
    brand: "Narayan Pokhrel",
    description:
      "Twelve years in Japan shape Narayan's role as the bridge between Japanese companies and foreign employees, championing 100% mutual understanding through two-way communication.",
    tags: ["Bridge Partner", "Japan-Nepal", "Communication", "Advisor"],
    imageUrl: "/Narayan.jpeg",
    link: "/about#narayan",
  },
  {
    id: 3,
    title: "",
    brand: "Arun Gurung",
    description:
      "Arun supports the full employment journey — from recruiting foreign talent to labor management, training, and long-term follow-up for client companies.",
    tags: ["Recruitment", "Labor Management", "Training", "Follow-up"],
    imageUrl: "/Arun.jpeg",
    link: "/about#arun",
  },
  {
    id: 4,
    title: "",
    brand: "Sanyukta Amatya",
    description:
      "Sanyukta partners with each candidate to understand their aspirations and connect them with workplaces where they can grow with confidence and peace of mind.",
    tags: ["Career Support", "Candidate Care", "Mentorship"],
    imageUrl: "/Amatya.jpeg",
    link: "/about#sanyukta",
  },
  {
    id: 5,
    title: "",
    brand: "Norin Shrestha",
    description:
      "Guided by teamwork, respect, and continuous learning, Norin offers kind, attentive, and reliable support to colleagues and clients alike.",
    tags: ["Client Support", "Teamwork", "Reliability"],
    imageUrl: "/Norin.jpeg",
    link: "/about#norin",
  },
  {
    id: 6,
    title: "",
    brand: "Nirajan Pokhrel",
    description:
      "Nirajan builds trusting relationships with client companies and staff, approaching every consultation with sincerity and full responsibility.",
    tags: ["Account Management", "Staff Relations", "Trust"],
    imageUrl: "/Nirajan.jpeg",
    link: "/about#nirajan",
  },
];

function EmployeeSection() {
  return (
    <div className="flex flex-col p-10 h-auto">
      <h2 className="flex items-center justify-center pt-12 text-4xl font-headline text-primary">
        Our team
      </h2>
      <div className="w-32 h-0.5 mx-auto mb-2 bg-secondary mb-12" />
      <ThreeDCarousel
        items={items}
        autoRotate={true}
        rotateInterval={3500}
        cardHeight={500}
      />
    </div>
  );
}

export default EmployeeSection;

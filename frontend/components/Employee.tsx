import ThreeDCarousel, { ThreeDCarouselItem } from "./lightswind/3d-carousel";

const items: ThreeDCarouselItem[] = [
  {
    id: 1,
    title: "CEO",
    brand: "Jeewan Pokhrel",
    description:
      "Manages end-to-end recruitment of skilled and unskilled workers for international placements.",
    tags: ["Talent Acquisition", "Screening", "Hiring", "Compliance"],
    imageUrl: "/CEO.jpg",
    link: "/employees/recruitment-specialist",
  },
  {
    id: 2,
    title: "Visa & Documentation Officer",
    brand: "Isan Adhikari",
    description:
      "Handles visa processing, work permits, and ensures all overseas documentation requirements are met.",
    tags: ["Visa Processing", "Immigration", "Documentation", "Legal Compliance"],
    imageUrl: "/Employe2.jpg",
    link: "/employees/visa-officer",
  },
  {
    id: 3,
    title: "Overseas Recruitment Specialist",
    brand: "Chirag Kuinkel",
    description:
      "Coordinates travel, onboarding, and deployment of workers to international job sites.",
    tags: ["Logistics", "Travel Coordination", "Onboarding", "Operations"],
    imageUrl: "/Employe3.jpg",
    link: "/employees/deployment-coordinator",
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
        rotateInterval={3000}
        cardHeight={500}
      />
      </div>
    
  );
}

export default EmployeeSection;

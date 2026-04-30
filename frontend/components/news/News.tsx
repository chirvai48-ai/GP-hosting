import StackList from "../lightswind/stack-list";
import Image from "next/image";

const news = [
  {
    icon: (
      <Image
        src="/News1.jpg"
        alt="Product Launch"
        width={200}
        height={200}
        className="rounded-md object-cover"
      />
    ),
    title: "New Product Launch",
    subtitle: "Version 2.0 Released and will be available to public soon",
    date: "12 April",
  },
  {
    icon: (
      <Image
        src="/News2.jpg"
        alt="Partnership"
        width={40}
        height={40}
        className="rounded-md object-cover"
      />
    ),
    title: "Strategic Partnership",
    subtitle: "Collaboration with TechCorp is set to begin this April",
    date: "8 April",
  },
  {
    icon: (
      <Image
        src="/News3.jpg"
        alt="Award"
        width={40}
        height={40}
        className="rounded-md object-cover"
      />
    ),
    title: "Industry Recognition",
    subtitle: "Best Startup Award 2026 goes to Glowing partner",
    date: "2 April",
  },
  {
    icon: (
      <Image
        src="/News3.jpg"
        alt="Award"
        width={40}
        height={40}
        className="rounded-md object-cover"
      />
    ),
    title: "Industry Recognition",
    subtitle: "Best Startup Award 2026",
    date: "2 April",
  },
  {
    icon: (
      <Image
        src="/News3.jpg"
        alt="Award"
        width={40}
        height={40}
        className="rounded-md object-cover"
      />
    ),
    title: "Industry Recognition",
    subtitle: "Best Startup Award 2026",
    date: "2 April",
  },
];
function NewsSection() {
  return (
    <div className="flex flex-col  min-h-screen w-auto justify-center items-center bg-[#f2f4f3]">
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight mb-2 font-headline text-primary mt-2"
        >
            Top News
        </h1>
        <div className="w-36 h-0.5 mx-auto mb-2 bg-secondary mb-4" />
      <StackList
        items={news}
        initialVisible={3}
        className="w-full sm:max-w-md md:max-w-xl p-4"
      />
      
    </div>
  );
}

export default NewsSection;

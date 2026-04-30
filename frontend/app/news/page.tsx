import StackList from "@/components/lightswind/stack-list";
import Image from "next/image";
import { Paper,Container } from "@mui/material";
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

function News() {
  return (
    <Container className="p-12">
    <div className="flex flex-row">
      <div className="flex-1">Main News will be displayed here fully</div>
      <Paper className="max-h-[400px] overflow-auto">
        <StackList
          items={news}
          initialVisible={3}
          className="w-full sm:max-w-md md:max-w-xl p-4"
        />
      </Paper>
    </div>
    </Container>
  );
}

export default News;

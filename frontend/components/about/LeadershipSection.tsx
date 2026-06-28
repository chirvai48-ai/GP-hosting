import React from "react";
import Image from "next/image";

interface Leader {
  id: number;
  name: string;
  title: string;
  imageUrl: string;
  logo: string;
  href?: string;
}

const leaders: Leader[] = [
  {
    id: 1,
    name: "Narayan Pokhrel",
    title: "CEO, World Partner",
    href: "https://world-partner.com.np",
    imageUrl: "/Narayan.jpeg",
    logo: "/logogreen.jpeg",
  },
  {
    id: 2,
    name: "Go Uenaka",
    title: "CEO, Glowing Partner",
    imageUrl: "/UenkaGO.jpg",
    logo: "/GpLogoTransparent.png",
  },
];

const LeadershipSection: React.FC = () => {
  return (
    <section className="w-full bg-[color:var(--color-surface)] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-label text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--color-secondary)] mb-4">
            The People Behind the Mission
          </p>
          <h2 className="font-headline text-4xl md:text-5xl font-light italic text-[color:var(--color-primary)]">
            Leadership
          </h2>
          <div className="w-16 h-0.5 bg-[color:var(--color-secondary)] mx-auto mt-5" />
        </div>

        {/* Card */}
        <div className="bg-white border border-[rgba(20,86,82,0.08)] shadow-sm overflow-hidden">
          {/* Top accent — primary → secondary */}
          <div
            className="h-1"
            style={{ background: "linear-gradient(to right, #145652, #c9a84c)" }}
          />

          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Map */}
            <div className="mb-12">
              <div className="max-w-5xl mx-auto">
                <div className="relative overflow-hidden border border-[rgba(20,86,82,0.15)] shadow-md h-48 sm:h-56 md:h-[344px]">
                  <Image
                    src="/Map1.png"
                    alt="Bridge between Nepal and Japan"
                    fill
                    className="object-contain sm:object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-[color:var(--color-primary)]/5 pointer-events-none" />
                </div>
                <p className="font-label text-center text-[10px] tracking-[0.25em] uppercase text-[color:var(--color-on-surface-variant)] mt-4">
                  Bridging Nepal &amp; Japan
                </p>
              </div>
            </div>

            {/* Leaders grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
              {leaders.map((leader) => (
                <div key={leader.id} className="flex flex-col items-center">
                  {/* Profile image */}
                  <div className="relative mb-8">
                    <div className="relative">
                      <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-[color:var(--color-secondary)]/30">
                        <Image
                          src={leader.imageUrl}
                          alt={leader.name}
                          fill
                          sizes="176px"
                          className="object-cover object-top"
                        />
                      </div>
                      {/* Logo badge */}
                      <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden bg-white">
                        <Image
                          src={leader.logo}
                          alt={`${leader.name} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full text-center max-w-lg mx-auto">
                    <div className="mb-6">
                      <h3 className="font-headline text-3xl md:text-4xl font-light text-[color:var(--color-on-surface)] mb-1">
                        {leader.name}
                      </h3>
                      <p className="font-label text-sm tracking-wide text-[color:var(--color-primary)] font-medium">
                        {leader.title}
                        {leader.href && (
                          <a
                            href={leader.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-[color:var(--color-secondary)] underline underline-offset-2 hover:opacity-80 transition-opacity"
                          >
                            ↪ Visit
                          </a>
                        )}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;

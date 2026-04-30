"use client";

type Partner = {
  name: string;
  logo: string; // path or URL to logo image
};

// Replace these with your actual partner logos
const partners: Partner[] = [
  { name: "Google",     logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft",  logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Amazon",     logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Meta",       logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
  { name: "Apple",      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "IBM",        logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
  { name: "Samsung",    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
  { name: "Oracle",     logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
];

export default function PartnerRibbon() {
  // Duplicate list to create seamless infinite loop
  const doubled = [...partners, ...partners];

  return (
    <div className="w-full py-2 overflow-hidden relative">

      {/* Fade edges */}
      <div className="absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      {/* Ribbon track */}
      <div className="flex animate-marquee hover:[animation-play-state:paused] w-max">
        {doubled.map((partner, i) => (
          <div
            key={`${partner.name}-${i}`}
            className="flex flex-col items-center justify-center mx-10 group"
          >
            {/* Logo card */}
            <div className="w-36 h-16 flex items-center justify-center px-4 py-2 border border-gray-100 bg-white shadow-sm group-hover:shadow-md group-hover:border-gray-300 transition-all duration-300">
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-10 max-w-full w-auto object-contain opacity-100 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

type Partner = {
  name: string;
  logo: string;
};

const pictureFiles: Record<number, string> = {
  1: "png", 2: "png", 4: "png", 5: "jpg", 6: "png", 7: "png", 8: "png", 9: "png",
  10: "jpg", 11: "png", 12: "gif", 13: "jpg", 14: "png", 15: "png", 16: "png",
  17: "gif", 18: "png", 19: "png", 20: "png", 21: "png", 22: "png", 23: "jpg",
  24: "png", 25: "png", 26: "jpg", 27: "gif", 28: "png", 29: "png", 30: "jpg",
  31: "png", 32: "jpg", 33: "jpg", 34: "gif", 35: "jpg", 36: "jpg", 37: "jpg",
  38: "png", 39: "jpg", 40: "png", 41: "jpg", 42: "jpg", 43: "jpg", 44: "png",
  45: "png", 46: "png", 47: "png", 48: "png", 49: "png", 50: "png", 51: "gif",
  52: "png",
};

const partners: Partner[] = Object.entries(pictureFiles).map(([n, ext]) => ({
  name: `Partner ${n}`,
  logo: `/swiper/Picture${n}.${ext}`,
}));

export default function PartnerRibbon() {
  const doubled = [...partners, ...partners];

  return (
    <div className="w-full py-2 overflow-hidden relative">
      <div className="absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      <div
        className="flex animate-marquee hover:[animation-play-state:paused] w-max"
        style={{ willChange: "transform" }}
      >
        {doubled.map((partner, i) => (
          <div
            key={`${partner.name}-${i}`}
            className="flex flex-col items-center justify-center mx-10 group"
          >
            <div className="w-36 h-16 flex items-center justify-center px-4 py-2 border border-gray-100 bg-white shadow-sm group-hover:shadow-md group-hover:border-gray-300 transition-all duration-300">
              <img
                src={partner.logo}
                alt={partner.name}
                width={144}
                height={40}
                loading={i < 8 ? "eager" : "lazy"}
                decoding="async"
                className="max-h-10 max-w-full w-auto object-contain opacity-100 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

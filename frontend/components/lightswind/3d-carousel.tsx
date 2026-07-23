// components/ThreeDCarousel.tsx
"use client";

import React, {
  useRef,
  useEffect,
  useState,
  TouchEvent,
} from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import {Card,CardContent} from "./card"
import Link from "next/link";


export interface ThreeDCarouselItem {
  id: number;
  title: string;
  brand: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
  isFeatured?: boolean;
}

interface ThreeDCarouselProps {
  items: ThreeDCarouselItem[];
  autoRotate?: boolean;
  rotateInterval?: number;
  cardHeight?: number;
  title?: string;
  subtitle?: string;
  tagline?: string;
  isMobileSwipe?: boolean;
}

const ThreeDCarousel = ({
  items,
  autoRotate = true,
  rotateInterval = 3000,
  cardHeight = 500,
  title = "From Textile to Intelligence",
  subtitle = "Customer Cases",
  tagline = "Explore how our textile sensor technology is revolutionizing multiple industries with intelligent fabric solutions tailored to specific needs.",
  isMobileSwipe = true,
}: ThreeDCarouselProps) => {
  const [active, setActive] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    if (autoRotate && isInView && !isHovering) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if(!carouselRef.current)
      return
    observer.observe(carouselRef.current);
    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  const getCardAnimationClass = (index: number) => {
    if (index === active) return "scale-100 opacity-100 z-20";
    if (index === (active + 1) % items.length)
      return "translate-x-[40%] scale-95 opacity-60 z-10";
    if (index === (active - 1 + items.length) % items.length)
      return "translate-x-[-40%] scale-95 opacity-60 z-10";
    return "scale-90 opacity-0";
  };

  return (
    <section
      id="ThreeDCarousel"
      className="bg-transparent min-w-full mx-auto 
    flex items-center justify-center"
    >
      <div
        className="w-full px-4 sm:px-6 lg:px-8 
      min-w-[350px] md:min-w-[950px] max-w-7xl  "
      >
        <div
          className="relative overflow-hidden h-[700px] "
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          ref={carouselRef}
        >
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center ">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`absolute top-0 w-full max-w-md transform transition-all duration-500 ${getCardAnimationClass(
                  index
                )}`}
              >
                <Card
                  className={`overflow-hidden bg-background h-[${cardHeight}px] flex flex-col transition-shadow ${
                    item.isFeatured
                      ? "border-2 border-secondary shadow-[0_8px_30px_-8px_rgba(201,168,76,0.45)] hover:shadow-[0_12px_36px_-8px_rgba(201,168,76,0.55)]"
                      : "border shadow-sm hover:shadow-md"
                  }`}
                >
                  <div
                    className="relative bg-black flex items-end justify-center h-[460px] overflow-hidden"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "top center",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    {item.isFeatured && (
                      <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-primary border border-secondary/60 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        Chief Executive
                      </span>
                    )}
                    <div className="relative z-10 text-center text-white pb-6 px-4 w-full">
                      <h3 className="text-2xl font-bold mb-2 font-headline">
                        {item.brand.toUpperCase()}
                      </h3>
                      <div className="w-16 h-0.5 mx-auto mb-2 bg-secondary" />
                      <p className="text-xs font-label tracking-[0.2em] uppercase opacity-90">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col flex-grow">
                    <p className="text-gray-600 text-sm flex-grow font-headline">
                      {item.description}
                    </p>

                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs animate-pulse-slow font-headline"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={item.link}
                        className="text-gray-500 flex items-center hover:underline relative group"
                        onClick={() => {
                          if (item.link.startsWith("/")) {
                            window.scrollTo(0, 0);
                          }
                        }}
                      >
                        <span className="relative z-10 font-label text-secondary">Learn more</span>
                        <ArrowRight className="ml-2 w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1 text-secondary" />
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          
            <>
              <button
                className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white z-30 shadow-md transition-all hover:scale-110"
                onClick={() =>
                  setActive((prev) => (prev - 1 + items.length) % items.length)
                }
                aria-label="前へ"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white z-30 shadow-md transition-all hover:scale-110"
                onClick={() => setActive((prev) => (prev + 1) % items.length)}
                aria-label="次へ"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          

          <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center space-x-3 z-30">
            {items.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  active === idx
                    ? "bg-gray-500 w-5"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setActive(idx)}
                aria-label={`Go to item ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeDCarousel;

"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Play only after metadata is ready to avoid layout shift
    const handleCanPlay = () => {
      setVideoLoaded(true);
      video.play().catch(() => {});
    };
    if (video.readyState >= 3) {
      handleCanPlay();
      return;
    }
    video.addEventListener("loadeddata", handleCanPlay);
    return () => video.removeEventListener("loadeddata", handleCanPlay);
  }, []);

  return (
    <section
      id="scrollArea"
      className="relative mt-14 md:mt-16 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] min-h-[600px] w-full overflow-hidden flex items-center justify-center"
    >
      {/* ── Poster / blur-up placeholder ── */}
      {/* Replace the src below with a low-res JPEG exported from your video's first frame */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          videoLoaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: "url('/hero-poster.jpg')",
          backgroundColor: "#145652", // brand teal fallback if poster is missing
        }}
        aria-hidden="true"
      />

      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        poster="/hero-poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        {/* WebM first — browsers pick the first format they support */}
        <source src="/Hero-video.webm" type="video/webm" />
        <source src="/Hero-video.mp4" type="video/mp4" />
      </video>

      {/* ── Dark teal overlay for legibility ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,86,82,0.78) 0%, rgba(20,86,82,0.55) 50%, rgba(0,0,0,0.45) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Gold grain texture overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* ── Decorative vertical rule (left) ── */}
      <div
        className="absolute left-10 top-0 h-full w-px hidden lg:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #C9A84C55, transparent)",
        }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 px-6 text-center max-w-5xl mx-auto">
        {/* Eyebrow label */}
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="h-px w-10" style={{ background: "#C9A84C" }} />
          <span
            className="text-xs tracking-[0.35em] uppercase font-medium"
            style={{
              color: "#C9A84C",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontVariantNumeric: "lining-nums",
            }}
          >
            東京設立 · 1987年
          </span>
          <span className="h-px w-10" style={{ background: "#C9A84C" }} />
        </div>

        {/* Main headline */}
        <h1
          className="text-[8vw] sm:text-7xl lg:text-8xl font-light leading-[1.05] tracking-tight mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "#F0EBE1",
            textShadow: "0 2px 40px rgba(20,86,82,0.6)",
          }}
        >
          <span className="block whitespace-nowrap">「違うから良い」</span>
          <em
            className="not-italic block whitespace-nowrap"
            style={{
              color: "#C9A84C",
              fontStyle: "italic",
            }}
          >
            と思える
          </em>
          <span className="block whitespace-nowrap">社会へ</span>
        </h1>

        {/* Sub-copy 
        <p
          className="mx-auto max-w-xl text-base sm:text-lg leading-relaxed mb-12 font-light"
          style={{
            fontFamily: "'Jost', sans-serif",
            color: "rgba(240,235,225,0.78)",
            letterSpacing: "0.02em",
          }}
        >
          Your success starts with the right people
        </p>
        */}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/vacancy"
            className="group relative inline-flex items-center gap-3 px-10 py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 overflow-hidden"
            style={{
              background: "#C9A84C",
              color: "#145652",
              fontFamily: "'Jost', sans-serif",
            }}
          >
            <span className="relative z-10">求人を見る</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "#b8923f" }}
              aria-hidden="true"
            />
          </a>
          {/*
          <a
            href="#story"
            className="inline-flex items-center gap-2 px-10 py-4 text-sm tracking-[0.2em] uppercase font-medium border transition-colors duration-300"
            style={{
              borderColor: "rgba(240,235,225,0.4)",
              color: "#F0EBE1",
              fontFamily: "'Jost', sans-serif",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#C9A84C";
              (e.currentTarget as HTMLAnchorElement).style.color = "#C9A84C";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(240,235,225,0.4)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#F0EBE1";
            }}
          >
            Our Story
          </a>
          */}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{
            color: "rgba(240,235,225,0.5)",
            fontFamily: "'Jost', sans-serif",
          }}
        >
          スクロール
        </span>
        <div
          className="h-10 w-px relative overflow-hidden"
          style={{ background: "rgba(201,168,76,0.2)" }}
        >
          <div
            className="absolute top-0 left-0 w-full bg-[#C9A84C]"
            style={{
              animation: "scrollLine 1.8s ease-in-out infinite",
              height: "40%",
            }}
          />
        </div>
      </div>

      {/* ── keyframe for scroll indicator ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        @keyframes scrollLine {
          0%   { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(300%);  opacity: 0; }
        }
      `}</style>
    </section>
  );
}

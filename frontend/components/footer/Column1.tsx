"use client"
import Image from "next/image";
import { GoldDivider,SectionLabel,socialLinks } from "./Helpers";
export default function BrandColumn() {
  return (
    <div className="flex flex-col">
        <SectionLabel>Our company</SectionLabel>
      {/* Logo */}
      <div className="flex justify-center items-center">
      <Image alt="GP LOGO" src={"/GpLogoTransparent.png"} width={100} height={100} />
      </div> 
      

      {/* Contact rows */}
      {[
        {
          label: "Our Address",
          value: (
            <>
              6th Floor, 2-36-1 Ikebukuro, Toshima City, Tokyo 171-0014, Japan
            </>
          ),
        },
        {
          label: "Call Us",
          value: (
            <a href="tel:+81368419101" className="hover:underline">
              +81-3-6841-9101
            </a>
          ),
        },
        { label: "Email Us", value: "info@glowing-partner.jp" },
      ].map(({ label, value }) => (
        <div key={label} className="flex items-start gap-3 mb-3">
          <span
            className="mt-[7px] w-[5px] h-[5px] rounded-full flex-shrink-0"
            style={{ background: "var(--color-secondary)" }}
          />
          <div>
            <span
              className="block text-[10.5px] uppercase tracking-[0.08em] mb-[2px]"
              style={{
                fontFamily: "var(--font-label)",
                color: "rgba(248,250,248,0.7)",
              }}
            >
              {label}
            </span>
            <span
              className="text-[13.5px]"
              style={{
                fontFamily: "var(--font-body)",
                color: "rgba(248,250,248,0.55)",
                lineHeight: 1.55,
              }}
            >
              {value}
            </span>
          </div>
        </div>
      ))}

      <GoldDivider />

      {/* Social icons */}
      <SectionLabel>Follow Us</SectionLabel>
      <div className="flex gap-3">
        {socialLinks.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{
              border: "0.5px solid rgba(201,168,76,0.5)",
              color: "var(--color-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(201,168,76,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            {icon}
          </a>
        ))}
      </div>
    </div>
  );
}
"use client"
import Image from "next/image";
import { GoldDivider,SectionLabel,socialLinks } from "./Helpers";
export default function BrandColumn() {
  return (
    <div className="flex flex-col">
        <SectionLabel>会社情報</SectionLabel>
      {/* Logo */}
      <div className="flex justify-start items-center">
      <Image alt="GPロゴ" src={"/GpLogoTransparent.png"} width={130} height={130} />
      </div> 
      

      {/* Contact rows */}
      {[
        {
          label: "所在地",
          value: (
            <>
              〒171-0014 東京都豊島区池袋二丁目36番1号6階
            </>
          ),
        },
        { label: "メールアドレス", value: "info@glowing-partner.jp" },
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
      <SectionLabel>フォローする</SectionLabel>
      <div className="flex gap-3">
        {socialLinks.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
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
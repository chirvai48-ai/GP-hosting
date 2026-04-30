import {SectionLabel} from "./Helpers"
import HoursNewsletterColumn from "./Column2";
import BrandColumn from "./Column1";

function FacebookColumn() {
  return (
    <div className="flex flex-col">
      <SectionLabel>Find Us on Facebook</SectionLabel>
      <p
        className="text-[13.5px] italic mb-4"
        style={{
          fontFamily: "var(--font-body)",
          color: "rgba(248,250,248,0.45)",
          lineHeight: 1.65,
        }}
      >
        Join our community for updates, announcements, and stories.
      </p>

      {/* Facebook preview card */}
      <div
        className="rounded-md p-4"
        style={{
          background: "rgba(255,255,255,0.055)",
          border: "0.5px solid rgba(201,168,76,0.2)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: "#1877F2" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-[22px] h-[22px]"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </div>
          <div>
            <p
              className="text-[14px] leading-tight"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-surface)",
                fontWeight: 500,
              }}
            >
              Glowing Partner
            </p>
            <p
              className="text-[11px]"
              style={{
                fontFamily: "var(--font-label)",
                color: "rgba(248,250,248,0.38)",
              }}
            >
              Facebook Page
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-5 mb-4">
          {[
            { num: "5.5K", lbl: "Followers" },
            { num: "3.8K", lbl: "Likes" },
            { num: "Weekly", lbl: "Posts" },
          ].map(({ num, lbl }) => (
            <div key={lbl}>
              <span
                className="block text-[15px] font-medium leading-none mb-[3px]"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-secondary)",
                }}
              >
                {num}
              </span>
              <span
                className="text-[9.5px] uppercase tracking-[0.1em]"
                style={{
                  fontFamily: "var(--font-label)",
                  color: "rgba(248,250,248,0.35)",
                }}
              >
                {lbl}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="pt-3"
          style={{ borderTop: "0.5px solid rgba(201,168,76,0.2)" }}
        >
          <a
            href="https://www.facebook.com/glowingpartner.co.ltd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group transition-opacity duration-200 hover:opacity-70"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-[12px] h-[12px]"
              style={{ color: "var(--color-secondary)" }}
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            <span
              className="text-[10.5px] uppercase tracking-[0.14em]"
              style={{
                fontFamily: "var(--font-label)",
                color: "var(--color-secondary)",
              }}
            >
              Visit our page
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[11px] h-[11px] ml-auto"
              style={{ color: "var(--color-secondary)" }}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function FooterSection() {
  return (
    <footer
      style={{
        background: "var(--color-primary)",
        color: "var(--color-surface)",
      }}
    >
      {/* Gold top hairline */}
      <div
        className="h-px w-full"
        style={{ background: "rgba(201,168,76,0.35)" }}
      />

      {/* Three-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 px-10 md:px-10 pt-4 pb-10">
        {/* Col 1 */}
        <div
          className="pb-10 md:pb-0 md:pr-6 md:border-r"
          style={{ borderColor: "rgba(201,168,76,0.15)" }}
        >
          <BrandColumn />
        </div>

        {/* Col 2 */}
        <div
          className="py-10 md:py-0 md:px-6 md:border-r border-t md:border-t-0"
          style={{ borderColor: "rgba(201,168,76,0.15)" }}
        >
          <HoursNewsletterColumn />
        </div>

        {/* Col 3 */}
        <div
          className="pt-10 md:pt-0 md:pl-10 border-t md:border-t-0"
          style={{ borderColor: "rgba(201,168,76,0.15)" }}
        >
          <FacebookColumn />
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="px-10 md:px-16 py-4 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ borderTop: "0.5px solid rgba(201,168,76,0.18)" }}
      >
        <p
          className="text-[10.5px] tracking-[0.04em]"
          style={{
            fontFamily: "var(--font-label)",
            color: "rgba(248,250,248,0.28)",
          }}
        >
          © {new Date().getFullYear()} Glowing Partner Japan.
        </p>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Sitemap"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[10.5px] uppercase tracking-[0.07em] transition-colors duration-200"
              style={{
                fontFamily: "var(--font-label)",
                color: "rgba(248,250,248,0.28)",
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
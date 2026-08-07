export function GoldDivider() {
  return (
    <div
      className="my-5 h-px"
      style={{ background: "rgba(201,168,76,0.22)" }}
    />
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-4 text-[10px] tracking-[0.22em] uppercase"
      style={{
        fontFamily: "var(--font-label)",
        color: "var(--color-secondary)",
      }}
    >
      {children}
    </p>
  );
}

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/glowingpartner.co.ltd",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
];


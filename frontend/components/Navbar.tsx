"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SubItem = {
  label: string;
  image: string;
  href?: string;
};

type NavItem = {
  label: string;
  href?: string;
  subItems?: SubItem[];
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "#",
    subItems: [
      {
        label: "For Recruiter",
        image: "/forrecruiter.jpg",
        href: "/services/for-recruiter",
      },
      {
        label: "For Job Seeker",
        image: "/forjobseeker.jpg",
        href: "/services/for-job-seeker",
      },
    ],
  },
  {
    label: "Our Business",
    href: "#",
    subItems: [
      {
        label: "Career Counseling",
        image: "/careercounseling.jpg",
        href: "/business/career-counseling",
      },
      {
        label: "Temporary Staffing",
        image: "/recruiters.jpg",
        href: "/business/staffing",
      },
      {
        label: "Paid Employment Placement",
        image: "/jobseekers.jpg",
        href: "/business/placement",
      },
    ],
  },
  {
    label: "Contact",
    href: "#",
    subItems: [
      {
        label: "Company",
        image: "/company.jpg",
        href: "/contact/company",
      },
      {
        label: "Customer",
        image: "/customer.jpg",
        href: "/contact/customer",
      },
    ],
  },
  { label: "Vacancy", href: "/vacancy" },
  { label: "News", href: "/news" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  // dark === true means the navbar sits on a LIGHT background → use dark text.
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // Close mobile menu on route change
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  useEffect(() => {
    // Lock body scroll while mobile menu is open
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  useEffect(() => {
    const NAV_PROBE_Y = 40;

    let isScheduled = false;

    const parseRgb = (
      str: string
    ): [number, number, number, number] | null => {
      const m = str.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
      const [r, g, b, a = 1] = parts;
      if ([r, g, b].some((n) => Number.isNaN(n))) return null;
      return [r, g, b, a];
    };

    const isLightBg = (el: Element | null): boolean => {
      let node: Element | null = el;
      while (node && node !== document.body) {
        const tint = (node as HTMLElement).dataset?.navbarTint;
        if (tint === "light") return false;
        if (tint === "dark") return true;
        const bg = getComputedStyle(node).backgroundColor;
        const rgb = parseRgb(bg);
        if (rgb && rgb[3] > 0.2) {
          const [r, g, b] = rgb;
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          return luminance > 0.6;
        }
        node = node.parentElement;
      }
      return true;
    };

    const update = () => {
      const prevPointer = document.documentElement.style.pointerEvents;
      const header = document.querySelector("header[data-navbar-root]");
      const prevHeaderPE = header
        ? (header as HTMLElement).style.pointerEvents
        : "";
      if (header) (header as HTMLElement).style.pointerEvents = "none";
      const el = document.elementFromPoint(window.innerWidth / 2, NAV_PROBE_Y);
      if (header) (header as HTMLElement).style.pointerEvents = prevHeaderPE;
      document.documentElement.style.pointerEvents = prevPointer;
      setDark(isLightBg(el));
      isScheduled = false;
    };

    const onScrollOrResize = () => {
      if (!isScheduled) {
        isScheduled = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  const textColor = dark || mobileOpen ? "text-black" : "text-white";

  return (
    <>
      <header
        data-navbar-root
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                src="/GpLogoTransparent.png"
                alt="Logo"
                className="h-14 md:h-20 w-auto object-contain"
              />
            </div>

            {/* Divider — desktop only */}
            <div className="hidden lg:block w-px h-7 bg-white/25 mx-4" />

            {/* Desktop nav */}
            <nav className="hidden lg:block">
              <ul className="flex items-center gap-6 xl:gap-10">
                {navItems.map((item) => (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() =>
                      item.subItems && setActiveMenu(item.label)
                    }
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <a
                      href={item.href ?? "#"}
                      className={`font-display text-sm font-black tracking-widest uppercase
                      ${dark ? "text-black " : "text-white "}relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full transition-colors duration-300 flex items-center gap-1`}
                    >
                      {item.label}
                      {item.subItems && (
                        <svg
                          className={`w-3 h-3 transition-transform duration-300 ${activeMenu === item.label ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </a>

                    {item.subItems && (
                      <div
                        className={`
                          absolute top-full left-1/2 -translate-x-1/2 pt-4
                          flex gap-3 p-4
                          bg-black/30 backdrop-blur-md
                          border border-white/10
                          shadow-2xl
                          transition-all duration-300 ease-out
                          ${
                            activeMenu === item.label
                              ? "opacity-100 translate-y-0 pointer-events-auto"
                              : "opacity-0 -translate-y-2 pointer-events-none"
                          }
                        `}
                        style={{
                          minWidth:
                            item.subItems.length > 2 ? "640px" : "340px",
                        }}
                      >
                        {item.subItems.map((sub) => (
                          <a
                            key={sub.label}
                            href={sub.href ?? "#"}
                            className="group relative flex-1 min-w-[140px] overflow-hidden cursor-pointer"
                          >
                            <div
                              className="h-32 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                              style={{ backgroundImage: `url('${sub.image}')` }}
                            />
                            <div className="absolute inset-0 bg-[var(--color-primary)]/10 group-hover:bg-black/10 transition-colors duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                              <p className="font-display text-white text-xs tracking-widest uppercase text-center leading-tight">
                                {sub.label}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className={`lg:hidden relative w-10 h-10 flex items-center justify-center transition-colors ${textColor}`}
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="relative block w-6 h-4">
                <span
                  className={`absolute left-0 top-0 block h-[2px] w-6 bg-current transition-transform duration-300 ${
                    mobileOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] block h-[2px] w-6 bg-current transition-opacity duration-200 ${
                    mobileOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[14px] block h-[2px] w-6 bg-current transition-transform duration-300 ${
                    mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-[color:var(--color-surface)]"
          onClick={() => setMobileOpen(false)}
        />
        <nav
          className={`relative h-full w-full overflow-y-auto pt-20 pb-12 px-6 transition-transform duration-500 ease-out ${
            mobileOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          <ul className="flex flex-col divide-y divide-[color:var(--color-on-surface)]/10">
            {navItems.map((item) => {
              const expanded = mobileExpanded === item.label;
              return (
                <li key={item.label}>
                  {item.subItems ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpanded(expanded ? null : item.label)
                        }
                        className="w-full flex items-center justify-between py-5 font-display text-2xl text-[color:var(--color-on-surface)]"
                      >
                        <span>{item.label}</span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <div
                        className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${
                          expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <ul className="pb-4 pl-1 space-y-1">
                          {item.subItems.map((sub) => (
                            <li key={sub.label}>
                              <a
                                href={sub.href ?? "#"}
                                className="flex items-center gap-4 py-3 group"
                              >
                                <span
                                  className="block w-14 h-14 bg-cover bg-center flex-shrink-0"
                                  style={{
                                    backgroundImage: `url('${sub.image}')`,
                                  }}
                                />
                                <span className="font-[var(--font-label)] text-[11px] tracking-[0.3em] uppercase text-[color:var(--color-on-surface)] group-hover:text-[color:var(--color-primary)] transition-colors">
                                  {sub.label}
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <a
                      href={item.href ?? "#"}
                      className="block py-5 font-display text-2xl text-[color:var(--color-on-surface)]"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}

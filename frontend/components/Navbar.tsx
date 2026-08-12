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
  { label: "ホーム", href: "/" },
  { label: "会社概要", href: "/about" },
  {
    label: "サービス",
    href: "#",
    subItems: [
      {
        label: "企業担当者様のご相談",
        image: "/forrecruiter.jpg",
        href: "/services/for-recruiter",
      },
      {
        label: "お仕事の紹介をご希望の方",
        image: "/forjobseeker.jpg",
        href: "/services/for-job-seeker",
      },
    ],
  },
  {
    label: "事業内容",
    href: "#",
    subItems: [
      {
        label: "就職活動支援事業",
        image: "/careercounseling.jpg",
        href: "/business/career-counseling",
      },
      {
        label: "労働者派遣事業",
        image: "/recruiters.jpg",
        href: "/business/staffing",
      },
      {
        label: "人材紹介事業",
        image: "/jobseekers.jpg",
        href: "/business/placement",
      },
      {
        label: "特定技能外国人の支援事業（登録支援機関）",
        image: "/forrecruiter.jpg",
        href: "/business/ssw-support",
      },
    ],
  },
  {
    label: "お問い合わせ",
    href: "#",
    subItems: [
      {
        label: "企業様からの\nお問い合わせ",
        image: "/company.jpg",
        href: "/contact/company",
      },
      {
        label: "求職者様からの\nお問い合わせ",
        image: "/customer.jpg",
        href: "/contact/customer",
      },
    ],
  },
  { label: "求人情報", href: "/vacancy" },
  { label: "ニュース", href: "/news" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  // Opacity of the white navbar background: 1 at top, fades toward MIN_OPACITY on scroll.
  const [bgOpacity, setBgOpacity] = useState(1);

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
    const FADE_DISTANCE = 240; // px of scroll over which opacity fades
    const MIN_OPACITY = 0.92;

    let isScheduled = false;

    const update = () => {
      const ratio = Math.min(window.scrollY / FADE_DISTANCE, 1);
      setBgOpacity(1 - ratio * (1 - MIN_OPACITY));
      isScheduled = false;
    };

    const onScroll = () => {
      if (!isScheduled) {
        isScheduled = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header
        data-navbar-root
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
        style={{ backgroundColor: `rgba(255, 255, 255, ${bgOpacity})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <img
                src="/logowhite.jpeg"
                alt="ロゴ"
                className="h-10 md:h-14 w-auto object-contain"
              />
              <span className="font-display text-sm md:text-base font-black tracking-widest uppercase text-black whitespace-nowrap">
                Glowing Partner
              </span>
            </div>

            {/* Divider — desktop only */}
            <div className="hidden lg:block w-px h-7 bg-black/25 mx-4" />

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
                      className="font-display text-sm font-black tracking-widest uppercase text-black relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full transition-colors duration-300 flex items-center gap-1"
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
                              <p className="font-display text-white text-xs tracking-widest uppercase text-center leading-tight whitespace-pre-line">
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
              aria-label={mobileOpen ? "メニューを閉じる" : "メニューを開く"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center transition-colors text-black"
            >
              <span className="sr-only">ナビゲーションを切り替える</span>
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
                                <span className="font-[var(--font-label)] text-[11px] tracking-[0.3em] uppercase text-[color:var(--color-on-surface)] group-hover:text-[color:var(--color-primary)] transition-colors whitespace-pre-line">
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

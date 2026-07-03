"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X, ArrowUpRight } from "lucide-react";

type Member = {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  bio: string;
  isCeo?: boolean;
};

const members: Member[] = [
  {
    id: "uenaka",
    name: "Uenaka Go",
    role: "Founder & CEO",
    photo: "/UenkaGO.jpg",
    isCeo: true,
    bio: `Since founding our company in August 2018, we have operated with a unique philosophy: every one of our employees is a foreign national.

Why did we intentionally build our organization this way? The answer lies in a principle that has always guided me.

I believe that anything we confidently recommend to our clients should first be something we have practiced ourselves and experienced firsthand.

From the very beginning, I was also convinced that as the number of foreign employees in Japan continues to grow, foreign workforce management — how to maximize their potential and help them build long-term careers — would become one of the greatest challenges facing Japanese companies.

Of course, our journey was not smooth from the start. We encountered many challenges, including language barriers, cultural differences, and differing values. Through continuous trial and improvement, however, we developed systems that foster mutual understanding and enable everyone to grow together. As a result, we successfully maintained our all-foreign employee organization and, united as one team, even overcame the unprecedented challenges of the COVID-19 pandemic.

We believe that a service which ends simply with recruitment support ultimately offers clients nothing more than an increase in labor costs.

What sets us apart is the real-world experience and expertise in managing foreign employees that we have gained through years of operating our own company. This hands-on knowledge allows us to provide practical, on-site support that other companies cannot easily replicate — helping foreign employees settle into their workplaces quickly and become productive members of the team.

Our goal is to ensure that hiring foreign talent is not viewed merely as a solution to labor shortages or an additional expense.

Instead, we strive to help your international employees become valuable members of your organization — people who contribute to increased productivity, higher sales, and greater profitability. We would be honored to walk alongside your company as a trusted partner throughout that journey.`,
  },
  {
    id: "narayan",
    name: "Narayan Pokhrel",
    role: "CEO, World Partner",
    photo: "/Narayan.jpeg",
    bio: `I have been living in Japan for the past 12 years. Thanks to this experience, I have a deep understanding of the expectations, perspectives, and needs of both Japanese companies and foreign employees.

By listening to people's real voices and bridging cultural differences, I strive to provide support that achieves 100% mutual understanding through effective two-way communication.

I am also one of the many foreigners who crossed the sea to come to Japan 12 years ago. Because of this personal experience, I understand the feelings of foreign employees and how to help them make the most of their potential better than anyone else. With strong communication skills, I am committed to serving as a bridge between employers and employees, providing wholehearted support to both sides.`,
  },
  {
    id: "arun",
    name: "Arun Gurung",
    role: "Employment Support Lead",
    photo: "/Arun.jpeg",
    bio: `I provide comprehensive support throughout the entire employment process — from recruiting foreign talent to labor management, employee training after hiring, and ongoing follow-up support for companies.

As a foreign worker in Japan myself, I have grown with the help and kindness of the people around me. Because of that experience, I can truly understand the concerns and anxieties of job seekers and offer practical, personalized advice.

For companies, I am committed to providing and supporting employees who can contribute effectively and remain with the organization for the long term. For job seekers, I aim to connect them with workplaces where they can work with confidence and peace of mind.

Above all, I value building strong human relationships, and I dedicate myself to becoming the best possible partner for both employers and job seekers.`,
  },
  {
    id: "sanyukta",
    name: "Sanyukta Amatya",
    role: "Career Support Specialist",
    photo: "/Amatya.jpeg",
    bio: `At Glowing Partner, we are committed to supporting each individual by understanding their goals and aspirations and helping them find workplaces where they can grow with confidence and peace of mind.

We believe that every new challenge and every fresh start holds great potential. Let us work together to build a brighter future.`,
  },
  {
    id: "norin",
    name: "Norin Shrestha",
    role: "Client Support",
    photo: "/Norin.jpeg",
    bio: `For me, teamwork, respect for others, and continuous learning are extremely important.

I am grateful for every opportunity to learn, grow, and contribute.

My goal is to be someone my colleagues and clients can trust by providing kind, attentive, and reliable support to everyone I work with.`,
  },
  {
    id: "nirajan",
    name: "Nirajan Pokhrel",
    role: "Account & Staff Relations",
    photo: "/Nirajan.jpeg",
    bio: `In my daily work, I value building trusting relationships with both our client companies and our staff above all else.

I approach every consultation and every task with sincerity, taking full responsibility to ensure the best possible support.

My goal is to be someone you can rely on and feel comfortable turning to whenever you need assistance. I am committed to supporting you with dedication and integrity every step of the way.`,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Photo frame — tinted background + object-contain so no cropping, ever. */
function PortraitFrame({
  member,
  className = "",
  priority = false,
}: {
  member: Member;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          "linear-gradient(160deg, rgba(20,86,82,0.07) 0%, rgba(201,168,76,0.10) 100%)",
      }}
    >
      {member.photo ? (
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-center"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-[#145652] to-[#1e7a74] text-white shadow-lg">
            <span className="font-headline text-4xl">{initials(member.name)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function BioModal({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-[fadeIn_180ms_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} biography`}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
      />

      <div className="relative bg-white w-full max-w-3xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl animate-[slideUp_220ms_ease-out]">
        <div
          className="h-1.5 shrink-0"
          style={{ background: "linear-gradient(to right, #145652, #c9a84c)" }}
        />

        <div className="flex items-center gap-4 sm:gap-5 px-6 sm:px-10 py-6 shrink-0 border-b border-[rgba(20,86,82,0.08)] pr-14">
          {/* Small circular avatar */}
          <div
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-[color:var(--color-secondary)]/50 ring-offset-2 ring-offset-white shadow-sm"
            style={{
              background:
                "linear-gradient(160deg, rgba(20,86,82,0.07) 0%, rgba(201,168,76,0.10) 100%)",
            }}
          >
            {member.photo ? (
              <Image
                src={member.photo}
                alt={member.name}
                fill
                sizes="64px"
                className="object-cover object-top"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#145652] to-[#1e7a74] text-white">
                <span className="font-headline text-base">{initials(member.name)}</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-label text-[10px] tracking-[0.2em] uppercase text-[color:var(--color-secondary)] font-semibold mb-1">
              {member.isCeo ? "Message from the CEO" : "From the team"}
            </p>
            <h3 className="font-headline text-xl md:text-2xl text-[color:var(--color-on-surface)] leading-tight truncate">
              {member.name}
            </h3>
            <p className="font-label text-xs sm:text-sm tracking-wide text-[color:var(--color-primary)] font-medium mt-0.5">
              {member.role}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/95 border border-[rgba(20,86,82,0.15)] flex items-center justify-center shadow-sm text-[color:var(--color-on-surface)] hover:text-[color:var(--color-primary)] hover:border-[color:var(--color-secondary)] transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-7">
          <p className="font-body text-[15px] md:text-base leading-relaxed whitespace-pre-line text-[color:var(--color-on-surface-variant)]">
            {member.bio}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}

function ReadButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/btn inline-flex items-center gap-2 self-start px-5 py-2.5 bg-[color:var(--color-primary)] text-white font-label text-[11px] tracking-[0.18em] uppercase font-semibold rounded-full hover:bg-[color:var(--color-secondary)] hover:text-[color:var(--color-primary)] transition-all duration-300 shadow-sm hover:shadow-md"
    >
      {label}
      <ArrowUpRight
        size={14}
        className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
      />
    </button>
  );
}

function CeoFeature({ member, onOpen }: { member: Member; onOpen: () => void }) {
  return (
    <article
      id={member.id}
      className="relative scroll-mt-28 bg-white border border-[color:var(--color-secondary)]/40 shadow-md overflow-hidden"
    >
      <div
        className="h-1.5"
        style={{ background: "linear-gradient(to right, #145652, #c9a84c, #145652)" }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-0">
        {/* Photo */}
        <PortraitFrame
          member={member}
          priority
          className="aspect-[4/5] lg:aspect-auto lg:min-h-[560px]"
        />

        {/* Content */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-[color:var(--color-secondary)]/15 text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[color:var(--color-primary)] border border-[color:var(--color-secondary)]/40 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-secondary)]" />
            Chief Executive
          </span>

          <h3 className="font-headline text-4xl md:text-5xl text-[color:var(--color-on-surface)] leading-tight mb-2">
            {member.name}
          </h3>
          <p className="font-label text-sm tracking-[0.08em] text-[color:var(--color-primary)] font-semibold mb-6">
            {member.role}
          </p>

          <p className="font-body text-[15px] md:text-base leading-relaxed text-[color:var(--color-on-surface-variant)] line-clamp-5 mb-6">
            {member.bio}
          </p>

          <ReadButton onClick={onOpen} label="Read full message" />
        </div>
      </div>
    </article>
  );
}

function MemberCard({ member, onOpen }: { member: Member; onOpen: () => void }) {
  return (
    <article
      id={member.id}
      className="group scroll-mt-28 bg-white border border-[rgba(20,86,82,0.1)] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[color:var(--color-secondary)]/50 flex flex-col"
    >
      <PortraitFrame member={member} className="aspect-[4/5]" />

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-headline text-2xl text-[color:var(--color-on-surface)] leading-tight">
          {member.name}
        </h3>
        <p className="font-label text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--color-on-surface-variant)] mt-1 mb-3">
          {member.role}
        </p>
        <div className="w-10 h-px bg-[color:var(--color-secondary)]/60 mb-4" />

        <p className="font-body text-sm leading-relaxed text-[color:var(--color-on-surface-variant)] line-clamp-3 mb-5 flex-1">
          {member.bio}
        </p>

        <ReadButton onClick={onOpen} label="Read bio" />
      </div>
    </article>
  );
}

export default function TeamSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const ceo = members.find((m) => m.isCeo)!;
  const team = members.filter((m) => !m.isCeo);
  const openMember = members.find((m) => m.id === openId) ?? null;

  return (
    <section className="relative bg-[color:var(--color-container-low)] py-24 px-6 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[var(--color-primary)]/[0.04] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 w-[480px] h-[480px] rounded-full bg-[var(--color-secondary)]/[0.06] blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-label text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--color-secondary)] mb-4">
            Our Team
          </p>
          <h2 className="font-headline text-5xl md:text-6xl font-light italic text-[color:var(--color-primary)]">
            The People Behind Glowing Partner
          </h2>
          <div className="w-16 h-0.5 bg-[color:var(--color-secondary)] mx-auto mt-5" />
          <p className="font-body text-base md:text-lg text-[color:var(--color-on-surface-variant)] leading-relaxed max-w-3xl mx-auto mt-6">
            A small, multi-national team united by one belief: international talent
            and Japanese companies grow strongest when they truly understand each other.
          </p>
        </div>

        {/* CEO feature */}
        <div className="mb-16">
          <CeoFeature member={ceo} onOpen={() => setOpenId(ceo.id)} />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-[rgba(20,86,82,0.12)]" />
          <p className="font-label text-[10px] tracking-[0.22em] uppercase text-[color:var(--color-on-surface-variant)]">
            Meet the Team
          </p>
          <div className="flex-1 h-px bg-[rgba(20,86,82,0.12)]" />
        </div>

        {/* Team — 2-up on tablet, 3-up on desktop (3 above, 2 below) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 lg:max-w-5xl lg:mx-auto">
          {team.map((m) => (
            <MemberCard key={m.id} member={m} onOpen={() => setOpenId(m.id)} />
          ))}
        </div>
      </div>

      {openMember && <BioModal member={openMember} onClose={() => setOpenId(null)} />}
    </section>
  );
}

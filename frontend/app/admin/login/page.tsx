import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex bg-surface text-on-surface font-body">

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <aside className="hidden lg:flex flex-col justify-end relative w-[44%] flex-shrink-0 bg-primary overflow-hidden p-12">

        {/* Gradient atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(201,168,76,.18) 0%, transparent 70%)," +
              "radial-gradient(ellipse 60% 80% at 80% 80%, rgba(255,255,255,.05) 0%, transparent 60%)",
          }}
        />

        {/* Decorative rings */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full border border-secondary/20 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full border border-secondary/10 pointer-events-none" />
        <div className="absolute bottom-28 -left-16 w-52 h-52 rounded-full border border-white/[0.07] pointer-events-none" />

        {/* Gold edge line */}
        <div className="absolute top-0 bottom-0 right-0 w-px pointer-events-none bg-gradient-to-b from-transparent via-secondary/40 to-transparent" />

        {/* Tagline */}
        <div className="relative z-10 animate-fade-up-slow">
          <p className="font-label text-[0.65rem] tracking-[.25em] uppercase text-secondary mb-4">
            Administration Portal
          </p>
          <h1 className="font-headline text-4xl xl:text-5xl font-light leading-[1.15] text-white">
            Manage with
            <br />
            <em className="not-italic italic text-secondary">clarity &amp;</em>
            <br />
            confidence.
          </h1>
          <div className="w-12 h-px bg-secondary/60 my-6" />
          <p className="font-body text-base font-light text-white/50 leading-relaxed max-w-[280px]">
            A secure gateway to your organisation&apos;s command centre. Sign in
            to continue.
          </p>
        </div>

        {/* Bottom micro-badges */}
        <div className="relative z-10 flex gap-3 mt-10">
          {["Manage", "Reply", "Shortlist"].map((badge) => (
            <span
              key={badge}
              className="font-label text-[0.58rem] tracking-[.14em] uppercase border border-white/10 text-white/30 px-2.5 py-1"
            >
              {badge}
            </span>
          ))}
        </div>
      </aside>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-10 relative bg-surface">

        {/* Top-right ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,.07),transparent_70%)]" />

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

      </main>
    </div>
  );
}
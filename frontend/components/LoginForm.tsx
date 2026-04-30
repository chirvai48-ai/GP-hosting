"use client";
import { useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  MessageSquareWarning,
  MoveRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const IconLayers = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

export function LoginForm() {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPwd, setShowPwd]     = useState(false);
  const [remember, setRemember]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setIsLoading(true);
    const {data,error} = await authClient.signIn.email({
        email,
        password,
        callbackURL:"/admin/dashboard",
        rememberMe:remember
    })
    setIsLoading(false);
    if (error) {
    setError(error.message || "Invalid credentials. Please try again.");
    return;
  }
  };

  return (
    <div className="w-full max-w-sm animate-fade-up">

      {/* ── Brand mark ── */}
      <div className="flex flex-col items-start mb-10">
        <div className="relative w-11 h-11 border border-primary flex items-center justify-center mb-3 text-primary">
          <span className="absolute inset-[3px] border border-secondary/40 pointer-events-none" />
          <IconLayers />
        </div>
        <span className="font-display text-xl font-medium tracking-[.03em] text-on-surface">
          Glowing-partner Admin
        </span>
        <span className="font-label text-[0.62rem] tracking-[.2em] uppercase text-secondary mt-0.5">
          Secure Access
        </span>
      </div>

      {/* ── Heading ── */}
      <h2 className="font-headline text-[2.4rem] font-light leading-tight text-on-surface">
        Welcome back.
      </h2>
      <p className="font-label text-[0.75rem] text-on-surface-var tracking-[.02em] mt-1 mb-8">
        Sign in to your administrator account
      </p>

      {/* ── Email field ── */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block font-label text-[0.68rem] tracking-[.12em] uppercase text-on-surface-var mb-1.5"
        >
          Email Address
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-var/50 flex pointer-events-none">
            <Mail size={14} />
          </span>
          <input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="
              w-full pl-10 pr-4 py-3
              bg-container-low
              border border-transparent border-b-primary/25
              text-on-surface font-body text-base
              placeholder:text-on-surface-var/40 placeholder:italic
              outline-none transition-colors duration-200
              focus:border-primary focus:bg-white
            "
          />
        </div>
      </div>

      {/* ── Password field ── */}
      <div className="mb-2">
        <label
          htmlFor="password"
          className="block font-label text-[0.68rem] tracking-[.12em] uppercase text-on-surface-var mb-1.5"
        >
          Password
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-var/50 flex pointer-events-none">
            <LockKeyhole size={14} />
          </span>
          <input
            id="password"
            type={showPwd ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="
              w-full pl-10 pr-10 py-3
              bg-container-low
              border border-transparent border-b-primary/25
              text-on-surface font-body text-base
              placeholder:text-on-surface-var/40 placeholder:italic
              outline-none transition-colors duration-200
              focus:border-primary focus:bg-white
            "
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            aria-label={showPwd ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-var/50 hover:text-on-surface-var transition-colors duration-150 flex"
          >
            {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* ── Error message ── */}
      {error && (
        <p className="flex items-center gap-1.5 font-label text-[0.72rem] text-red-600 mt-2">
          <MessageSquareWarning size={12} />
          {error}
        </p>
      )}

      {/* ── Remember / Forgot ── */}
      <div className="flex items-center justify-between mt-5 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="custom-checkbox"
          />
          <span className="font-label text-[0.7rem] text-on-surface-var tracking-[.02em]">
            Keep me signed in
          </span>
        </label>
        <a
          href="#"
          className="font-label text-[0.7rem] text-primary tracking-[.02em] border-b border-transparent hover:border-primary transition-colors duration-150"
        >
          Forgot password?
        </a>
      </div>

      {/* ── Submit button ── */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="
          relative w-full flex items-center justify-center gap-2
          py-3.5 px-4
          bg-primary hover:bg-[#0e3f3c] active:translate-y-px
          disabled:opacity-60 disabled:cursor-not-allowed
          text-white font-label text-[0.72rem] font-medium tracking-[.2em] uppercase
          transition-colors duration-200 overflow-hidden
        "
      >
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-secondary" />
        {isLoading ? (
          <>
            <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 border-2 border-white/30 border-t-white animate-spin" />
            Authenticating…
          </>
        ) : (
          <>
            Sign In
            <MoveRight size={13} />
          </>
        )}
      </button>

      {/* ── Card footer ── */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-primary/10">
        <span className="font-label text-[0.62rem] text-on-surface-var/50 tracking-[.04em]">
          © 2026 WP admin — Admin v1.0
        </span>
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary opacity-70" />
          <span className="w-1.5 h-1.5 rounded-full bg-secondary opacity-35" />
          <span className="w-1.5 h-1.5 rounded-full bg-secondary opacity-35" />
        </div>
      </div>

    </div>
  );
}
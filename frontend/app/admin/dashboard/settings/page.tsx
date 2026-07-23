"use client";

import { useState } from "react";
import { UserPlus, Mail, LockKeyhole, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SettingsPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState("");
  const [error, setError]       = useState("");

  const handleCreate = async () => {
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { error: err } = await authClient.signUp.email({
      email,
      password,
      name: name || email.split("@")[0],
      callbackURL: "/admin/dashboard/settings",
    });
    setLoading(false);

    if (err) {
      setError(err.message || "Failed to create account.");
      return;
    }

    setSuccess(`Admin account created for ${email}.`);
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="font-headline text-2xl font-light text-on-surface">Settings</h1>
        <p className="font-label text-[0.75rem] text-on-surface-var tracking-[.02em] mt-1">
          Manage admin accounts and panel configuration.
        </p>
      </div>

      {/* Create admin account card */}
      <div className="border border-primary/15 bg-container-low p-6">
        <div className="flex items-center gap-2 mb-5">
          <UserPlus size={16} className="text-primary" />
          <h2 className="font-label text-[0.8rem] font-medium tracking-[.08em] uppercase text-on-surface">
            Add Admin Account
          </h2>
        </div>

        {success && (
          <div className="mb-5 flex items-start gap-2 border-l-2 border-green-600 bg-green-50 px-3 py-2 font-label text-[0.72rem] text-green-800 tracking-[.02em]">
            <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-start gap-2 border-l-2 border-red-500 bg-red-50 px-3 py-2 font-label text-[0.72rem] text-red-700 tracking-[.02em]">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-label text-[0.68rem] tracking-[.12em] uppercase text-on-surface-var mb-1.5">
              Display Name <span className="normal-case opacity-60">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Tanaka Kenji"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full px-3.5 py-2.5
                bg-white border border-transparent border-b-primary/25
                text-on-surface font-body text-sm
                placeholder:text-on-surface-var/40 placeholder:italic
                outline-none transition-colors duration-200
                focus:border-primary
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-label text-[0.68rem] tracking-[.12em] uppercase text-on-surface-var mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-var/50 pointer-events-none flex">
                <Mail size={14} />
              </span>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="
                  w-full pl-10 pr-4 py-2.5
                  bg-white border border-transparent border-b-primary/25
                  text-on-surface font-body text-sm
                  placeholder:text-on-surface-var/40 placeholder:italic
                  outline-none transition-colors duration-200
                  focus:border-primary
                "
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-label text-[0.68rem] tracking-[.12em] uppercase text-on-surface-var mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-var/50 pointer-events-none flex">
                <LockKeyhole size={14} />
              </span>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="
                  w-full pl-10 pr-10 py-2.5
                  bg-white border border-transparent border-b-primary/25
                  text-on-surface font-body text-sm
                  placeholder:text-on-surface-var/40 placeholder:italic
                  outline-none transition-colors duration-200
                  focus:border-primary
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
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="
            mt-6 flex items-center justify-center gap-2
            px-6 py-2.5
            bg-primary hover:bg-[#0e3f3c] active:translate-y-px
            disabled:opacity-60 disabled:cursor-not-allowed
            text-white font-label text-[0.72rem] font-medium tracking-[.2em] uppercase
            transition-colors duration-200
          "
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin flex-shrink-0" />
              Creating…
            </>
          ) : (
            <>
              <UserPlus size={13} />
              Create Account
            </>
          )}
        </button>
      </div>
    </div>
  );
}

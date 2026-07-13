"use client";
import { useState } from "react";
import { SectionLabel,GoldDivider } from "./Helpers";


export default function HoursNewsletterColumn() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className="flex flex-col">


      {/* Newsletter */}
      <SectionLabel>Subscribe to Newsletter</SectionLabel>
      {submitted ? (
        <p
          className="text-[13px] tracking-wide"
          style={{
            fontFamily: "var(--font-label)",
            color: "var(--color-secondary)",
          }}
        >
          Thank you for subscribing ✦
        </p>
      ) : (
        <>
          <div
            className="flex rounded-sm overflow-hidden"
            style={{ border: "0.5px solid rgba(201,168,76,0.45)" }}
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 min-w-0 bg-transparent outline-none px-3 py-[9px] text-[13px]"
              style={{
                fontFamily: "var(--font-body)",
                color: "rgba(248,250,248,0.8)",
              }}
            />
            <button
              onClick={handleSubmit}
              className="px-4 flex items-center justify-center transition-opacity duration-200 hover:opacity-80"
              style={{ background: "var(--color-secondary)" }}
              aria-label="Subscribe"
            >
              {/* Arrow right icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#145652"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[14px] h-[14px]"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
          <p
            className="mt-2 text-[10.5px] tracking-wider"
            style={{
              fontFamily: "var(--font-label)",
              color: "rgba(248,250,248,0.22)",
            }}
          >
            No spam. Unsubscribe anytime.
          </p>
        </>
      )}
    </div>
  );
}

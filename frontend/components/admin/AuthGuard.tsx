"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const wasAuthed = useRef(false);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      const reason = wasAuthed.current ? "expired" : "required";
      router.replace(`/admin/login?reason=${reason}`);
      return;
    }

    wasAuthed.current = true;
  }, [session, isPending, router]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <span className="font-label text-[0.7rem] tracking-[.15em] uppercase text-on-surface-var">
            Verifying session
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

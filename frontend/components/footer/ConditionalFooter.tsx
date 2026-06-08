"use client";

import { usePathname } from "next/navigation";
import FooterSection from "./FooterSection";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <FooterSection />;
}

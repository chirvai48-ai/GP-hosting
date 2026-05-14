import ResponsiveDrawer from "@/components/AdminDrawer";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row min-h-screen">
      <ResponsiveDrawer />
      {/* pt-[52px] clears the fixed AppBar on mobile; sm:pt-0 because AppBar hides on desktop */}
      <div className="flex-1 pt-[52px] sm:pt-0 p-4 sm:p-6 md:p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}

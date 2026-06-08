import { BusinessProgressRail } from "@/components/business/BusinessChrome";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BusinessProgressRail />
      {children}
    </>
  );
}

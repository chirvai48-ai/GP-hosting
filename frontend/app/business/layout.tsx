import PageShell from "@/components/business/PageShell";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}

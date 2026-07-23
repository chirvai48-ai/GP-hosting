import ApplicationForm from "@/components/application/ApplicationForm";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jobId = Number(id);

  if (!Number.isInteger(jobId) || jobId <= 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-10 bg-[color:var(--color-surface)]">
        <p className="text-[color:var(--color-on-surface-variant)] font-[family-name:var(--font-label)]">
          無効な求人IDです。
        </p>
      </main>
    );
  }

  return <ApplicationForm jobId={jobId} />;
}

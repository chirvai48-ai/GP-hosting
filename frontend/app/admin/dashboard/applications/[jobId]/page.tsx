import AdminApplicationsTable from "@/components/adminapplication/AdminApplicationsTable";

export default async function Page({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const id = Number(jobId);
  if (!Number.isInteger(id) || id <= 0) {
    return (
      <div className="p-6 text-red-500 font-[var(--font-label)]">
        Invalid vacancy id.
      </div>
    );
  }
  return <AdminApplicationsTable jobId={id} />;
}

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  FileText,
  Users,
  Mail,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import StatCard from "@/components/adminoverview/StatCard";
import PipelineChart from "@/components/adminoverview/PipelineChart";
import TrendChart from "@/components/adminoverview/TrendChart";
import VacancyStatusChart from "@/components/adminoverview/VacancyStatusChart";
import MessageQueueCard from "@/components/adminoverview/MessageQueueCard";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApplicationStats {
  stageCounts: Record<string, number>;
  talentPoolCount: number;
  hiredThisMonth: number;
  totalApplications: number;
  weeklyTrend: { weekStart: string; count: number }[];
}

interface JobStats {
  statusCounts: Record<string, number>;
  totalJobs: number;
}

interface ContactStats {
  openContactRequests: number;
  newCandidateInquiries: number;
  movedToTalentPool: number;
}

async function getApplicationStats(): Promise<{ data: ApplicationStats }> {
  const res = await adminFetch(`${API_URL}/api/applications/stats`);
  if (!res.ok) throw new Error("Failed to load application stats");
  return res.json();
}

async function getJobStats(): Promise<{ data: JobStats }> {
  const res = await adminFetch(`${API_URL}/api/jobs/stats`);
  if (!res.ok) throw new Error("Failed to load job stats");
  return res.json();
}

async function getContactStats(): Promise<{ data: ContactStats }> {
  const res = await adminFetch(`${API_URL}/api/contacts/stats`);
  if (!res.ok) throw new Error("Failed to load contact stats");
  return res.json();
}

export default function OverviewPage() {
  const appQuery = useQuery({ queryKey: ["applications", "stats"], queryFn: getApplicationStats });
  const jobQuery = useQuery({ queryKey: ["jobs", "stats"], queryFn: getJobStats });
  const contactQuery = useQuery({ queryKey: ["contacts", "stats"], queryFn: getContactStats });

  const isLoading = appQuery.isPending || jobQuery.isPending || contactQuery.isPending;
  const isError = appQuery.isError || jobQuery.isError || contactQuery.isError;

  if (isError) {
    return (
      <div className="p-6 bg-[var(--color-surface)] min-h-screen flex items-center justify-center text-red-500 font-[var(--font-label)]">
        Failed to load dashboard data.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-[var(--color-surface)] min-h-screen flex items-center justify-center text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
        Loading dashboard…
      </div>
    );
  }

  const app = appQuery.data!.data;
  const job = jobQuery.data!.data;
  const contact = contactQuery.data!.data;

  const talentPoolTotal = app.talentPoolCount + contact.movedToTalentPool;
  const openMessages = contact.openContactRequests + contact.newCandidateInquiries;
  const publishedVacancies = job.statusCounts["Published"] ?? 0;
  const pendingApplications = app.stageCounts["Pending"] ?? 0;
  const hireRate =
    app.totalApplications > 0
      ? Math.round((app.hiredThisMonth / app.totalApplications) * 100)
      : 0;

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl text-[var(--color-on-surface)] font-[var(--font-headline)]">
          Overview
        </h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] font-[var(--font-label)] mt-1">
          Recruitment activity at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard label="Open Vacancies" value={publishedVacancies} icon={Briefcase} color="teal" />
        <StatCard label="Pending Applications" value={pendingApplications} icon={ClipboardList} color="slate" />
        <StatCard label="Talent Pool" value={talentPoolTotal} icon={Users} color="blue" />
        <StatCard label="Open Messages" value={openMessages} icon={Mail} color="gold" />
        <StatCard
          label="Hired This Month"
          value={app.hiredThisMonth}
          icon={CheckCircle2}
          color="plum"
          hint={app.totalApplications > 0 ? `${hireRate}% of all applicants` : undefined}
        />
        <StatCard label="Total Applications" value={app.totalApplications} icon={FileText} color="coral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <PipelineChart stageCounts={app.stageCounts} />
        <TrendChart weeklyTrend={app.weeklyTrend} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VacancyStatusChart statusCounts={job.statusCounts} />
        <MessageQueueCard
          openContactRequests={contact.openContactRequests}
          newCandidateInquiries={contact.newCandidateInquiries}
          movedToTalentPool={contact.movedToTalentPool}
        />
      </div>
    </div>
  );
}

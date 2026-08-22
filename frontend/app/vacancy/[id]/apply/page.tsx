import { cache } from "react";
import type { Metadata } from "next";
import ApplicationForm from "@/components/application/ApplicationForm";
import { CONTRACT_LABELS } from "@/schemas/application.schemas";
import type { Job } from "@/types/table";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SITE_URL = "https://glowing-partner.jp";

const EMPLOYMENT_TYPE_SCHEMA: Record<string, string> = {
  Full_time: "FULL_TIME",
  Part_time: "PART_TIME",
  Internship: "INTERN",
  Flexible: "OTHER",
};

// schema.org baseSalary requires an ISO 4217 code; the DB stores the
// display label "YEN" (see backend job.schema.ts), not "JPY".
const CURRENCY_ISO4217: Record<string, string> = { YEN: "JPY" };

// Wrapped in React cache() so generateMetadata and the page component share a
// single fetch (+ single R2 presign) per request instead of hitting the backend
// twice. no-store keeps job data fresh across requests.
const fetchJob = cache(async (id: number): Promise<Job | null> => {
  const res = await fetch(`${API_URL}/api/jobs/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return (json?.data ?? null) as Job | null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await fetchJob(Number(id));

  if (!job) {
    return { title: "求人が見つかりません" };
  }

  const description = `${job.location}での${
    CONTRACT_LABELS[job.contract as keyof typeof CONTRACT_LABELS] ?? job.contract
  }求人。${job.requirements ?? ""}`.slice(0, 160);

  return {
    title: job.title,
    description,
    alternates: { canonical: `/vacancy/${job.id}/apply` },
    openGraph: {
      title: job.title,
      description,
      images: job.image_url ? [job.image_url] : undefined,
    },
  };
}

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

  const job = await fetchJob(jobId);

  const jsonLd = job
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: job.requirements || job.title,
        datePosted: job.created_at,
        employmentType: EMPLOYMENT_TYPE_SCHEMA[job.contract] ?? "OTHER",
        hiringOrganization: {
          "@type": "Organization",
          name: "株式会社Glowing Partner",
          sameAs: SITE_URL,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location,
            addressCountry: "JP",
          },
        },
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: CURRENCY_ISO4217[job.currency] ?? job.currency ?? "JPY",
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salary_min,
            maxValue: job.salary_max,
            unitText: "MONTH",
          },
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ApplicationForm jobId={jobId} />
    </>
  );
}

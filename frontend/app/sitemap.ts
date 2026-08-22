import type { MetadataRoute } from "next";
import type { Job, JobsResponse } from "@/types/table";

const SITE_URL = "https://glowing-partner.jp";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const STATIC_ROUTES = [
  "",
  "/about",
  "/business/career-counseling",
  "/business/placement",
  "/business/ssw-support",
  "/business/staffing",
  "/contact/company",
  "/contact/customer",
  "/news",
  "/services/for-job-seeker",
  "/services/for-recruiter",
  "/vacancy",
];

async function fetchAllPublishedJobs(): Promise<Job[]> {
  const jobs: Job[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `${API_URL}/api/jobs?status=Published&page=${page}&limit=100`
    );
    if (!res.ok) break;
    const body: JobsResponse = await res.json();
    jobs.push(...body.data.items);
    if (!body.data.hasNext) break;
    page += 1;
  }
  return jobs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const jobs = await fetchAllPublishedJobs().catch(() => []);
  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${SITE_URL}/vacancy/${job.id}/apply`,
    lastModified: new Date(job.updated_at),
  }));

  return [...staticEntries, ...jobEntries];
}

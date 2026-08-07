import type { Job } from "@/types/table";
import type { Filterstype } from "@/types/filters";
import type { Searchtype } from "@/types/search";

const SCHEDULE_CONTRACT_MAP: Record<keyof Filterstype["schedule"], string[]> = {
  full_time: ["Full_time"],
  part_time: ["Part_time"],
  contract: ["Contract"],
  internship: ["Internship"],
};

function matchesKeyword(job: Job, q: string) {
  if (!q.trim()) return true;
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    job.title,
    job.job_category?.name ?? "",
    ...(job.technical_skills?.map((s) => s.name) ?? []),
    ...(job.languages?.map((l) => l.name) ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return tokens.every((t) => haystack.includes(t));
}

function matchesCity(job: Job, city: string) {
  if (!city || city === "All cities") return true;
  return job.location?.toLowerCase() === city.toLowerCase();
}

function matchesExperience(job: Job, exp: number) {
  if (exp === -1) return true;
  if (exp === 6) return job.experience >= 5;
  return job.experience === exp;
}

function matchesSalary(job: Job, slider: number[]) {
  const [lo, hi] = slider;
  const minYen = lo * 1000;
  const maxYen = hi * 1000;
  return job.salary_max >= minYen && job.salary_min <= maxYen;
}

function matchesSchedule(job: Job, sched: Filterstype["schedule"]) {
  const active = (Object.keys(sched) as Array<keyof Filterstype["schedule"]>).filter(
    (k) => sched[k]
  );
  if (active.length === 0) return true;
  const allowed = new Set(active.flatMap((k) => SCHEDULE_CONTRACT_MAP[k]));
  return allowed.has(job.contract);
}

function matchesEmployment(job: Job, emp: Filterstype["employment"]) {
  const active = (Object.keys(emp) as Array<keyof Filterstype["employment"]>).filter(
    (k) => emp[k]
  );
  if (active.length === 0) return true;
  const hasShift = !!(job.shift_start && job.shift_end);
  return active.some((k) => {
    switch (k) {
      case "fivedays":
        return job.workdays === 5;
      case "sixdays":
        return job.workdays === 6;
      case "shift_based":
        return hasShift;
      case "flexible":
        return !hasShift && job.workdays == null;
    }
  });
}

export function applyJobFilters(
  jobs: Job[],
  search: Searchtype,
  filters: Filterstype
): Job[] {
  return jobs.filter(
    (job) =>
      matchesKeyword(job, search.searchValue) &&
      matchesCity(job, search.city) &&
      matchesExperience(job, search.exp) &&
      matchesSalary(job, search.sliderValue) &&
      matchesSchedule(job, filters.schedule) &&
      matchesEmployment(job, filters.employment)
  );
}

export const SALARY_SLIDER_MAX = 1000;

export const DEFAULT_FILTERS: Filterstype = {
  schedule: { full_time: false, part_time: false, contract: false, internship: false },
  employment: { sixdays: false, shift_based: false, flexible: false, fivedays: false },
};

export const DEFAULT_SEARCH: Searchtype = {
  sliderValue: [0, SALARY_SLIDER_MAX],
  searchValue: "",
  exp: -1,
  city: "All cities",
};

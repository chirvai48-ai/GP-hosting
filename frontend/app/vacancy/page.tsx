"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filter";
import VacancySection from "@/components/Vacancies";
import { PaginationControls } from "@/components/Reusables/PaginationControls";
import type { Filterstype } from "@/types/filters";
import type { Searchtype } from "@/types/search";
import type { JobsResponse } from "@/types/table";
import { DEFAULT_FILTERS, DEFAULT_SEARCH, SALARY_SLIDER_MAX } from "@/lib/jobFilter";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DEFAULT_LIMIT = 12;

function buildParams(search: Searchtype, filters: Filterstype, page: number, limit: number): string {
  const params = new URLSearchParams();
  params.set("status", "Published");
  params.set("page", String(page));
  params.set("limit", String(limit));

  const keyword = search.searchValue.trim();
  if (keyword) params.set("keyword", keyword);
  if (search.city && search.city !== "All cities") params.set("city", search.city);
  if (search.exp !== -1) params.set("exp", String(search.exp));

  const [lo, hi] = search.sliderValue;
  if (!(lo === 0 && hi === SALARY_SLIDER_MAX)) {
    params.set("salary_min", String(lo));
    params.set("salary_max", String(hi));
  }

  const schedule = (Object.keys(filters.schedule) as Array<keyof Filterstype["schedule"]>).filter(
    (k) => filters.schedule[k]
  );
  if (schedule.length) params.set("schedule", schedule.join(","));

  const employment = (Object.keys(filters.employment) as Array<keyof Filterstype["employment"]>).filter(
    (k) => filters.employment[k]
  );
  if (employment.length) params.set("employment", employment.join(","));

  return params.toString();
}

async function getJobs(search: Searchtype, filters: Filterstype, page: number, limit: number): Promise<JobsResponse> {
  const res = await fetch(`${API_URL}/api/jobs?${buildParams(search, filters, page, limit)}`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

const Page = () => {
  const [filters, setFilters] = useState<Filterstype>(DEFAULT_FILTERS);
  const [searchState, setSearchState] = useState<Searchtype>(DEFAULT_SEARCH);
  const [debounced, setDebounced] = useState({ search: searchState, filters });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced({ search: searchState, filters }), 400);
    return () => clearTimeout(timer);
  }, [searchState, filters]);

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["jobs-public", debounced.search, debounced.filters, page, limit],
    queryFn: () => getJobs(debounced.search, debounced.filters, page, limit),
  });

  const jobs = data?.data?.items ?? [];
  const totalCount = data?.data?.total ?? 0;

  const resetAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchState(DEFAULT_SEARCH);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-16 md:pt-20">
      <SearchBar searchState={searchState} onChange={setSearchState} onClear={resetAll} />
      <div className="flex flex-row items-start gap-6 px-4 md:px-8 lg:px-12">
        <Filters filters={filters} onChange={setFilters} />
        <div className="flex-1 min-w-0">
          <VacancySection
            jobs={jobs}
            totalCount={totalCount}
            isPending={isPending}
            isError={isError}
            onClearFilters={resetAll}
          />
          {!isPending && !isError && totalPages > 1 && (
            <PaginationControls
              page={page}
              limit={limit}
              total={totalCount}
              onPageChange={setPage}
              onLimitChange={(n) => {
                setLimit(n);
                setPage(1);
              }}
              limitOptions={[12, 24, 48]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
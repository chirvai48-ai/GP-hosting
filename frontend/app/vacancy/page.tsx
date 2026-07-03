"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filter";
import VacancySection from "@/components/Vacancies";
import type { Filterstype } from "@/types/filters";
import type { Searchtype } from "@/types/search";
import type { JobsResponse } from "@/types/table";
import { applyJobFilters, DEFAULT_FILTERS, DEFAULT_SEARCH } from "@/lib/jobFilter";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getJobs(): Promise<JobsResponse> {
  const res = await fetch(`${API_URL}/api/jobs`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

const Page = () => {
  const [filters, setFilters] = useState<Filterstype>(DEFAULT_FILTERS);
  const [searchState, setSearchState] = useState<Searchtype>(DEFAULT_SEARCH);

  const { data, isPending, isError } = useQuery({
    queryKey: ["jobs-public"],
    queryFn: getJobs,
  });

  const publishedJobs = useMemo(
    () => (data?.data ?? []).filter((j) => j.status === "Published"),
    [data]
  );

  const filteredJobs = useMemo(
    () => applyJobFilters(publishedJobs, searchState, filters),
    [publishedJobs, searchState, filters]
  );

  const resetAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchState(DEFAULT_SEARCH);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-16 md:pt-20">
      <SearchBar searchState={searchState} onChange={setSearchState} onClear={resetAll} />
      <div className="flex flex-row items-start gap-6 px-4 md:px-8 lg:px-12">
        <Filters filters={filters} onChange={setFilters} />
        <VacancySection
          jobs={filteredJobs}
          totalCount={publishedJobs.length}
          isPending={isPending}
          isError={isError}
          onClearFilters={resetAll}
        />
      </div>
    </div>
  );
};

export default Page;

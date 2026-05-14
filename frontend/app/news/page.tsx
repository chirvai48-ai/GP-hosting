"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { News, NewsResponse } from "@/types/table";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getNews(): Promise<NewsResponse> {
  const res = await fetch(`${API_URL}/api/news`);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ArticleDetail({ article }: { article: News }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full max-h-80 object-cover"
        />
      )}
      <div className="p-8">
        <p className="text-xs font-headline tracking-widest uppercase text-[var(--color-secondary)] mb-3">
          {formatDate(article.published_at)}
        </p>
        <h2 className="text-3xl font-light font-headline text-[var(--color-primary)] leading-snug mb-4">
          {article.title}
        </h2>
        <p className="text-base font-headline italic text-[var(--color-on-surface-variant)] mb-6 leading-relaxed">
          {article.summary}
        </p>
        <div className="w-12 h-px bg-[var(--color-secondary)] mb-6" />
        <p className="text-sm font-body text-[var(--color-on-surface)] leading-7 whitespace-pre-wrap">
          {article.body}
        </p>
      </div>
    </div>
  );
}

function ArticleListItem({
  article,
  isActive,
  onClick,
}: {
  article: News;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
        isActive
          ? "border-[var(--color-primary)] bg-white shadow-sm"
          : "border-transparent bg-white/60 hover:bg-white hover:shadow-sm"
      }`}
    >
      <p className="text-[10px] font-headline tracking-widest uppercase text-[var(--color-secondary)] mb-1">
        {formatDate(article.published_at)}
      </p>
      <p
        className={`text-sm font-headline leading-snug mb-1 ${
          isActive ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface)]"
        }`}
      >
        {article.title}
      </p>
      <p className="text-xs text-[var(--color-on-surface-variant)] font-body line-clamp-2 leading-relaxed">
        {article.summary}
      </p>
    </button>
  );
}

function NewsPageInner() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");

  const { data, isPending, isError } = useQuery({
    queryKey: ["news-public"],
    queryFn: getNews,
  });

  const articles = (data?.data ?? []).filter((n) => n.status === "published");

  const [selectedId, setSelectedId] = useState<number | null>(
    urlId ? Number(urlId) : null
  );

  const selected = articles.find((a) => a.id === selectedId) ?? articles[0];

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f2f4f3] flex items-center justify-center">
        <p className="text-[var(--color-on-surface-variant)] font-headline">Loading...</p>
      </div>
    );
  }

  if (isError || articles.length === 0) {
    return (
      <div className="min-h-screen bg-[#f2f4f3] flex items-center justify-center">
        <p className="text-[var(--color-on-surface-variant)] font-headline">
          {isError ? "Failed to load news." : "No news published yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f4f3] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-light tracking-tight font-headline text-[var(--color-primary)] mb-2">
          News
        </h1>
        <div className="w-16 h-0.5 bg-[var(--color-secondary)] mb-10" />

        <div className="flex gap-8 items-start">
          {/* Left: full article view */}
          <div className="flex-[3] sticky top-24 self-start">
            {selected && <ArticleDetail article={selected} />}
          </div>

          {/* Right: article list */}
          <div className="flex-[2] max-h-[calc(100vh-9rem)] overflow-y-auto space-y-2 pr-1">
            {articles.map((a) => (
              <ArticleListItem
                key={a.id}
                article={a}
                isActive={a.id === (selected?.id ?? -1)}
                onClick={() => setSelectedId(a.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f2f4f3] flex items-center justify-center">
          <p className="text-[var(--color-on-surface-variant)] font-headline">Loading...</p>
        </div>
      }
    >
      <NewsPageInner />
    </Suspense>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Newspaper, Clock, Sparkles, ArrowUpRight, Calendar } from "lucide-react";
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

function estimateReadingTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function ImageFallback({ title }: { title: string }) {
  const letter = (title?.[0] ?? "N").toUpperCase();
  return (
    <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center relative overflow-hidden">
      <Newspaper
        size={64}
        className="absolute -bottom-3 -right-3 text-white/15"
        strokeWidth={1}
      />
      <span className="text-white/80 text-6xl font-light font-headline select-none">
        {letter}
      </span>
    </div>
  );
}

function ArticleDetail({ article }: { article: News }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[rgba(20,86,82,0.08)]">
      <div className="relative w-full h-80 overflow-hidden">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageFallback title={article.title} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm text-[10px] font-headline tracking-[0.18em] uppercase text-[var(--color-primary)]">
          <Sparkles size={12} /> Featured story
        </span>
      </div>
      <div className="p-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 text-xs font-headline text-[var(--color-on-surface-variant)]">
          <span className="inline-flex items-center gap-1.5 tracking-widest uppercase text-[var(--color-secondary)]">
            <Calendar size={12} /> {formatDate(article.published_at)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={12} /> {estimateReadingTime(article.body)}
          </span>
        </div>
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
    </article>
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
      className={`group w-full text-left p-3 rounded-xl border transition-all duration-200 flex gap-3 ${
        isActive
          ? "border-[var(--color-primary)] bg-white shadow-sm"
          : "border-transparent bg-white/60 hover:bg-white hover:shadow-sm hover:-translate-y-0.5"
      }`}
    >
      <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-[var(--color-container-low)]">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <ImageFallback title={article.title} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-headline tracking-widest uppercase text-[var(--color-secondary)] mb-1">
          {formatDate(article.published_at)}
        </p>
        <p
          className={`text-sm font-headline leading-snug mb-1 line-clamp-2 ${
            isActive ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface)]"
          }`}
        >
          {article.title}
        </p>
        <p className="text-xs text-[var(--color-on-surface-variant)] font-body line-clamp-2 leading-relaxed">
          {article.summary}
        </p>
      </div>
      <ArrowUpRight
        size={14}
        className={`shrink-0 mt-1 transition-all ${
          isActive
            ? "text-[var(--color-primary)] opacity-100"
            : "text-[var(--color-on-surface-variant)] opacity-0 group-hover:opacity-100"
        }`}
      />
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
    <div className="relative min-h-screen bg-[#f2f4f3] pt-24 pb-16 overflow-hidden">
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[var(--color-primary)]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -right-40 w-[420px] h-[420px] rounded-full bg-[var(--color-secondary)]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/3 w-[360px] h-[360px] rounded-full bg-[var(--color-primary)]/8 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Hero header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-[var(--color-primary)]/15">
              <Newspaper size={14} className="text-[var(--color-primary)]" />
              <span className="text-[10px] font-headline tracking-[0.18em] uppercase text-[var(--color-primary)]">
                The Glowing Partner journal
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight font-headline text-[var(--color-primary)] mb-2">
              News<span className="text-[var(--color-secondary)]">.</span>
            </h1>
            <div className="w-16 h-0.5 bg-[var(--color-secondary)] mb-3" />
            <p className="text-sm md:text-base font-headline italic text-[var(--color-on-surface-variant)] max-w-md">
              Updates, hiring milestones, and stories from across our network.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-[var(--color-primary)]/10 px-5 py-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-headline text-2xl text-[var(--color-primary)] leading-none">
                {articles.length}
              </p>
              <p className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-on-surface-variant)] font-headline mt-1">
                Stories published
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: full article view */}
          <div className="w-full lg:flex-[3] lg:sticky lg:top-24 self-start">
            {selected && <ArticleDetail article={selected} />}
          </div>

          {/* Right: article list */}
          <div className="w-full lg:flex-[2]">
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-[10px] font-headline tracking-[0.18em] uppercase text-[var(--color-secondary)]">
                Latest stories
              </p>
              <p className="text-[10px] font-headline tracking-widest uppercase text-[var(--color-on-surface-variant)]">
                {articles.length} total
              </p>
            </div>
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto space-y-2 pr-1">
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

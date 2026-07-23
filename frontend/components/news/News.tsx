"use client";

import { useQuery } from "@tanstack/react-query";
import { Newspaper } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StackList from "../lightswind/stack-list";
import type { NewsResponse } from "@/types/table";

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
  });
}

function NewsSection() {
  const router = useRouter();
  const { data, isPending, isError } = useQuery({
    queryKey: ["news-public"],
    queryFn: getNews,
  });

  const items = (data?.data ?? [])
    .filter((n) => n.status === "published")
    .slice(0, 3)
    .map((n) => ({
      icon: <Newspaper className="w-6 h-6 text-[var(--color-primary)]" />,
      title: n.title,
      subtitle: n.summary,
      date: formatDate(n.published_at),
      onClick: () => router.push(`/news?id=${n.id}`),
    }));

  return (
    <div className="flex flex-col min-h-screen w-auto justify-center items-center bg-[#f2f4f3]">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight mb-2 font-headline text-primary mt-2">
        Top ニュース
      </h1>
      <div className="w-36 h-0.5 mx-auto mb-4 bg-secondary" />

      {isPending && (
        <p className="text-sm text-gray-500 font-headline">ニュースを読み込んでいます...</p>
      )}

      {isError && (
        <p className="text-sm text-red-500 font-headline">ニュースの読み込みに失敗しました。</p>
      )}

      {!isPending && !isError && items.length === 0 && (
        <p className="text-sm text-gray-500 font-headline">まだニュースはありません。</p>
      )}

      {items.length > 0 && (
        <>
          <StackList
            items={items}
            initialVisible={3}
            className="w-full sm:max-w-md md:max-w-xl p-4"
          />
          <Link href="/news">
            <button className="mt-2 mb-6 px-6 py-2 rounded-full border border-[var(--color-secondary)] text-[var(--color-secondary)] text-sm font-headline hover:bg-[var(--color-secondary)] hover:text-white transition-colors">
              ニュースをもっと見る
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

export default NewsSection;

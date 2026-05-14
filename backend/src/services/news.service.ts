import { prisma } from "../lib/prisma";
import type {updateNews as updateNewsType } from "../schemas/news.schema";
import type {createNews as createNewsType } from "../schemas/news.schema";
import { News as PrismaNews } from "../generated/prisma/client";
import { putUrl, deleteObject,getUrl } from "../configs/cloudflare";

export const createNews = async (data: createNewsType): Promise<PrismaNews & { signed_url?: string }> => {
  const { admin_id, ...rest } = data;

  let signed_url: string | undefined;
  if (data.image_key && data.image_type) {
    signed_url = await putUrl("glowingpartner", `news/${data.image_key}`, data.image_type);
  }

  const result = await prisma.news.create({
    data: {
      ...rest,
      ...(admin_id && {
        admin: { connect: { id: admin_id } },
      }),
    },
    include: {
      admin: true,
    },
  });

  return { ...result, ...(signed_url && { signed_url }) };
};

export const fetchNews = async () => {
  const news = await prisma.news.findMany({
    include: { admin: true },
    orderBy: { published_at: "desc" },
  });

  return Promise.all(
    news.map(async (item) => {
      if (!item.image_key) return item;
      const image_url = await getUrl("glowingpartner", `news/${item.image_key}`);
      return { ...item, image_url };
    })
  );
};

export const fetchNewsById = async (id: number): Promise<PrismaNews | null> => {
  const news = await prisma.news.findUnique({
    where: {
      id: id,
    },
    include: {
      admin: true,
    },
  });

  return news;
};

export const removeNews = async (id: number): Promise<PrismaNews> => {
  const news = await prisma.news.findUnique({ where: { id } });

  if (news?.image_key) {
    await deleteObject("glowingpartner", `news/${news.image_key}`);
  }

  const deletedNews = await prisma.news.delete({ where: { id } });
  return deletedNews;
};

export const patchNews = async (
  id: number,
  data: updateNewsType
): Promise<PrismaNews & { signed_url?: string }> => {
  const { admin_id, ...rest } = data;

  let signed_url: string | undefined;

  if (data.image_key && data.image_type) {
    const existing = await prisma.news.findUnique({
      where: { id },
      select: { image_key: true },
    });

    if (existing?.image_key && existing.image_key !== data.image_key) {
      try {
        await deleteObject("glowingpartner", `news/${existing.image_key}`);
      } catch {
        // Object missing from R2 — continue with the update
      }
    }

    signed_url = await putUrl("glowingpartner", `news/${data.image_key}`, data.image_type);
  }

  const updatedNews = await prisma.news.update({
    where: { id },
    data: {
      ...rest,
      ...(admin_id && {
        admin: { connect: { id: admin_id } },
      }),
    },
    include: { admin: true },
  });

  return { ...updatedNews, ...(signed_url && { signed_url }) };
};
import { Request, Response, NextFunction } from "express";
import { createNews,fetchNews,fetchNewsById,patchNews,removeNews } from "../services/news.service";
import { NewsStatus } from "../generated/prisma/enums";
export const getNews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawStatus = req.query.status;
    const validStatuses = Object.values(NewsStatus);
    if (rawStatus !== undefined && !validStatuses.includes(rawStatus as NewsStatus)) {
      res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
      return;
    }
    const status = typeof rawStatus === "string" ? rawStatus : undefined;
    const news = await fetchNews(status)
    res.status(200).json({
        message : "News fetched successfully",
        data : news
    })
  } catch (error) {
    next(error);
  }
};

export const postNews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const news = await createNews(req.body);
    res.status(201).json(
        {
            message: "news created successfully",
            data: news
        }
    )
  } catch (err) {
    next(err);
  }
};

export const getNewsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id:number = Number(req.params.id)
    const news = await fetchNewsById(id)
    res.status(200).json({
        message: `news with id ${id}  fetched successfully`,
        data: news
    })
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newsId:number = Number(req.params.id)
    const data = req.body
    const news = await patchNews(newsId,data)
    res.status(200).json({
      message : "news updated successfully ",
      data:news
    })
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id:number = Number(req.params.id)
    const deletednews = await removeNews(id)
    res.status(200).json({
        message : `news with id ${id} deleted  successfully `,
        data : deletednews
    })
  } catch (error) {
    next(error);
  }
};

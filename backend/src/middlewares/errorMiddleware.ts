import { Request, Response, NextFunction } from "express";

// Never forward err.message/code/meta to the client — can contain raw
// Prisma/DB text. Log server-side, return a friendly bilingual message.
export const errorMiddleware = (
  err: Error & { code?: string; meta?: Record<string, unknown> },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("[error]", req.method, req.originalUrl, err);
  res.status(500).json({
    message:
      "エラーが発生しました。しばらくしてから再度お試しください。 / Something went wrong on our end. Please try again.",
  });
};
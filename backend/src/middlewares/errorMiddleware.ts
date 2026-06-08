import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: Error & { code?: string; meta?: Record<string, unknown> },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("[error]", req.method, req.originalUrl, err);
  res.status(500).json({
    message: err?.message || "Internal server error",
    ...(err?.code && { code: err.code }),
    ...(err?.meta ? { meta: err.meta } : {}),
  });
};
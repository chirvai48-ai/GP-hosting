import { Request, Response, NextFunction } from "express";
import { GENERIC_SERVER_ERROR } from "../lib/messages";

// Never forward err.message/code/meta to the client — can contain raw
// Prisma/DB text. Log server-side, return a friendly bilingual message.
export const errorMiddleware = (
  err: Error & { code?: string; meta?: Record<string, unknown> },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("[error]", req.method, req.originalUrl, err);
  res.status(500).json({ message: GENERIC_SERVER_ERROR });
};
import { Request, Response, NextFunction } from "express";
import { fetchLastSeen, updateLastSeen, LastSeenScope } from "../services/admin.service";

export const getLastSeen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lastSeen = await fetchLastSeen(req.admin!.id);
    res.status(200).json({ message: "Last-seen fetched successfully", data: lastSeen });
  } catch (err) {
    next(err);
  }
};

export const patchLastSeen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scope = req.body?.scope as LastSeenScope;
    if (scope !== "applications" && scope !== "messages") {
      res.status(400).json({ message: "scope must be 'applications' or 'messages'" });
      return;
    }
    const lastSeen = await updateLastSeen(req.admin!.id, scope);
    res.status(200).json({ message: "Last-seen updated successfully", data: lastSeen });
  } catch (err) {
    next(err);
  }
};

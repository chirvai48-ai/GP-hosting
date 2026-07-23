import { Router } from "express";
import { getLastSeen, patchLastSeen } from "../controllers/adminController";
import { requireAuth } from "../middlewares/requireAuth";

const adminRouter = Router();

adminRouter.get("/last-seen", requireAuth, getLastSeen);
adminRouter.patch("/last-seen", requireAuth, patchLastSeen);

export default adminRouter;

import cron from "node-cron";
import { cleanupRejectedApplications } from "../services/application.service";

export const startCronJobs = () => {
  // Daily at 03:00 server-local time: delete rejected applications older than 7 days.
  cron.schedule("0 3 * * *", async () => {
    try {
      const n = await cleanupRejectedApplications();
      if (n > 0) {
        console.log(`[cron] Deleted ${n} rejected applications older than 7 days`);
      }
    } catch (err) {
      console.error("[cron] cleanupRejectedApplications failed:", err);
    }
  });
};

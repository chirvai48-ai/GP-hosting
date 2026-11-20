import cron from "node-cron";
import { cleanupRejectedApplications } from "../services/application.service";
import { buildDailyDigest } from "../services/digest.service";
import { notify } from "./notifier";

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

  // Weekday mornings at 09:00 JST: post the recruiting digest to Google Chat.
  // Skipped silently when no digest webhook is configured (dev, CI).
  cron.schedule(
    "0 9 * * 1-5",
    async () => {
      try {
        const digest = await buildDailyDigest();
        await notify({ type: "digest.daily", digest });
      } catch (err) {
        console.error("[cron] dailyDigest failed:", err);
      }
    },
    { timezone: "Asia/Tokyo" }
  );
};

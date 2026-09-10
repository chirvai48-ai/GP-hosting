import app from "./index";
import { startCronJobs } from "./lib/cron";

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
    startCronJobs();
});

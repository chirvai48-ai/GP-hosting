import { execSync } from "child_process";
import path from "path";

// Delete everything the E2E run created from the dev DB, using the backend's own
// compiled prisma client. All rows are tagged __E2E__ / the e2e admin email.
export default async function globalTeardown() {
  const script = `
    const { prisma } = require('./dist/lib/prisma');
    (async () => {
      await prisma.contactRequest.deleteMany({ where: { name: { contains: '__E2E__' } } }).catch(()=>{});
      await prisma.candidateInquiry.deleteMany({ where: { full_name: { contains: '__E2E__' } } }).catch(()=>{});
      await prisma.admin.deleteMany({ where: { email: { contains: 'gptest.local' } } }).catch(()=>{});
      process.exit(0);
    })().catch((e) => { console.error(e); process.exit(0); });
  `;
  try {
    execSync(`node -e "${script.replace(/\n/g, " ").replace(/"/g, '\\"')}"`, {
      cwd: path.join(__dirname, "..", "..", "backend"),
      stdio: "ignore",
    });
  } catch {
    // best-effort cleanup
  }
}

import "dotenv/config";
import fs from "fs";
import path from "path";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

const SEED_MARKER = "[seed]";
const BUCKET = "glowingpartner";
const PUBLIC_DIR = path.resolve(__dirname, "../../frontend/public");
const RESUME_PDF = path.join(PUBLIC_DIR, "Chirag_Resume (10).pdf");

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

async function uploadIfMissing(key: string, filePath: string, contentType: string) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return; // already exists
  } catch {
    // fall through to upload
  }
  const body = fs.readFileSync(filePath);
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  console.log(`  uploaded ${key}`);
}

async function ensureSuperAdmin() {
  try {
    await auth.api.signUpEmail({
      body: {
        name: "Super Admin",
        email: "superadmin@glowing-partner.com",
        password: "Admin@1234",
      },
    });
    console.log("Created super admin");
  } catch {
    console.log("Super admin already exists");
  }
}

async function seedReferenceData() {
  const categories = ["Engineering", "Hospitality", "Logistics", "Education", "Sales"];
  const skills = [
    "TypeScript",
    "React",
    "Node.js",
    "Customer Service",
    "Forklift Operation",
    "Teaching",
    "Sales Negotiation",
    "AWS",
    "Excel",
  ];
  const languages = ["English", "Japanese", "Nepali", "Hindi", "Vietnamese"];

  for (const name of categories) {
    await prisma.jobCategory.upsert({ where: { name }, create: { name }, update: {} });
  }
  for (const name of skills) {
    await prisma.skill.upsert({ where: { name }, create: { name }, update: {} });
  }
  for (const name of languages) {
    await prisma.language.upsert({ where: { name }, create: { name }, update: {} });
  }
}

async function seedJobs() {
  const jobImages = [
    { key: "seed-jobseekers.jpg", file: "jobseekers.jpg" },
    { key: "seed-recruiters.jpg", file: "recruiters.jpg" },
    { key: "seed-careercounseling.jpg", file: "careercounseling.jpg" },
    { key: "seed-schoolbusiness.jpg", file: "schoolbusiness.jpg" },
    { key: "seed-meiter.jpg", file: "meiter.jpg" },
    { key: "seed-seminal.jpg", file: "seminal.jpg" },
  ];

  for (const img of jobImages) {
    await uploadIfMissing(`vacancy/${img.key}`, path.join(PUBLIC_DIR, img.file), "image/jpeg");
  }

  const cats = Object.fromEntries(
    (await prisma.jobCategory.findMany()).map((c) => [c.name, c.id])
  );

  const time = (h: number, m = 0) => new Date(Date.UTC(1970, 0, 1, h, m));

  const jobs = [
    {
      title: `${SEED_MARKER} Frontend Engineer (React/Next.js)`,
      salary_min: 4_500_000,
      salary_max: 7_000_000,
      location: "Tokyo",
      experience: 2,
      contract: "Full_time" as const,
      shift_start: time(9),
      shift_end: time(18),
      workdays: 5,
      gender: "Any",
      benefits: "Health insurance, commuter allowance, hybrid work",
      requirements: "2+ years building production React apps; comfortable in TypeScript.",
      application_method: "Apply through this portal.",
      soft_skills: "Curiosity, ownership, calm communication.",
      status: "Published" as const,
      image_key: "seed-jobseekers.jpg",
      image_type: "image/jpeg",
      job_category_id: cats["Engineering"],
      languages: ["English", "Japanese"],
      skills: ["TypeScript", "React", "AWS"],
    },
    {
      title: `${SEED_MARKER} Backend Engineer (Node + Prisma)`,
      salary_min: 5_000_000,
      salary_max: 8_500_000,
      location: "Osaka",
      experience: 3,
      contract: "Full_time" as const,
      shift_start: time(10),
      shift_end: time(19),
      workdays: 5,
      gender: "Any",
      benefits: "Stock options, learning budget, remote-friendly.",
      requirements: "Solid SQL fundamentals, REST API design.",
      application_method: "Submit your resume here.",
      soft_skills: "Pragmatic, async-first communication.",
      status: "Published" as const,
      image_key: "seed-recruiters.jpg",
      image_type: "image/jpeg",
      job_category_id: cats["Engineering"],
      languages: ["English"],
      skills: ["Node.js", "TypeScript", "AWS"],
    },
    {
      title: `${SEED_MARKER} Hotel Front Desk Associate`,
      salary_min: 2_800_000,
      salary_max: 3_600_000,
      location: "Kyoto",
      experience: 1,
      contract: "Full_time" as const,
      shift_start: time(7),
      shift_end: time(16),
      workdays: 6,
      gender: "Any",
      benefits: "Meals provided, uniform, training program.",
      requirements: "Conversational English and Japanese (N3+).",
      application_method: "Apply on our website.",
      soft_skills: "Warm, attentive, patient with guests.",
      status: "Published" as const,
      image_key: "seed-careercounseling.jpg",
      image_type: "image/jpeg",
      job_category_id: cats["Hospitality"],
      languages: ["Japanese", "English"],
      skills: ["Customer Service"],
    },
    {
      title: `${SEED_MARKER} Warehouse Operations Lead`,
      salary_min: 3_400_000,
      salary_max: 4_500_000,
      location: "Yokohama",
      experience: 4,
      contract: "Full_time" as const,
      shift_start: time(8),
      shift_end: time(17),
      workdays: 5,
      gender: "Any",
      benefits: "Performance bonus, overtime pay, transport stipend.",
      requirements: "Forklift license, 3+ years warehouse experience.",
      application_method: "Apply via portal.",
      soft_skills: "Team coordination, safety-first mindset.",
      status: "Published" as const,
      image_key: "seed-schoolbusiness.jpg",
      image_type: "image/jpeg",
      job_category_id: cats["Logistics"],
      languages: ["Japanese"],
      skills: ["Forklift Operation"],
    },
    {
      title: `${SEED_MARKER} English Conversation Teacher (Part-time)`,
      salary_min: 2_000_000,
      salary_max: 2_800_000,
      location: "Fukuoka",
      experience: 0,
      contract: "Part_time" as const,
      shift_start: time(14),
      shift_end: time(20),
      workdays: 4,
      gender: "Any",
      benefits: "Flexible hours, paid training, transport.",
      requirements: "Native or near-native English. Working visa required.",
      application_method: "Apply through this site.",
      soft_skills: "Energetic, patient with kids and adults.",
      status: "Published" as const,
      image_key: "seed-meiter.jpg",
      image_type: "image/jpeg",
      job_category_id: cats["Education"],
      languages: ["English"],
      skills: ["Teaching"],
    },
    {
      title: `${SEED_MARKER} B2B Sales Representative`,
      salary_min: 4_000_000,
      salary_max: 6_500_000,
      location: "Tokyo",
      experience: 2,
      contract: "Full_time" as const,
      shift_start: time(9),
      shift_end: time(18),
      workdays: 5,
      gender: "Any",
      benefits: "Uncapped commission, company car, expense account.",
      requirements: "2+ years B2B sales, comfortable cold-calling.",
      application_method: "Apply on our portal.",
      soft_skills: "Resilient, articulate, relationship-builder.",
      status: "Published" as const,
      image_key: "seed-seminal.jpg",
      image_type: "image/jpeg",
      job_category_id: cats["Sales"],
      languages: ["Japanese", "English"],
      skills: ["Sales Negotiation", "Customer Service", "Excel"],
    },
  ];

  const created: { id: number; title: string }[] = [];
  for (const j of jobs) {
    const { languages, skills, ...rest } = j;
    const job = await prisma.job.create({
      data: {
        ...rest,
        languages: { connect: languages.map((name) => ({ name })) },
        technical_skills: { connect: skills.map((name) => ({ name })) },
      },
    });
    created.push({ id: job.id, title: job.title });
  }
  console.log(`Created ${created.length} jobs`);
  return created;
}

async function seedCompanyContacts() {
  const items = [
    {
      name: "Aoki Logistics Co., Ltd.",
      email: "seed.aoki@example.com",
      phone_number: "+81 3 1234 0001",
      subject: `${SEED_MARKER} Bulk warehouse hiring inquiry`,
      message:
        "We're opening a new distribution center in Saitama and need to staff ~25 warehouse operators by next quarter. Could we schedule a call to discuss your bulk-hiring services?",
      status: "Open" as const,
    },
    {
      name: "Sakura Hotels Group",
      email: "seed.sakura@example.com",
      phone_number: "+81 75 555 0002",
      subject: `${SEED_MARKER} Multilingual front-desk staff`,
      message:
        "Looking for 6–8 bilingual front-desk associates across our Kyoto and Osaka properties. Strong preference for JP+EN+one other language.",
      status: "Inprogress" as const,
    },
    {
      name: "Meridian Tech KK",
      email: "seed.meridian@example.com",
      phone_number: "+81 3 9876 0003",
      subject: `${SEED_MARKER} Senior backend engineer search`,
      message:
        "Our payments platform is scaling fast. We're after a senior backend engineer (Node/Go) with experience in PCI-DSS environments. Budget is flexible for the right person.",
      status: "Open" as const,
    },
    {
      name: "Hinode Manufacturing",
      email: "seed.hinode@example.com",
      phone_number: "+81 45 222 0004",
      subject: `${SEED_MARKER} Recurring seasonal hiring`,
      message:
        "We do two intake waves per year (April and October). Would love to set up an ongoing partnership so we don't have to scramble each time.",
      status: "Resolved" as const,
    },
    {
      name: "Bluebird English Academy",
      email: "seed.bluebird@example.com",
      phone_number: "+81 92 333 0005",
      subject: `${SEED_MARKER} Native English teachers`,
      message:
        "We're expanding to two new locations in Fukuoka and need 4 native-English teachers with valid work visas. Part-time and full-time both welcome.",
      status: "Open" as const,
    },
    {
      name: "Yamato Foods Corp.",
      email: "seed.yamato@example.com",
      phone_number: "+81 6 7777 0006",
      subject: `${SEED_MARKER} Question about your fee structure`,
      message:
        "Before we kick off a search, could you share your standard placement fee structure and any volume discounts?",
      status: "Closed" as const,
    },
  ];

  for (const it of items) {
    await prisma.contactRequest.create({ data: it });
  }
  console.log(`Created ${items.length} company contact requests`);
}

async function seedCandidateInquiries() {
  // Upload one resume per inquiry, all from the same source PDF
  const inquiries = [
    {
      full_name: "Hannah Tanaka",
      email: "seed.hannah@example.com",
      phone_number: "+81 90 1111 0001",
      date_of_birth: new Date("1996-04-12"),
      gender: "Female" as const,
      current_address: "Setagaya, Tokyo",
      preferred_location: "Tokyo",
      residence_status: "Permanent_Resident" as const,
      japanese_ability: "N1" as const,
      cover_letter:
        "Bilingual marketing professional looking for hybrid roles in central Tokyo. Open to mid-senior positions.",
    },
    {
      full_name: "Ravi Shrestha",
      email: "seed.ravi@example.com",
      phone_number: "+81 90 2222 0002",
      date_of_birth: new Date("1999-09-03"),
      gender: "Male" as const,
      current_address: "Naka-ku, Yokohama",
      preferred_location: "Yokohama",
      residence_status: "Work_Visa" as const,
      japanese_ability: "N3" as const,
      cover_letter:
        "Backend developer with 3 years' experience in Node and Postgres. Eager to move from contract to full-time.",
    },
    {
      full_name: "Linh Nguyen",
      email: "seed.linh@example.com",
      phone_number: "+81 90 3333 0003",
      date_of_birth: new Date("2001-01-21"),
      gender: "Female" as const,
      current_address: "Sumiyoshi, Osaka",
      preferred_location: "Osaka",
      residence_status: "Student_Visa" as const,
      japanese_ability: "N2" as const,
      cover_letter:
        "Final-year hospitality student available from April. Comfortable in Japanese, English, and Vietnamese.",
    },
    {
      full_name: "Daichi Mori",
      email: "seed.daichi@example.com",
      phone_number: "+81 90 4444 0004",
      date_of_birth: new Date("1992-12-08"),
      gender: "Male" as const,
      current_address: "Higashi-ku, Fukuoka",
      preferred_location: "Fukuoka",
      residence_status: "Permanent_Resident" as const,
      japanese_ability: "N1" as const,
      cover_letter:
        "Experienced warehouse lead, forklift-certified, looking for shift-lead roles within 30 min of central Fukuoka.",
    },
    {
      full_name: "Aiko Watanabe",
      email: "seed.aiko@example.com",
      phone_number: "+81 90 5555 0005",
      date_of_birth: new Date("1998-06-30"),
      gender: "Female" as const,
      current_address: "Sakyo-ku, Kyoto",
      preferred_location: "Kyoto",
      residence_status: "Permanent_Resident" as const,
      japanese_ability: "N1" as const,
      cover_letter:
        "Hospitality experience at two Kyoto ryokans. Looking for a step-up into supervisory roles.",
    },
  ];

  for (let i = 0; i < inquiries.length; i++) {
    const it = inquiries[i];
    const resumeKey = `seed-inquiry-${i + 1}.pdf`;
    await uploadIfMissing(`candidate-resume/${resumeKey}`, RESUME_PDF, "application/pdf");
    await prisma.candidateInquiry.create({
      data: { ...it, resume_key: resumeKey, resume_type: "application/pdf" },
    });
  }
  console.log(`Created ${inquiries.length} candidate inquiries`);
}

async function seedApplications(jobs: { id: number; title: string }[]) {
  const applicants = [
    {
      full_name: "Yuki Sato",
      date_of_birth: new Date("1994-03-15"),
      phone_number: "+81 80 1010 0001",
      email: "seed.applicant.yuki@example.com",
      current_address: "Shibuya, Tokyo",
      permanent_address: "Shibuya, Tokyo",
      preferred_location: "Tokyo",
      availability: "Full_time" as const,
      school_college: "Waseda University",
      degree: "BSc Computer Science",
      soft_skills: "Collaborative, detail-oriented, calm under pressure.",
      stage: "Pending" as const,
      status: "Active" as const,
      gender: "Female" as const,
      country: "Japan",
      nearest_station: "Shibuya",
      residence_status: "Permanent_Resident" as const,
      japanese_ability: "N1" as const,
      cover_letter: "I've been following your client roster — would love to contribute.",
      languages: ["English", "Japanese"],
      skills: ["TypeScript", "React"],
    },
    {
      full_name: "Marco Bianchi",
      date_of_birth: new Date("1990-08-22"),
      phone_number: "+81 80 1010 0002",
      email: "seed.applicant.marco@example.com",
      current_address: "Minato, Tokyo",
      permanent_address: "Milan, Italy",
      preferred_location: "Tokyo",
      availability: "Full_time" as const,
      school_college: "Politecnico di Milano",
      degree: "MSc Software Engineering",
      soft_skills: "Curious, decisive, strong written communication.",
      stage: "ApplicantCalled" as const,
      status: "Active" as const,
      gender: "Male" as const,
      country: "Italy",
      nearest_station: "Roppongi",
      residence_status: "Work_Visa" as const,
      japanese_ability: "N4" as const,
      cover_letter: "Open to relocating to Osaka if needed.",
      languages: ["English"],
      skills: ["Node.js", "TypeScript", "AWS"],
    },
    {
      full_name: "Aya Kimura",
      date_of_birth: new Date("1997-11-02"),
      phone_number: "+81 80 1010 0003",
      email: "seed.applicant.aya@example.com",
      current_address: "Higashiyama, Kyoto",
      permanent_address: "Higashiyama, Kyoto",
      preferred_location: "Kyoto",
      availability: "Full_time" as const,
      school_college: "Doshisha University",
      degree: "BA International Studies",
      soft_skills: "Warm, hospitable, quick learner.",
      stage: "InterviewScheduling" as const,
      status: "Active" as const,
      gender: "Female" as const,
      country: "Japan",
      nearest_station: "Gion-Shijo",
      residence_status: "Permanent_Resident" as const,
      japanese_ability: "N1" as const,
      cover_letter: "Two years at a 4-star ryokan; ready for the next step.",
      languages: ["Japanese", "English"],
      skills: ["Customer Service"],
    },
    {
      full_name: "Kenji Tamura",
      date_of_birth: new Date("1985-05-09"),
      phone_number: "+81 80 1010 0004",
      email: "seed.applicant.kenji@example.com",
      current_address: "Naka-ku, Yokohama",
      permanent_address: "Naka-ku, Yokohama",
      preferred_location: "Yokohama",
      availability: "Full_time" as const,
      school_college: "Yokohama Technical College",
      degree: "Diploma in Logistics",
      soft_skills: "Reliable, safety-conscious, team coordinator.",
      stage: "Hired" as const,
      status: "Active" as const,
      gender: "Male" as const,
      country: "Japan",
      nearest_station: "Sakuragicho",
      residence_status: "Permanent_Resident" as const,
      japanese_ability: "N1" as const,
      cover_letter: "Held shift-lead roles for the past 6 years.",
      languages: ["Japanese"],
      skills: ["Forklift Operation"],
    },
    {
      full_name: "Sarah O'Connor",
      date_of_birth: new Date("1995-02-18"),
      phone_number: "+81 80 1010 0005",
      email: "seed.applicant.sarah@example.com",
      current_address: "Hakata, Fukuoka",
      permanent_address: "Dublin, Ireland",
      preferred_location: "Fukuoka",
      availability: "Part_time" as const,
      school_college: "Trinity College Dublin",
      degree: "BA English Literature",
      soft_skills: "Energetic, patient, classroom-tested.",
      stage: "Pending" as const,
      status: "Active" as const,
      gender: "Female" as const,
      country: "Ireland",
      nearest_station: "Hakata",
      residence_status: "Work_Visa" as const,
      japanese_ability: "N5" as const,
      cover_letter: "TEFL-certified with 18 months in Vietnam before this.",
      languages: ["English"],
      skills: ["Teaching"],
    },
    {
      full_name: "Hiro Yamashita",
      date_of_birth: new Date("1988-07-25"),
      phone_number: "+81 80 1010 0006",
      email: "seed.applicant.hiro@example.com",
      current_address: "Chuo-ku, Tokyo",
      permanent_address: "Chuo-ku, Tokyo",
      preferred_location: "Tokyo",
      availability: "Full_time" as const,
      school_college: "Keio University",
      degree: "MBA",
      soft_skills: "Driven closer, strong consultative seller.",
      stage: "InterviewScheduling" as const,
      status: "Active" as const,
      gender: "Male" as const,
      country: "Japan",
      nearest_station: "Ginza",
      residence_status: "Permanent_Resident" as const,
      japanese_ability: "N1" as const,
      cover_letter: "Currently #2 on my team in YoY revenue.",
      languages: ["Japanese", "English"],
      skills: ["Sales Negotiation", "Excel"],
    },
    {
      full_name: "Mei Lin",
      date_of_birth: new Date("2000-10-12"),
      phone_number: "+81 80 1010 0007",
      email: "seed.applicant.mei@example.com",
      current_address: "Minato, Osaka",
      permanent_address: "Taipei, Taiwan",
      preferred_location: "Osaka",
      availability: "Full_time" as const,
      school_college: "National Taiwan University",
      degree: "BSc Information Engineering",
      soft_skills: "Quick learner, methodical, asks great questions.",
      stage: "Pending" as const,
      status: "OnHold" as const,
      gender: "Female" as const,
      country: "Taiwan",
      nearest_station: "Yodoyabashi",
      residence_status: "Work_Visa" as const,
      japanese_ability: "N2" as const,
      cover_letter: "Looking for first full-time role after a 9-month contract.",
      languages: ["English", "Japanese"],
      skills: ["Node.js", "TypeScript"],
    },
    {
      full_name: "Bishal Karki",
      date_of_birth: new Date("1996-12-30"),
      phone_number: "+81 80 1010 0008",
      email: "seed.applicant.bishal@example.com",
      current_address: "Higashi-ku, Fukuoka",
      permanent_address: "Kathmandu, Nepal",
      preferred_location: "Fukuoka",
      availability: "Full_time" as const,
      school_college: "Tribhuvan University",
      degree: "BBA",
      soft_skills: "Resourceful, fast learner, customer-first.",
      stage: "Rejected" as const,
      status: "TalentPool" as const,
      gender: "Male" as const,
      country: "Nepal",
      nearest_station: "Hakata",
      residence_status: "Work_Visa" as const,
      japanese_ability: "N3" as const,
      cover_letter: "Would consider Tokyo for the right role.",
      languages: ["English", "Nepali"],
      skills: ["Customer Service"],
    },
  ];

  let i = 0;
  for (const a of applicants) {
    const job = jobs[i % jobs.length];
    const resumeKey = `seed-app-${i + 1}.pdf`;
    await uploadIfMissing(`resume/${resumeKey}`, RESUME_PDF, "application/pdf");
    const { languages, skills, ...rest } = a;
    await prisma.application.create({
      data: {
        ...rest,
        job: { connect: { id: job.id } },
        resume_key: resumeKey,
        resume_type: "application/pdf",
        languages: { connect: languages.map((name) => ({ name })) },
        technical_skills: { connect: skills.map((name) => ({ name })) },
      },
    });
    i++;
  }
  console.log(`Created ${applicants.length} applications`);
}

async function main() {
  await ensureSuperAdmin();

  const existing = await prisma.job.findFirst({
    where: { title: { startsWith: SEED_MARKER } },
  });
  if (existing) {
    console.log(`\nSeed data already present (found job "${existing.title}").`);
    console.log("Skipping data seed. Delete seeded rows manually if you want to re-seed.");
    await prisma.$disconnect();
    return;
  }

  if (!fs.existsSync(RESUME_PDF)) {
    throw new Error(`Resume PDF not found at ${RESUME_PDF}`);
  }

  console.log("\nSeeding reference data (categories, skills, languages)...");
  await seedReferenceData();

  console.log("\nSeeding jobs (uploading images)...");
  const jobs = await seedJobs();

  console.log("\nSeeding company contact requests...");
  await seedCompanyContacts();

  console.log("\nSeeding candidate inquiries (uploading resumes)...");
  await seedCandidateInquiries();

  console.log("\nSeeding applications (uploading resumes)...");
  await seedApplications(jobs);

  console.log("\nSeed complete.");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

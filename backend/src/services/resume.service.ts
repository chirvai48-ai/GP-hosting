import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  AlignmentType,
} from "docx";
import { prisma } from "../lib/prisma";

const RESIDENCE_LABELS: Record<string, string> = {
  Permanent_Resident: "Permanent Resident",
  Work_Visa: "Work Visa",
  Student_Visa: "Student Visa",
  Spouse_Visa: "Spouse Visa",
  Other: "Other",
};

const CONTRACT_LABELS: Record<string, string> = {
  Full_time: "Full-time",
  Part_time: "Part-time",
  Internship: "Internship",
  Flexible: "Flexible",
};

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true })],
  });
}

function labeledLine(label: string, value: string | null | undefined): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: value && value.length > 0 ? value : "—" }),
    ],
  });
}

export const fetchApplicationForResume = async (id: number) => {
  return prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });
};

export const generateResumeDocx = async (
  app: Awaited<ReturnType<typeof fetchApplicationForResume>>
): Promise<Buffer> => {
  if (!app) throw new Error("Application not found");

  const workingDays = Array.isArray(app.working_days)
    ? (app.working_days as string[]).join(", ")
    : "";

  const contactBits = [app.email, app.phone_number, app.country]
    .filter((v) => v && v.length > 0)
    .join("  ·  ");

  const dob = app.date_of_birth
    ? new Date(app.date_of_birth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const children: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: app.full_name, bold: true, size: 40 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: contactBits,
          color: "555555",
        }),
      ],
    }),
  ];

  if (app.job?.title) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Applying for: ", italics: true }),
          new TextRun({ text: app.job.title, italics: true, bold: true }),
        ],
      })
    );
  }

  children.push(sectionHeading("Personal"));
  if (app.gender) children.push(labeledLine("Gender", app.gender));
  if (dob) children.push(labeledLine("Date of birth", dob));

  children.push(sectionHeading("Work Eligibility"));
  if (app.residence_status)
    children.push(
      labeledLine(
        "Residence status",
        RESIDENCE_LABELS[app.residence_status] ?? app.residence_status
      )
    );
  if (app.japanese_ability)
    children.push(labeledLine("Japanese ability", app.japanese_ability));
  children.push(
    labeledLine(
      "Availability",
      CONTRACT_LABELS[app.availability] ?? app.availability
    )
  );
  children.push(labeledLine("Preferred location", app.preferred_location));
  if (app.nearest_station)
    children.push(labeledLine("Nearest station", app.nearest_station));
  if (workingDays) children.push(labeledLine("Available working days", workingDays));

  children.push(sectionHeading("Education"));
  children.push(labeledLine("School / college", app.school_college));
  children.push(labeledLine("Degree", app.degree));

  children.push(sectionHeading("Skills"));
  children.push(labeledLine("Soft skills", app.soft_skills));

  const doc = new Document({
    creator: "Glowing Partner",
    title: `${app.full_name} resume`,
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
};

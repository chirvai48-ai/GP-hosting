import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { prisma } from "../lib/prisma";

// The resume export fills the client's ヒアリングシート(スキルシート) Excel template
// in place — preserving its exact borders/merges/styling — with the fields we
// collect. Template cells for data we don't store (katakana name, photo, visa
// expiry, postal code, commute time, dated work history, licenses, 所感, etc.)
// are left blank but keep their bordered box.

const GENDER_JA: Record<string, string> = {
  Male: "男性",
  Female: "女性",
  Other: "その他",
};

const RESIDENCE_JA: Record<string, string> = {
  Permanent_Resident: "永住者",
  Work_Visa: "就労ビザ",
  Student_Visa: "留学ビザ",
  Spouse_Visa: "配偶者ビザ",
  Other: "その他",
};

const JLPT_JA: Record<string, string> = {
  N1: "N1",
  N2: "N2",
  N3: "N3",
  N4: "N4",
  N5: "N5",
  None: "日常会話不可",
};

const WEEKDAY_JA: Record<string, string> = {
  Monday: "月曜",
  Tuesday: "火曜",
  Wednesday: "水曜",
  Thursday: "木曜",
  Friday: "金曜",
  Saturday: "土曜",
  Sunday: "日曜",
};

const WEEK_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SHEET_PATH = "xl/worksheets/sheet1.xml";

function resolveTemplate(): string {
  const candidates = [
    path.join(__dirname, "..", "templates", "CV_template.xlsx"),
    path.join(process.cwd(), "dist", "templates", "CV_template.xlsx"),
    path.join(process.cwd(), "src", "templates", "CV_template.xlsx"),
  ];
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found)
    throw new Error(`CV template not found. Looked in: ${candidates.join(", ")}`);
  return found;
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Overwrite an existing cell's value while preserving its style attr (s="N").
// numeric → <v>; otherwise an inline string (supports newlines for wrapped cells).
function setCell(
  xml: string,
  ref: string,
  value: string | number | null | undefined,
  numeric = false
): string {
  const re = new RegExp(`<c r="${ref}"([^>]*?)(/>|>[\\s\\S]*?</c>)`);
  return xml.replace(re, (_full, attrs: string) => {
    const sMatch = /\ss="\d+"/.exec(attrs);
    const s = sMatch ? sMatch[0] : "";
    if (value === null || value === undefined || value === "")
      return `<c r="${ref}"${s}/>`;
    if (numeric) return `<c r="${ref}"${s}><v>${value}</v></c>`;
    return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${xmlEscape(
      String(value)
    )}</t></is></c>`;
  });
}

export const fetchApplicationForResume = async (id: number) =>
  prisma.application.findUnique({
    where: { id },
    include: { job: true, languages: true, technical_skills: true },
  });

export const generateResumeXlsx = async (
  app: Awaited<ReturnType<typeof fetchApplicationForResume>>
): Promise<Buffer> => {
  if (!app) throw new Error("Application not found");

  const zip = await JSZip.loadAsync(fs.readFileSync(resolveTemplate()));
  const sheetFile = zip.file(SHEET_PATH);
  if (!sheetFile) throw new Error("Template sheet1.xml missing");
  let xml = await sheetFile.async("string");

  const today = new Date();
  const dob = app.date_of_birth ? new Date(app.date_of_birth) : null;

  // Date issued (top-right of the sheet)
  xml = setCell(xml, "P2", today.getFullYear(), true);
  xml = setCell(xml, "S2", today.getMonth() + 1, true);
  xml = setCell(xml, "U2", today.getDate(), true);

  // Name — Alphabet row (we don't store katakana, so D4 stays blank)
  xml = setCell(xml, "D3", app.full_name.toUpperCase());

  // Date of birth + age (満 N 歳)
  if (dob) {
    let age = today.getFullYear() - dob.getFullYear();
    const mDiff = today.getMonth() - dob.getMonth();
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < dob.getDate())) age--;
    xml = setCell(xml, "D5", dob.getFullYear(), true);
    xml = setCell(xml, "G5", dob.getMonth() + 1, true);
    xml = setCell(xml, "I5", dob.getDate(), true);
    xml = setCell(xml, "M5", age, true);
  }

  if (app.gender) xml = setCell(xml, "S5", GENDER_JA[app.gender] ?? app.gender);
  if (app.residence_status)
    xml = setCell(
      xml,
      "D6",
      RESIDENCE_JA[app.residence_status] ?? app.residence_status
    );

  xml = setCell(xml, "D9", app.current_address);
  if (app.country) xml = setCell(xml, "U9", app.country);
  if (app.nearest_station) xml = setCell(xml, "D10", app.nearest_station);
  xml = setCell(xml, "D11", app.phone_number);
  xml = setCell(xml, "P11", app.email);

  // Education — single combined row (dated history not collected)
  const edu = [app.school_college, app.degree]
    .filter((v) => v && v.length > 0)
    .join(" — ");
  if (edu) xml = setCell(xml, "D14", edu);

  // Language skills
  const langLines = ["【言語スキル】"];
  if (app.japanese_ability)
    langLines.push(`・日本語：${JLPT_JA[app.japanese_ability] ?? app.japanese_ability}`);
  for (const l of app.languages) langLines.push(`・${l.name}`);
  xml = setCell(xml, "A35", langLines.join("\n"));

  // PC skills + soft skills
  const pcLines = ["【PCスキル】"];
  for (const s of app.technical_skills) pcLines.push(`・${s.name}`);
  if (app.soft_skills) pcLines.push(`・その他：${app.soft_skills}`);
  xml = setCell(xml, "A36", pcLines.join("\n"));

  // Working days — ◯ if available, × otherwise
  const days = new Set(
    Array.isArray(app.working_days) ? (app.working_days as string[]) : []
  );
  const dayStr = WEEK_ORDER.map(
    (d) => `${WEEKDAY_JA[d]}：${days.has(d) ? "◯" : "×"}`
  ).join("　");
  xml = setCell(xml, "A39", dayStr);

  zip.file(SHEET_PATH, xml);
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
};

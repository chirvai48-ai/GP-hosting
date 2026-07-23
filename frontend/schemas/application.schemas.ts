import { z } from "zod";

// NOTE: *_OPTIONS / WORKING_DAYS values are the wire + DB contract (Prisma enums,
// working_days JSON). They MUST stay English. Japanese is display-only via the
// *_LABELS maps below.
export const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;
export const RESIDENCE_STATUS_OPTIONS = [
  "Permanent_Resident",
  "Work_Visa",
  "Student_Visa",
  "Spouse_Visa",
  "Other",
] as const;
export const JAPANESE_ABILITY_OPTIONS = ["N1", "N2", "N3", "N4", "N5", "None"] as const;
export const CONTRACT_OPTIONS = ["Full_time", "Part_time", "Internship", "Flexible"] as const;
export const WORKING_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const workingDayEnum = z.enum(WORKING_DAYS);

export const createApplicationSchema = z.object({
  full_name: z.string().min(1, "氏名を入力してください"),
  date_of_birth: z
    .string()
    .min(1, "生年月日を入力してください")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日付は YYYY-MM-DD（年-月-日）の形式で入力してください"),
  phone_number: z.string().min(1, "電話番号を入力してください"),
  email: z.string().email("正しいメールアドレスの形式で入力してください"),
  gender: z.enum(GENDER_OPTIONS, { message: "性別を選択してください" }),
  facebook_url: z
    .string()
    .url("正しいURLの形式で入力してください")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  country: z.string().min(1, "国籍を入力してください"),
  nearest_station: z.string().min(1, "最寄り駅を入力してください"),
  residence_status: z.enum(RESIDENCE_STATUS_OPTIONS, {
    message: "在留資格を選択してください",
  }),
  japanese_ability: z.enum(JAPANESE_ABILITY_OPTIONS, {
    message: "日本語能力を選択してください",
  }),
  working_days: z.array(workingDayEnum).min(1, "勤務可能な曜日を1日以上選択してください"),
  current_address: z.string().min(1, "現住所を入力してください"),
  permanent_address: z.string().min(1, "住所を入力してください"),
  preferred_location: z.string().min(1, "勤務希望地を入力してください"),
  availability: z.enum(CONTRACT_OPTIONS, { message: "就業可能時期を選択してください" }),
  school_college: z.string().min(1, "学校名を入力してください"),
  degree: z.string().min(1, "学位・専攻を入力してください"),
  soft_skills: z.string().min(1, "特徴・強み（ソフトスキル）を入力してください"),
  cover_letter: z.string().optional(),
  resume_key: z.string().min(1, "履歴書ファイルを添付してください"),
  resume_type: z.string().min(1, "履歴書のファイル形式が正しくありません"),
  job_id: z.number().int().positive(),
});

export type CreateApplicationForm = z.infer<typeof createApplicationSchema>;

export const APPLICATION_STAGE_OPTIONS = [
  "Pending",
  "ApplicantCalled",
  "InterviewScheduling",
  "Hired",
  "Rejected",
] as const;
export const APPLICATION_STATUS_OPTIONS = [
  "Active",
  "OnHold",
  "TalentPool",
] as const;

export const editApplicationSchema = createApplicationSchema
  .omit({ resume_key: true, resume_type: true, job_id: true })
  .extend({
    stage: z.enum(APPLICATION_STAGE_OPTIONS),
    status: z.enum(APPLICATION_STATUS_OPTIONS),
  })
  .partial();

export type EditApplicationForm = z.infer<typeof editApplicationSchema>;

export const GENDER_LABELS: Record<(typeof GENDER_OPTIONS)[number], string> = {
  Male: "男性",
  Female: "女性",
  Other: "その他",
};

export const JAPANESE_ABILITY_LABELS: Record<
  (typeof JAPANESE_ABILITY_OPTIONS)[number],
  string
> = {
  N1: "N1",
  N2: "N2",
  N3: "N3",
  N4: "N4",
  N5: "N5",
  None: "日本語学習経験なし・日常会話不可",
};

export const WORKING_DAY_LABELS: Record<(typeof WORKING_DAYS)[number], string> = {
  Monday: "月曜日",
  Tuesday: "火曜日",
  Wednesday: "水曜日",
  Thursday: "木曜日",
  Friday: "金曜日",
  Saturday: "土曜日",
  Sunday: "日曜日",
};

export const RESIDENCE_STATUS_LABELS: Record<
  (typeof RESIDENCE_STATUS_OPTIONS)[number],
  string
> = {
  Permanent_Resident: "永住者",
  Work_Visa: "就労ビザ",
  Student_Visa: "留学ビザ",
  Spouse_Visa: "配偶者ビザ",
  Other: "その他",
};

export const CONTRACT_LABELS: Record<(typeof CONTRACT_OPTIONS)[number], string> = {
  Full_time: "正社員",
  Part_time: "パート・アルバイト",
  Internship: "インターンシップ",
  Flexible: "応相談",
};

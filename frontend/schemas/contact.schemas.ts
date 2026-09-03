import { z } from "zod";
import {
  GENDER_OPTIONS,
  RESIDENCE_STATUS_OPTIONS,
  JAPANESE_ABILITY_OPTIONS,
} from "./application.schemas";

export const createCompanyInquirySchema = z.object({
  name: z.string().min(1, "お名前（会社名・担当者氏名）を入力してください"),
  email: z.string().email("正しいメールアドレスの形式で入力してください"),
  phone_number: z.string().min(1, "電話番号を入力してください"),
  subject: z.string().min(1, "件名を選択または入力してください").max(255, "件名は255文字以内で入力してください"),
  message: z.string().min(1, "お問い合わせ内容を入力してください"),
});

export type CreateCompanyInquiryForm = z.infer<typeof createCompanyInquirySchema>;

export const createCandidateInquirySchema = z.object({
  full_name: z.string().min(1, "氏名を入力してください"),
  email: z.string().email("正しいメールアドレスの形式で入力してください"),
  phone_number: z.string().min(1, "電話番号を入力してください"),
  date_of_birth: z
    .string()
    .min(1, "生年月日を入力してください")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日付は YYYY-MM-DD（年-月-日）の形式で入力してください"),
  gender: z.enum(GENDER_OPTIONS).optional(),
  current_address: z.string().min(1, "現住所を入力してください"),
  preferred_location: z.string().min(1, "勤務希望地を入力してください"),
  residence_status: z.enum(RESIDENCE_STATUS_OPTIONS).optional(),
  japanese_ability: z.enum(JAPANESE_ABILITY_OPTIONS).optional(),
  cover_letter: z.string().optional(),
  resume_key: z.string().optional(),
  resume_type: z.string().optional(),
});

export type CreateCandidateInquiryForm = z.infer<typeof createCandidateInquirySchema>;

export const CANDIDATE_STEP_FIELDS: Record<1 | 2, (keyof CreateCandidateInquiryForm)[]> = {
  1: ["full_name", "email", "phone_number", "date_of_birth", "gender", "current_address"],
  2: ["preferred_location", "residence_status", "japanese_ability", "cover_letter", "resume_key", "resume_type"],
};

import { z } from "zod";
import {
  GENDER_OPTIONS,
  RESIDENCE_STATUS_OPTIONS,
  JAPANESE_ABILITY_OPTIONS,
} from "./application.schemas";

export const createCompanyInquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone_number: z.string().min(1, "Phone number is required"),
  subject: z.string().min(1, "Subject is required").max(255, "Subject must be 255 characters or fewer"),
  message: z.string().min(1, "Message is required"),
});

export type CreateCompanyInquiryForm = z.infer<typeof createCompanyInquirySchema>;

export const createCandidateInquirySchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone_number: z.string().min(1, "Phone number is required"),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  gender: z.enum(GENDER_OPTIONS).optional(),
  current_address: z.string().min(1, "Current address is required"),
  preferred_location: z.string().min(1, "Preferred location is required"),
  residence_status: z.enum(RESIDENCE_STATUS_OPTIONS).optional(),
  japanese_ability: z.enum(JAPANESE_ABILITY_OPTIONS).optional(),
  cover_letter: z.string().optional(),
  resume_key: z.string().min(1, "Resume is required"),
  resume_type: z.string().min(1),
});

export type CreateCandidateInquiryForm = z.infer<typeof createCandidateInquirySchema>;

export const CANDIDATE_STEP_FIELDS: Record<1 | 2, (keyof CreateCandidateInquiryForm)[]> = {
  1: ["full_name", "email", "phone_number", "date_of_birth", "gender", "current_address"],
  2: ["preferred_location", "residence_status", "japanese_ability", "cover_letter", "resume_key", "resume_type"],
};

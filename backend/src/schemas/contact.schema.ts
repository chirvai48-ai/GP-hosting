import { z } from "zod";
import {
  Gender,
  ResidenceStatus,
  JapaneseAbility,
  Status,
  CandidateInquiryState,
} from "../generated/prisma/enums";

export const createCompanyInquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone_number: z.string().min(1),
  subject: z.string().min(1).max(255),
  message: z.string().min(1),
});

export type createCompanyInquiry = z.infer<typeof createCompanyInquirySchema>;

export const updateCompanyInquirySchema = createCompanyInquirySchema
  .extend({
    status: z.enum(Status),
  })
  .partial();

export type updateCompanyInquiry = z.infer<typeof updateCompanyInquirySchema>;

const candidateInquiryBaseSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  phone_number: z.string().min(1),
  date_of_birth: z.string().date(),
  gender: z.enum(Gender),
  current_address: z.string().min(1),
  preferred_location: z.string().min(1),
  residence_status: z.enum(ResidenceStatus),
  japanese_ability: z.enum(JapaneseAbility),
  cover_letter: z.string().optional(),
  // Frontend sends "" (empty default) when no résumé is attached; coerce to
  // undefined so it doesn't hit the unique constraint on resume_key.
  resume_key: z.string().min(1).optional().or(z.literal("").transform(() => undefined)),
  resume_type: z.string().min(1).optional().or(z.literal("").transform(() => undefined)),
});

export const createCandidateInquirySchema = candidateInquiryBaseSchema.refine(
  (data) => Boolean(data.resume_key) === Boolean(data.resume_type),
  {
    message: "履歴書の情報が不完全です。 / Résumé information is incomplete.",
    path: ["resume_key"],
  }
);

export type createCandidateInquiry = z.infer<typeof createCandidateInquirySchema>;

export const updateCandidateInquirySchema = candidateInquiryBaseSchema
  .omit({ resume_key: true, resume_type: true })
  .extend({
    state: z.enum(CandidateInquiryState),
    starred: z.boolean(),
  })
  .partial();

export type updateCandidateInquiry = z.infer<typeof updateCandidateInquirySchema>;

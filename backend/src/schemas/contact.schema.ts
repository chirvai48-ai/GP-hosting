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

export const createCandidateInquirySchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  phone_number: z.string().min(1),
  date_of_birth: z.string().date(),
  gender: z.enum(Gender).optional(),
  current_address: z.string().min(1),
  preferred_location: z.string().min(1),
  residence_status: z.enum(ResidenceStatus).optional(),
  japanese_ability: z.enum(JapaneseAbility).optional(),
  cover_letter: z.string().optional(),
  resume_key: z.string().min(1),
  resume_type: z.string().min(1),
});

export type createCandidateInquiry = z.infer<typeof createCandidateInquirySchema>;

export const updateCandidateInquirySchema = createCandidateInquirySchema
  .omit({ resume_key: true, resume_type: true })
  .extend({
    state: z.enum(CandidateInquiryState),
  })
  .partial();

export type updateCandidateInquiry = z.infer<typeof updateCandidateInquirySchema>;

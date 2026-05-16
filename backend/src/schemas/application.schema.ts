import { z } from "zod";
import { Gender, ResidenceStatus, JapaneseAbility, Contract } from "../generated/prisma/enums";

const workingDayEnum = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

export const createApplicationSchema = z.object({
  full_name: z.string().min(1),
  date_of_birth: z.string().date(),
  phone_number: z.string().min(1),
  email: z.string().email(),
  gender: z.enum(Gender),
  facebook_url: z.string().url().optional(),
  country: z.string().min(1),
  nearest_station: z.string().min(1),
  residence_status: z.enum(ResidenceStatus),
  japanese_ability: z.enum(JapaneseAbility),
  working_days: z.array(workingDayEnum).min(1),
  current_address: z.string().min(1),
  permanent_address: z.string().min(1),
  preferred_location: z.string().min(1),
  availability: z.enum(Contract),
  school_college: z.string().min(1),
  degree: z.string().min(1),
  soft_skills: z.string().min(1),
  cover_letter: z.string().optional(),
  resume_key: z.string().min(1),
  resume_type: z.string().min(1),
  job_id: z.number().int().positive(),
});

export type createApplication = z.infer<typeof createApplicationSchema>;

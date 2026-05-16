import { z } from "zod";

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
  full_name: z.string().min(1, "Full name is required"),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.string().email("Enter a valid email"),
  gender: z.enum(GENDER_OPTIONS, { message: "Select a gender" }),
  facebook_url: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  country: z.string().min(1, "Country is required"),
  nearest_station: z.string().min(1, "Nearest station is required"),
  residence_status: z.enum(RESIDENCE_STATUS_OPTIONS, {
    message: "Select your residence status",
  }),
  japanese_ability: z.enum(JAPANESE_ABILITY_OPTIONS, {
    message: "Select your Japanese ability",
  }),
  working_days: z.array(workingDayEnum).min(1, "Pick at least one day"),
  current_address: z.string().min(1, "Current address is required"),
  permanent_address: z.string().min(1, "Permanent address is required"),
  preferred_location: z.string().min(1, "Preferred location is required"),
  availability: z.enum(CONTRACT_OPTIONS, { message: "Select your availability" }),
  school_college: z.string().min(1, "School or college is required"),
  degree: z.string().min(1, "Degree is required"),
  soft_skills: z.string().min(1, "Soft skills are required"),
  cover_letter: z.string().optional(),
  resume_key: z.string().min(1, "Resume is required"),
  resume_type: z.string().min(1, "Resume type is required"),
  job_id: z.number().int().positive(),
});

export type CreateApplicationForm = z.infer<typeof createApplicationSchema>;

export const APPLICATION_STAGE_OPTIONS = [
  "Pending",
  "ApplicantCalled",
  "InterviewScheduling",
  "Hired",
] as const;
export const APPLICATION_STATUS_OPTIONS = [
  "Active",
  "OnHold",
  "TalentPool",
  "Rejected",
] as const;

export const editApplicationSchema = createApplicationSchema
  .omit({ resume_key: true, resume_type: true, job_id: true })
  .extend({
    stage: z.enum(APPLICATION_STAGE_OPTIONS),
    status: z.enum(APPLICATION_STATUS_OPTIONS),
  })
  .partial();

export type EditApplicationForm = z.infer<typeof editApplicationSchema>;

export const RESIDENCE_STATUS_LABELS: Record<
  (typeof RESIDENCE_STATUS_OPTIONS)[number],
  string
> = {
  Permanent_Resident: "Permanent Resident",
  Work_Visa: "Work Visa",
  Student_Visa: "Student Visa",
  Spouse_Visa: "Spouse Visa",
  Other: "Other",
};

export const CONTRACT_LABELS: Record<(typeof CONTRACT_OPTIONS)[number], string> = {
  Full_time: "Full-time",
  Part_time: "Part-time",
  Internship: "Internship",
  Flexible: "Flexible",
};

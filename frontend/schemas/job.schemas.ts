import * as z from "zod";

const baseJobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  salary_min: z.coerce
    .number({ error: "Enter a valid number" })
    .int()
    .nonnegative("Minimum salary cannot be negative"),
  salary_max: z.coerce
    .number({ error: "Enter a valid number" })
    .int()
    .nonnegative("Maximum salary cannot be negative"),
  currency: z.string().default("YEN"),
  location: z.string().min(1, "Please enter a location"),
  experience: z.coerce
    .number({ error: "Select an experience level" })
    .int()
    .min(-1),
  contract: z.enum(["Full_time", "Part_time", "Internship", "Flexible"], {
    error: "Please select a contract type",
  }),
  shift_start: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Enter a valid start time (HH:MM)"),
  shift_end: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Enter a valid end time (HH:MM)"),
  workdays: z.coerce
    .number({ error: "Enter number of workdays" })
    .int()
    .min(1, "Minimum 1 workday required")
    .max(7, "Cannot exceed 7 workdays"),
  gender: z.string().min(1, "Please select a gender"),
  benefits: z.string().min(1, "Please describe the benefits"),
  requirements: z.string().min(1, "Please list the requirements"),
  application_method: z.string().min(1, "Please specify how to apply"),
  job_category: z.string().min(1, "Please enter a job category"),
  languages: z.array(z.string().min(1)).min(1, "Add at least one language"),
  technical_skills: z
    .array(z.string().min(1))
    .min(1, "Add at least one technical skill"),
  soft_skills: z.string().min(1, "Please list soft skills"),
  status: z.enum(["Draft", "Published", "Closed", "Archived"], {
    error: "Please select a status",
  }),
  image_key: z.string().min(1, "Please upload an image"),
  image_type: z.string().min(1, "Image type is missing"),
});

export const createJobSchema = baseJobSchema.refine(
  (data) => {
    if (data.salary_min != null && data.salary_max != null) {
      return data.salary_max >= data.salary_min;
    }
    return true;
  },
  {
    message: "Max salary must be greater than or equal to min salary",
    path: ["salary_max"],
  },
);

export type CreateJobForm = z.input<typeof createJobSchema>;

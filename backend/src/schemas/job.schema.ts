import * as z from "zod";
import { Contract, JobStatus } from "../generated/prisma/enums";

const baseJobSchema = z
  .object({
    title: z.string(),
    salary_min: z.number().int().nonnegative(),
    salary_max: z.number().int().nonnegative(),
    currency: z.string().default("YEN"),

    location: z.string().min(1),

    experience: z.number().int().min(-1),

    contract: z.enum(Contract),

    shift_start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    shift_end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),

    //from frontend this comes as string which we need to convert later into mysql time format

    workdays: z.number().int().min(1).max(7),

    gender: z.string(),

    benefits: z.string(),
    requirements: z.string(),

    application_method: z.string(),

    job_category: z.string().min(1),

    languages: z.array(z.string().min(1)),
    technical_skills: z.array(z.string().min(1)),

    soft_skills: z.string(),

    status: z.enum(JobStatus),

    image_key : z.string(),

    image_type : z.string()
  })
  export const createJobSchema = baseJobSchema.refine(
    (data) => {
      if (data.salary_min != null && data.salary_max != null) {
        return data.salary_max >= data.salary_min;
      }
      return true;
    },
    {
      message: "salary_max must be greater than or equal to salary_min",
      path: ["salary_max"],
    },
  );

const baseUpdateJobSchema = baseJobSchema.partial()
export const updateJobSchema = baseUpdateJobSchema.refine(
  (data) => {
    if (data.salary_max !== undefined && data.salary_min !== undefined) {
      return data.salary_max >= data.salary_min;
    }
    return true;
  },
  {
    message: "salary_max must be greater than or equal to salary_min",
    path: ["salary_max"],
  },
);

export type createJob = z.infer<typeof createJobSchema>;
export type updateJob = z.infer<typeof updateJobSchema>;

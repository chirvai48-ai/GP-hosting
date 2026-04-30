type JobCategory = {
  id: number;
  name: string;
};

type Language = {
  id: number;
  name: string;
};

type TechnicalSkill = {
  id: number;
  name: string;
};

export type Job = {
  id: number;
  title: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  location: string;
  experience: number;
  contract: "Full_time" | "Part_time" | "Contract" | string;
  shift_start: string; // ISO string
  shift_end: string;
  workdays: number;
  gender: string;
  benefits: string;
  requirements: string;
  application_method: string;
  job_category_id: number;
  created_at: string;
  updated_at: string;
  soft_skills: string;
  status: "Draft" | "Published" | string;
  image_key: string;
  image_type: string;

  job_category: JobCategory;
  languages: Language[];
  technical_skills: TechnicalSkill[];
};

export type JobsResponse = {
  message: string;
  data: Job[];
};
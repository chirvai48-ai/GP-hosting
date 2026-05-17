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
  image_url?: string;

  job_category: JobCategory;
  languages: Language[];
  technical_skills: TechnicalSkill[];
  _count?: { applications: number };
};

export type JobsResponse = {
  message: string;
  data: Job[];
};


export type NewsStatus = "published" | "closed";

export type Role = "Admin" | "Editor" | "User";

export type Admin = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  emailVerified: boolean;
  updatedAt: string;
  image: string | null;
};

export type News = {
  id: number;
  title: string;
  body: string;
  summary: string;
  published_at: string;
  updated_at: string;
  admin_id: string | null;
  status: NewsStatus;
  admin: Admin | null;
  image_key: string;
  image_type: string;
  image_url?: string;
};

export type NewsResponse = {
  message: string;
  data: News[];
};

export type ApplicationStatus = "Active" | "OnHold" | "TalentPool";
export type ApplicationStage =
  | "Pending"
  | "ApplicantCalled"
  | "InterviewScheduling"
  | "Hired"
  | "Rejected";
export type Gender = "Male" | "Female" | "Other";
export type ResidenceStatus =
  | "Permanent_Resident"
  | "Work_Visa"
  | "Student_Visa"
  | "Spouse_Visa"
  | "Other";
export type JapaneseAbility = "N1" | "N2" | "N3" | "N4" | "N5" | "None";
export type Contract = "Full_time" | "Part_time" | "Internship" | "Flexible";

export type Application = {
  id: number;
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  gender: Gender | null;
  facebook_url: string | null;
  country: string | null;
  nearest_station: string | null;
  residence_status: ResidenceStatus | null;
  japanese_ability: JapaneseAbility | null;
  working_days: string[] | null;
  current_address: string;
  permanent_address: string;
  preferred_location: string;
  availability: Contract;
  school_college: string;
  degree: string;
  soft_skills: string;
  cover_letter: string | null;
  resume_key: string;
  resume_type: string | null;
  resume_url?: string;
  job_id: number;
  job?: Job;
  stage: ApplicationStage;
  status: ApplicationStatus;
  created_at: string;
  updated_at?: string;
};

export type ApplicationsResponse = {
  message: string;
  data: Application[];
};

export type ApplicationResponse = {
  message: string;
  data: Application;
};

export type NoteAuthor = {
  id: string;
  name: string;
  email: string;
};

export type Note = {
  id: number;
  text: string;
  application_id: number;
  created_by_admin_id: string;
  last_edited_by_admin_id: string;
  created_by_admin: NoteAuthor;
  last_edited_by_admin: NoteAuthor;
  created_at: string;
  updated_at: string;
};

export type NotesResponse = {
  message: string;
  data: Note[];
};
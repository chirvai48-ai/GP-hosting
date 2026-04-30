import { KeyboardEvent } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useState } from "react";
import { Button } from "@mui/material";
import { Plus } from "lucide-react";
const CURRENCIES = ["YEN", "USD", "EUR", "GBP", "SGD"];

const EXPERIENCE_OPTIONS = [
  { label: "Any", value: -1 },
  { label: "Entry level", value: 0 },
  { label: "0–1 years", value: 1 },
  { label: "1–2 years", value: 2 },
  { label: "2–3 years", value: 3 },
  { label: "3–4 years", value: 4 },
  { label: "5+ years", value: 5 },
];

const CONTRACT_OPTIONS = ["Full_time", "Part_time", "Internship", "Flexible"];

const inputCls =
  "w-full bg-[var(--color-container-low)] border-b border-b-[#c0cbc9] rounded-t-sm px-3 py-2 font-[var(--font-body)] text-base text-[var(--color-on-surface)] outline-none";
const labelCls =
  "text-[0.7rem] tracking-widest uppercase text-[var(--color-on-surface-variant)] font-medium";
const tagBoxCls =
  "flex flex-wrap gap-1.5 items-center min-h-[42px] bg-[var(--color-container-low)] border-b-2 border-b-[#c0cbc9] rounded-t-sm px-2 py-1.5 focus-within:border-b-[var(--color-primary)]";

export function JobPostingForm1() {
  const { register,formState:{errors}} = useFormContext();
  return (
    <div className="max-w-xl mx-auto p-8 bg-[var(--color-surface)] font-[var(--font-body)]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Job Title</label>
          <input
            className={inputCls}
            placeholder="e.g House Keeping"
            {...register("title")}
          />
          <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.title?.message as string}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Currency</label>
            <select className={inputCls} {...register("currency")}>
              {CURRENCIES.map((c) => (
                <option value={c} key={c}>
                  {c}
                </option>
              ))}
            </select>
            <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.currency?.message as string}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Min Salary</label>
            <input
              className={inputCls}
              type="number"
              {...register("salary_min")}
            />
            <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.salary_min?.message as string}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Max Salary</label>
            <input
              className={inputCls}
              type="number"
              {...register("salary_max")}
            />
            <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.salary_max?.message as string}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Location</label>
            <input
              className={inputCls}
              placeholder="e.g.Tokyo"
              {...register("location")}
            />
            <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.location?.message as string}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Experience</label>
            <select className={inputCls} {...register("experience")}>
              {EXPERIENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
             <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.experience?.message as string}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelCls}>Contract</label>
          <select
            className={inputCls}
            defaultValue="Full_time"
            {...register("contract")}
          >
            {CONTRACT_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c.replace("_", " ")}
              </option>
            ))}
          </select>
          <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.contract?.message as string}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Job Category</label>
          <input
            className={inputCls}
            placeholder="e.g.Cleaning"
            {...register("job_category")}
          />
          <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.job_category?.message as string}</p>
        </div>
      </div>
    </div>
  );
}

const GENDER_OPTIONS = ["Male", "Female", "Other"];

export function JobPostingForm2() {
  const { register,formState:{errors}  } = useFormContext();
  return (
    <div className="max-w-xl mx-auto p-8 bg-[var(--color-surface)] font-[var(--font-body)]">
      <div className="flex flex-col gap-5">
        {/* Shift Start & End */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Shift Start</label>
            <input
              className={inputCls}
              type="time"
              defaultValue="09:00"
              {...register("shift_start")}
            />
            <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.shift_start?.message as string}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Shift End</label>
            <input
              className={inputCls}
              type="time"
              defaultValue="17:00"
              {...register("shift_end")}
            />
            <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.shift_end?.message as string}</p>
          </div>
        </div>

        {/* Workdays & Gender */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Workdays</label>
            <input
              className={inputCls}
              type="number"
              placeholder="e.g. 5"
              min={1}
              max={7}
              {...register("workdays")}
            />
            <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.workdays?.message as string}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Gender</label>
            <select className={inputCls} {...register("gender")}>
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g.toLowerCase()}>
                  {g}
                </option>
              ))}
            </select>
            <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.gender?.message as string}</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Benefits</label>
          <textarea
            className={`${inputCls} resize-y min-h-[80px]`}
            placeholder="e.g. Health insurance, paid leave, meals…"
            {...register("benefits")}
          />
          <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.benefits?.message as string}</p>
        </div>

        {/* Requirements */}
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Requirements</label>
          <textarea
            className={`${inputCls} resize-y min-h-[80px]`}
            placeholder="e.g. 2+ years experience, valid work permit…"
            {...register("requirements")}
          />
          <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.requirements?.message as string}</p>
        </div>
      </div>
    </div>
  );
}

const STATUS_OPTIONS = ["Draft", "Published", "Closed", "Archived"];

function TagInput({
  placeholder,
  value = [],
  onChange,
}: {
  placeholder: string;
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function addTag() {
    const val = input.trim().replace(/,$/, "");
    if (val && !value.includes(val)) onChange([...value, val]);
    setInput("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && input === "") onChange(value.slice(0, -1));
  }

  return (
    <div className={tagBoxCls}>
      {(value || []).map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-[#c5dbd8] text-[#1a3a36] text-xs font-medium rounded px-2 py-0.5"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="text-[#4a7a74] hover:text-red-500 leading-none"
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[80px] bg-transparent outline-none text-sm font-[var(--font-body)] text-[var(--color-on-surface)] px-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
      />
    </div>
  );
}

function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: File) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <label className="relative flex flex-col items-center justify-center gap-1 border-2 border-dashed border-[#b8ccc9] rounded-md p-6 cursor-pointer hover:border-[var(--color-primary)] hover:bg-[#e4eeec] transition-colors text-center">
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onChange(file);
          setPreview(URL.createObjectURL(file));
        }}
      />
      {preview ? (
        <img src={preview} className="max-h-36 rounded object-cover" />
      ) : (
        <>
          <span className="text-2xl">🖼️</span>
          <span className="text-sm text-[var(--color-on-surface-variant)] font-medium">
            Click or drag to upload
          </span>
          <span className="text-xs text-[#9ab5b2]">
            PNG, JPG, WEBP up to 5MB
          </span>
        </>
      )}
    </label>
  );
}

// --- Main Form ---
export function JobPostingForm3() {
  const { register, control, setValue,formState:{errors} } = useFormContext();
  return (
    <div className="max-w-xl mx-auto p-8 bg-[var(--color-surface)] font-[var(--font-body)]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Application Method</label>
          <textarea
            className={`${inputCls} resize-y min-h-[72px] rounded-t-sm`}
            placeholder="e.g. Email to hr@company.com"
            {...register("application_method")}
          />
          <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.application_method?.message as string}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Languages</label>
            <Controller
              name="languages"
              control={control}
              render={({ field }) => (
                <TagInput
                  placeholder="Type & press Enter…"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.languages?.message as string}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Technical Skills</label>
            <Controller
              name="technical_skills"
              control={control}
              render={({ field }) => (
                <TagInput
                  placeholder="Type & press Enter…"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.technical_skills?.message as string}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelCls}>Soft Skills</label>
          <textarea
            className={`${inputCls} resize-y min-h-[72px] rounded-t-sm`}
            placeholder="e.g. Communication, teamwork…"
            {...register("soft_skills")}
          />
          <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.soft_skills?.message as string}</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelCls}>Status</label>
          <select
            className={inputCls}
            defaultValue="Draft"
            {...register("status")}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.status?.message as string}</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelCls}>Image</label>
          <Controller
            name="image_key"
            control={control}
            render={({ field }) => (
              <ImageUpload
                value={field.value}
                onChange={(file: File) => {
                  field.onChange(file.name);
                  setValue("image_type", file.type);
                }}
              />
            )}
          />
          <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.image_key?.message as string}</p>
          <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">{errors.image_type?.message as string}</p>
        </div>

        <Button
          variant="outlined"
          className="border-primary"
          size="small"
          startIcon={<Plus />}
          sx={{ color: "#c9a84c", borderColor: "#c9a84c" }}
          type="submit"
        >
          Create Job
        </Button>
      </div>
    </div>
  );
}
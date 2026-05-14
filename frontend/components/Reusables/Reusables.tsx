import { useState } from "react";
import { KeyboardEvent } from "react";
const tagBoxCls =
  "flex flex-wrap gap-1.5 items-center min-h-[42px] bg-[var(--color-container-low)] border-b-2 border-b-[#c0cbc9] rounded-t-sm px-2 py-1.5 focus-within:border-b-[var(--color-primary)]";

export function TagInput({
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
      {(value || []).map((tag,index) => (
        <span
          key={index}
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

export function ImageUpload({
  value,
  onChange,
  type="default"
}: {
  value: string;
  onChange: (value: File) => void;
  type?:string
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

          {type === "default"? <span className="text-xs text-[#9ab5b2]">
            PNG, JPG, WEBP up to 5MB
          </span>: <></>}
        </>
      )}
    </label>
  );
}


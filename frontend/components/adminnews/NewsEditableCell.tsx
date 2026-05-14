"use client";
import { flexRender, Cell } from "@tanstack/react-table";
import { ImageUpload } from "../Reusables/Reusables";
import type { News } from "@/types/table";

interface Props {
  cell: Cell<News, unknown>;
  isEditing: boolean;
  rowEdit: Partial<News>;
  onFieldChange: (field: keyof News, value: unknown) => void;
  onFileChange?: (file: File) => void;
}

function NewsEditableCell({ cell, isEditing, rowEdit, onFieldChange, onFileChange }: Props) {
  const meta = cell.column.columnDef.meta as
    | { editable?: boolean; inputType?: string; options?: string[] }
    | undefined;

  if (!isEditing || !meta?.editable) {
    return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>;
  }

  const field = cell.column.id as keyof News;
  const currentValue = rowEdit[field] ?? cell.getValue();

  const inputClass =
    "w-full text-sm px-2 py-1 rounded border border-[var(--color-container-low)] bg-white text-[var(--color-on-surface)] font-[var(--font-label)] focus:outline-none focus:border-[var(--color-primary)] transition-colors";

  switch (meta.inputType) {
    case "text":
      return (
        <input
          type="text"
          value={currentValue as string}
          onChange={(e) => onFieldChange(field, e.target.value)}
          className={inputClass}
        />
      );
    case "textarea":
      return (
        <textarea
          value={currentValue as string}
          rows={3}
          onChange={(e) => onFieldChange(field, e.target.value)}
          className={`${inputClass} resize-y`}
        />
      );
    case "select":
      return (
        <select
          value={currentValue as string}
          onChange={(e) => onFieldChange(field, e.target.value)}
          className={inputClass}
        >
          {meta.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
      case "image":
        return (
          <ImageUpload
            value={currentValue as string}
            onChange={(val: File) => {
              onFieldChange(field, val.name);
              onFieldChange("image_type", val.type);
              onFileChange?.(val);
            }}
            type="table"
          />
        );
    default:
      return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>;
  }
}

export default NewsEditableCell;

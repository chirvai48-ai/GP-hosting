import { flexRender, Cell } from "@tanstack/react-table";
import { Job } from "@/types/table";
import { TagInput,ImageUpload } from "../Reusables/Reusables";
interface Props {
  cell: Cell<Job, unknown>;
  isEditing: boolean;
  rowEdit: Partial<Job>;
  onFieldChange: (field: keyof Job, value: unknown) => void;
}

function EditableCell({ cell, isEditing, rowEdit, onFieldChange }: Props) {
  const meta = cell.column.columnDef.meta as
    | { editable?: boolean; inputType?: string; options?: string[] }
    | undefined;

  const toTagOptions = (
    items: { id: number; name: string }[],
  ):string[] => {
    return items.map((item) => item.name);
  }

  const fromTagOptions = (items:string[]):{ id: number; name: string }[] => {
    return items.map((item,index) => {
      return{
        id:index,
        name:item
      }
    })
  }

  if (!isEditing || !meta?.editable) {
    return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>;
  }

  const field = cell.column.id as keyof Job;
  const currentValue = rowEdit[field] ?? cell.getValue();

  const inputClass = "w-full text-sm px-2 py-1 rounded border border-[var(--color-container-low)] bg-white text-[var(--color-on-surface)] font-[var(--font-label)] focus:outline-none focus:border-[var(--color-primary)] transition-colors";

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

    case "number":
      return (
        <input
          type="number"
          value={currentValue as number}
          onChange={(e) => onFieldChange(field, Number(e.target.value))}
          className={inputClass}
        />
      );

    case "textarea":
      return (
        <textarea
          value={currentValue as string}
          rows={2}
          onChange={(e) => onFieldChange(field, e.target.value)}
          className={`${inputClass} resize-y`}
        />
      );

    case "time":
      // API returns "1970-01-01T09:00:00.000Z" — extract HH:MM for the input
      const timeValue = new Date(currentValue as string)
        .toISOString()
        .substring(11, 16); // "09:00"

      return (
        <input
          type="time"
          value={timeValue}
          onChange={(e) => {
            // Convert "09:00" back to the full ISO string the API expects
            const iso = `${e.target.value}`;
            onFieldChange(field, iso);
          }}
          className={inputClass}
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

    case "min_salary":
      return (
        <div className="flex gap-1 items-center">
          <input
            type="number"
            value={(rowEdit.salary_min ?? 0) as number}
            onChange={(e) => onFieldChange("salary_min", Number(e.target.value))}
            className={inputClass}
            placeholder="Min"
          />
        </div>
      );

    case "max_salary":
      return (
        <div className="flex gap-1 items-center">
          <input
            type="number"
            value={(rowEdit.salary_max ?? 0) as number}
            onChange={(e) => onFieldChange("salary_max", Number(e.target.value))}
            className={inputClass}
            placeholder="Max"
          />
        </div>
      );

    case "multi_select":
      const multiValue = toTagOptions(
        (currentValue as { id: number; name: string }[]) ?? [],
      );

      return (
        <TagInput placeholder="Type and press enter" value={multiValue} onChange={(val:string[]) => {
          onFieldChange(field,fromTagOptions(val))
        }} />
      );
    case "image":
        return(
          <ImageUpload value={currentValue as string} onChange={(val:File) => {
            onFieldChange(field,val.name)
            onFieldChange(cell.row.original.image_type as keyof Job,val.type)
          }} type="table" />
        )
      
  }
}

export default EditableCell;
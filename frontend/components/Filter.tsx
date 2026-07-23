import type { Filterstype } from "@/types/filters";
type Props = {
  filters: Filterstype;
  onChange: (updated: Filterstype) => void; //because setter function gets updated filters type but returns nothing
};

type Item = { id: string; label: string };

const scheduleItems: Item[] = [
  { id: "full_time", label: "正社員" },
  { id: "part_time", label: "パート・アルバイト" },
  { id: "contract", label: "契約社員・派遣社員" },
  { id: "internship", label: "インターンシップ" },
];

const employmentItems: Item[] = [
  { id: "sixdays", label: "週6日勤務" },
  { id: "shift_based", label: "シフト制" },
  { id: "flexible", label: "フレックス・自由相談" },
  { id: "fivedays", label: "週5日勤務" },
];

function CheckboxGroup<G extends keyof Filterstype>({
  items,
  group,
  filters,
  onChange,
}: {
  items: Item[];
  group: G;
  filters: Filterstype;
  onChange: (updatedValue: Filterstype) => void;
}) {
  function toggle(id:string) {
    onChange({
        ...filters,[group]:{
            ...filters[group],
            [id]:!filters[group][id as keyof Filterstype[G]]
        }
    })
  }
  return (
    <div className="flex flex-col gap-0.5 font-headline">
      {items.map(({ id, label }) => {
        const checked = !!filters[group][id as keyof Filterstype[G]]
        return(
        <label
            key={id}
            onClick={() => toggle(id)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer
                       hover:bg-[var(--color-container-low)] transition-colors"
          >
            <span
              className={`w-[17px] h-[17px] rounded flex-shrink-0 flex items-center justify-center
                          border-[1.5px] transition-all
                          ${checked
                            ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                            : "border-[var(--color-primary)]/35 bg-transparent"
                          }`}
            >
              {checked && (
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                  <polyline
                    points="1.5,5 4,7.5 8.5,2.5"
                    stroke="var(--color-surface)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span
              className={`font-[var(--font-display)] text-[12px] md:text-[15px] select-none transition-colors
                ${checked
                  ? "text-[var(--color-on-surface)] font-medium"
                  : "text-[var(--color-on-surface-variant)]"
                }`}
            >
              {label}
            </span>
          </label>
      )})}
    </div>
  );
}

function Filters({ filters, onChange }: Props) {
  return (
    <div
      className="sticky top-0  font-[var(--font-display)] bg-[var(--color-surface)]
                 border border-[var(--color-primary)]/15 rounded-2xl
                 p-2 md:p-6 w-full max-w-[110px] md:max-w-[220px] my-4" 
    >
      <h2
        className="text-base md:text-xl font-semibold text-[var(--color-primary)]
                   tracking-wide pb-3 mb-5
                   border-b-2 border-[var(--color-secondary)] font-headline"
      >
        条件で絞り込む
      </h2>

      
      {/* Working Schedule */}
      <div className="mb-5">
        <p
          className="text-[9px] md:text-[11px] tracking-widest uppercase
                     text-[var(--color-secondary)] mb-2 font-label "
        >
          勤務形態
        </p>
        <CheckboxGroup items={scheduleItems} group="schedule" filters={filters} onChange={onChange} />
      </div>

      <hr className="border-[var(--color-primary)]/10 my-4" />

      {/* Employment Type */}
      <div>
        <p
          className="text-[9px] md:text-[11px] font-label tracking-widest uppercase
                     text-[var(--color-secondary)] mb-2"
        >
          働き方・シフト
        </p>
        <CheckboxGroup items={employmentItems} group="employment" filters={filters} onChange={onChange} />
      </div>
    </div>
  );
}

export default Filters;

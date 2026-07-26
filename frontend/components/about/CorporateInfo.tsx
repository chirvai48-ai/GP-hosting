import { Building2, MapPin, Phone, User, Users, Coins, BadgeCheck } from "lucide-react";

const rows: { label: string; value: React.ReactNode; icon: React.ReactNode }[] = [
  {
    label: "会社名",
    value: "株式会社Glowing Partner",
    icon: <Building2 size={16} />,
  },
  {
    label: "所在地",
    value: "〒171-0014 東京都豊島区池袋二丁目36番1号6階",
    icon: <MapPin size={16} />,
  },
  {
    label: "資本金",
    value: "4,425万円",
    icon: <Coins size={16} />,
  },
  {
    label: "代表取締役",
    value: (
      <>
        Go Uenaka <span className="text-[color:var(--color-on-surface-variant)]">(上中 豪)</span>
      </>
    ),
    icon: <User size={16} />,
  },
  {
    label: "従業員数",
    value: "100名（正社員・アルバイト含む）",
    icon: <Users size={16} />,
  },
];

const licenses: { label: string; value: string }[] = [
  {
    label: "一般労働者派遣事業許可",
    value: "派11-040029",
  },
  {
    label: "有料職業紹介事業許可",
    value: "11-ユ-040019",
  },
  {
    label: "登録支援機関（特定技能）",
    value: "22-To-007904",
  },
];

export default function CorporateInfo() {
  return (
    <section className="bg-[color:var(--color-container-low)] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="font-label text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--color-secondary)] mb-4">
            企業情報
          </p>
          <h2 className="font-headline text-5xl font-light italic text-[color:var(--color-primary)]">
            会社概要
          </h2>
          <div className="w-16 h-0.5 bg-[color:var(--color-secondary)] mx-auto mt-5" />
        </div>

        {/* Profile table */}
        <div className="bg-white border border-[rgba(20,86,82,0.1)] shadow-sm overflow-hidden">
          <div
            className="h-1"
            style={{ background: "linear-gradient(to right, #145652, #c9a84c)" }}
          />
          <dl className="divide-y divide-[rgba(20,86,82,0.08)]">
            {rows.map(({ label, value, icon }) => (
              <div
                key={label}
                className="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-2 sm:gap-6 px-6 sm:px-10 py-5"
              >
                <dt className="flex items-center gap-2 font-label text-[11px] font-semibold tracking-[0.14em] uppercase text-[color:var(--color-on-surface-variant)]">
                  <span className="text-[color:var(--color-primary)]">{icon}</span>
                  {label}
                </dt>
                <dd className="font-body text-base text-[color:var(--color-on-surface)] leading-relaxed">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Licenses */}
        <div className="mt-10">
          <p className="font-label text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--color-secondary)] mb-4 text-center">
            許認可・登録
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {licenses.map(({ label, value }) => (
              <div
                key={label}
                className="bg-white border border-[rgba(20,86,82,0.1)] p-5 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 text-[color:var(--color-primary)]">
                  <BadgeCheck size={16} />
                  <span className="font-label text-[10px] font-semibold tracking-[0.14em] uppercase">
                    許可番号
                  </span>
                </div>
                <p className="font-body text-sm text-[color:var(--color-on-surface)] leading-snug">
                  {label}
                </p>
                <p className="font-headline text-lg text-[color:var(--color-primary)] tracking-wide">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

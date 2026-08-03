"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X, ArrowUpRight } from "lucide-react";

type Member = {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  bio: string;
  isCeo?: boolean;
};

const members: Member[] = [
  {
    id: "uenaka",
    name: "上中 豪",
    role: "代表取締役",
    photo: "/UenkaGO.jpg",
    isCeo: true,
    bio: `2018年8月に起業して以来、私たちは今日に至るまで、ずっと【社員は全員外国人】という体制で会社を運営してまいりました。

なぜ、あえてそのような組織を作ったのか。理由は私の強いこだわりにあります。

「お客様に自信を持ってお勧めするものは、自分自身が誰よりも実践し、その価値を体感したものでありたい」と考えたからです。

また当時から、外国人社員が増える社会において「外国人マネジメント（いかに彼らの能力を活かし、定着させるか）」が、多くの企業様にとって最大の課題になると確信していたからでもあります。

当然、最初からすべてが順風満帆だったわけではありません。言葉や文化の壁、価値観の違いなど、多くの試行錯誤を重ねてきました。しかし、互いを理解し、共に成長できる仕組みを築き上げた結果、私たちは【社員は全員外国人】という体制のまま、あの未曾有のコロナ禍すらも一丸となって乗り越えることができました。

私たちは、「採用のご支援」だけで終わるサービスは、お客様にとって単なる「人件費（コスト）の増加」のご提案でしかないと考えております。

私たちが自社で試行錯誤しながら蓄積してきた、リアルな「外国人マネジメントの経験とノウハウ」。
それにより、他社には真似できない、現場に寄り添った「定着支援」と「即戦力化」をご支援いたします。

外国人採用を、単なる人手不足の解消（コスト）で終わらせない。
御社の仲間に加わった外国籍社員の方々が、新しい力となり、「売上増・利益増」をもたらす存在へと育つまで、御社の伴走者として共に歩んでいければ幸いです。`,
  },
  {
    id: "narayan",
    name: "ポケレル・ナラヤン",
    role: "",
    photo: "/Narayan.jpeg",
    bio: `私は12年前から日本に住んでいます。
その経験があるので、日本企業と、外国人社員の双方の求めていることや考え方を深く理解することができます。

リアルな声を聞き、文化の違いを埋めながら「双方向の100%な意思疎通」を目指したサポートを心がけています。

私も12年前に海を渡って日本に来た外国人の一人です。だからこそ、外国人社員の気持ちや、活かし方を誰よりも理解しています。質の高いコミュニケーション力で双方を繋ぐ架け橋として、全力でサポートいたします。`,
  },
  {
    id: "arun",
    name: "グルン・アルン",
    role: "",
    photo: "/Arun.jpeg",
    bio: `外国人材の採用支援から、入社後の労務管理・教育、そして企業様へのアフターフォローまで、一貫して担当しております。

私自身も外国人として日本で働く中で、周囲の温かいサポートに助けられ、成長してきました。その経験があるからこそ、求職者の皆様の不安に心から寄り添い、的確なアドバイスができます。

企業様には「現場で活躍し定着する人材」の提供とフォローを。求職者の皆様には「安心して働ける環境」への橋渡しを。「人とのつながり」を何よりも大切にし、双方にとって最良のパートナーとなれるよう尽力いたします。`,
  },
  {
    id: "sanyukta",
    name: "サニュクタ・アマチャ",
    role: "",
    photo: "/Amatya.jpeg",
    bio: `Glowing Partnerは、一人ひとりの目標や希望に寄り添い、安心して成長できる職場との出会いをサポートしています。

私たちは、新たな挑戦や新しいスタートには大きな可能性があると信じています。共に明るい未来を築いていきましょう。`,
  },
  {
    id: "norin",
    name: "シュレスタ・ノリン",
    role: "",
    photo: "/Norin.jpeg",
    bio: `私にとって、チームワーク、相手への敬意、そして継続的な学びはとても大切です。

常に学び、貢献できる機会をいただけることに感謝しています。

また、一緒に働く皆様に対して、信頼される存在として、親切で丁寧なサポートを提供することを目標としています。`,
  },
  {
    id: "nirajan",
    name: "ポカレル・ニラジャン",
    role: "",
    photo: "/Nirajan.jpeg",
    bio: `日々の業務において、企業様やスタッフの皆様との「信頼関係」を築くことを何よりも大切にしています。いただいたご相談や業務の一つひとつに誠実に向き合い、責任を持って取り組んでおります。

皆様にとって最も身近で頼れる存在となれるよう、誠心誠意サポートさせていただきます。`,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Photo frame — tinted background + object-contain so no cropping, ever. */
function PortraitFrame({
  member,
  className = "",
  priority = false,
}: {
  member: Member;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          "linear-gradient(160deg, rgba(20,86,82,0.07) 0%, rgba(201,168,76,0.10) 100%)",
      }}
    >
      {member.photo ? (
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-center"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-[#145652] to-[#1e7a74] text-white shadow-lg">
            <span className="font-headline text-4xl">{initials(member.name)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function BioModal({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-[fadeIn_180ms_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} biography`}
    >
      <button
        type="button"
        aria-label="閉じる"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
      />

      <div className="relative bg-white w-full max-w-3xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl animate-[slideUp_220ms_ease-out]">
        <div
          className="h-1.5 shrink-0"
          style={{ background: "linear-gradient(to right, #145652, #c9a84c)" }}
        />

        <div className="flex items-center gap-4 sm:gap-5 px-6 sm:px-10 py-6 shrink-0 border-b border-[rgba(20,86,82,0.08)] pr-14">
          {/* Small circular avatar */}
          <div
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-[color:var(--color-secondary)]/50 ring-offset-2 ring-offset-white shadow-sm"
            style={{
              background:
                "linear-gradient(160deg, rgba(20,86,82,0.07) 0%, rgba(201,168,76,0.10) 100%)",
            }}
          >
            {member.photo ? (
              <Image
                src={member.photo}
                alt={member.name}
                fill
                sizes="64px"
                className="object-cover object-top"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#145652] to-[#1e7a74] text-white">
                <span className="font-headline text-base">{initials(member.name)}</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-label text-[10px] tracking-[0.2em] uppercase text-[color:var(--color-secondary)] font-semibold mb-1">
              {member.isCeo ? "代表メッセージ" : "担当スタッフからのメッセージ"}
            </p>
            <h3 className="font-headline text-xl md:text-2xl text-[color:var(--color-on-surface)] leading-tight truncate">
              {member.name}
            </h3>
            <p className="font-label text-xs sm:text-sm tracking-wide text-[color:var(--color-primary)] font-medium mt-0.5">
              {member.role}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="閉じる"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/95 border border-[rgba(20,86,82,0.15)] flex items-center justify-center shadow-sm text-[color:var(--color-on-surface)] hover:text-[color:var(--color-primary)] hover:border-[color:var(--color-secondary)] transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-7">
          <p className="font-body text-[15px] md:text-base leading-relaxed whitespace-pre-line text-[color:var(--color-on-surface-variant)]">
            {member.bio}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}

function ReadButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/btn inline-flex items-center gap-2 self-start px-5 py-2.5 bg-[color:var(--color-primary)] text-white font-label text-[11px] tracking-[0.18em] uppercase font-semibold rounded-full hover:bg-[color:var(--color-secondary)] hover:text-[color:var(--color-primary)] transition-all duration-300 shadow-sm hover:shadow-md"
    >
      {label}
      <ArrowUpRight
        size={14}
        className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
      />
    </button>
  );
}

function CeoFeature({ member, onOpen }: { member: Member; onOpen: () => void }) {
  return (
    <article
      id={member.id}
      className="relative scroll-mt-28 bg-white border border-[color:var(--color-secondary)]/40 shadow-md overflow-hidden"
    >
      <div
        className="h-1.5"
        style={{ background: "linear-gradient(to right, #145652, #c9a84c, #145652)" }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-0">
        {/* Photo */}
        <PortraitFrame
          member={member}
          priority
          className="aspect-[4/5] lg:aspect-auto lg:min-h-[560px]"
        />

        {/* Content */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h3 className="font-headline text-4xl md:text-5xl text-[color:var(--color-on-surface)] leading-tight mb-2">
            {member.name}
          </h3>
          <p className="font-label text-sm tracking-[0.08em] text-[color:var(--color-primary)] font-semibold mb-6">
            {member.role}
          </p>

          <p className="font-body text-[15px] md:text-base leading-relaxed text-[color:var(--color-on-surface-variant)] line-clamp-5 mb-6">
            {member.bio}
          </p>

          <ReadButton onClick={onOpen} label="続きを見る" />
        </div>
      </div>
    </article>
  );
}

function MemberCard({ member, onOpen }: { member: Member; onOpen: () => void }) {
  return (
    <article
      id={member.id}
      className="group scroll-mt-28 bg-white border border-[rgba(20,86,82,0.1)] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[color:var(--color-secondary)]/50 flex flex-col"
    >
      <PortraitFrame member={member} className="aspect-[4/5]" />

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-headline text-2xl text-[color:var(--color-on-surface)] leading-tight">
          {member.name}
        </h3>
        <p className="font-label text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--color-on-surface-variant)] mt-1 mb-3">
          {member.role}
        </p>
        <div className="w-10 h-px bg-[color:var(--color-secondary)]/60 mb-4" />

        <p className="font-body text-sm leading-relaxed text-[color:var(--color-on-surface-variant)] line-clamp-3 mb-5 flex-1">
          {member.bio}
        </p>

        <ReadButton onClick={onOpen} label="続きを見る" />
      </div>
    </article>
  );
}

export default function TeamSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const ceo = members.find((m) => m.isCeo)!;
  const team = members.filter((m) => !m.isCeo);
  const openMember = members.find((m) => m.id === openId) ?? null;

  return (
    <section className="relative bg-[color:var(--color-container-low)] py-24 px-6 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[var(--color-primary)]/[0.04] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 w-[480px] h-[480px] rounded-full bg-[var(--color-secondary)]/[0.06] blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-label text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--color-secondary)] mb-4">
            私たちのチーム
          </p>
          <h2 className="font-headline text-5xl md:text-6xl font-light italic text-[color:var(--color-primary)]">
            プロフェッショナル紹介
          </h2>
          <div className="w-16 h-0.5 bg-[color:var(--color-secondary)] mx-auto mt-5" />
          <p className="font-body text-base md:text-lg text-[color:var(--color-on-surface-variant)] leading-relaxed max-w-3xl mx-auto mt-6">
            A small, multi-national team united by one belief: international talent
            and Japanese companies grow strongest when they truly understand each other.
          </p>
        </div>

        {/* CEO feature */}
        <div className="mb-16">
          <CeoFeature member={ceo} onOpen={() => setOpenId(ceo.id)} />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-[rgba(20,86,82,0.12)]" />
          <p className="font-label text-[10px] tracking-[0.22em] uppercase text-[color:var(--color-on-surface-variant)]">
            メンバー一覧
          </p>
          <div className="flex-1 h-px bg-[rgba(20,86,82,0.12)]" />
        </div>

        {/* Team — 2-up on tablet, 3-up on desktop (3 above, 2 below) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 lg:max-w-5xl lg:mx-auto">
          {team.map((m) => (
            <MemberCard key={m.id} member={m} onOpen={() => setOpenId(m.id)} />
          ))}
        </div>
      </div>

      {openMember && <BioModal member={openMember} onClose={() => setOpenId(null)} />}
    </section>
  );
}

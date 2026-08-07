"use client";

import { useState } from "react";
import {SectionLabel} from "./Helpers"
import HoursNewsletterColumn from "./Column2";
import BrandColumn from "./Column1";

const PRIVACY_POLICY_TEXT = `個人情報の取り扱いについて
株式会社Glowing Partnerでは、お問い合わせに際して取得する個人情報を以下の通り取り扱います。内容をご確認いただき、ご同意いただいた上でお問い合わせください。

１．個人情報の利用目的
お問い合わせへの対応、および当社からのご案内・ご連絡のために利用いたします。

２．個人情報の第三者提供・委託について
法令に基づく場合を除き、取得した個人情報をご本人の同意なく第三者へ提供することはありません。ただし、利用目的の達成に必要な範囲内で、適切な安全管理基準を満たした企業に業務を委託する場合があります。

３．個人情報の開示等について
ご提供いただいた個人情報について、開示、訂正、追加、削除、利用停止等のご希望がある場合は、当社お問い合わせ窓口までご連絡ください。

４．ご提出の任意性と情報の非返却について
個人情報のご提供は任意ですが、必要な事項をご入力いただけない場合は、お問い合わせに適切に対応できない場合がございます。また、ご提供いただいた個人情報に関するデータや書類等は、いかなる場合も返却いたしかねますので、あらかじめご了承ください。

５．安全管理措置と容易に認識できない方法による取得について
取得した個人情報は、漏洩や紛失の防止のため必要かつ適切な安全管理措置を講じます。対応完了後、個人情報は当社において適切に破棄・削除いたします。また、クッキー（Cookie）等を用いて、ご本人が容易に認識できない方法での個人情報の取得は行っておりません。`;

function FacebookColumn() {
  return (
    <div className="flex flex-col">
      <SectionLabel>Facebook公式ページ</SectionLabel>
      <p
        className="text-[13.5px] italic mb-4"
        style={{
          fontFamily: "var(--font-body)",
          color: "rgba(248,250,248,0.45)",
          lineHeight: 1.65,
        }}
      >
        コミュニティに参加して、最新情報、お知らせ、ストーリーをチェックしましょう。
      </p>

      {/* Facebook preview card */}
      <div
        className="rounded-md p-4"
        style={{
          background: "rgba(255,255,255,0.055)",
          border: "0.5px solid rgba(201,168,76,0.2)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: "#1877F2" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-[22px] h-[22px]"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </div>
          <div>
            <p
              className="text-[14px] leading-tight"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-surface)",
                fontWeight: 500,
              }}
            >
              Glowing Partner
            </p>
            <p
              className="text-[11px]"
              style={{
                fontFamily: "var(--font-label)",
                color: "rgba(248,250,248,0.38)",
              }}
            >
              Facebookページ
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-5 mb-4">
          {[
            { num: "5.5K", lbl: "フォロワー" },
            { num: "3.8K", lbl: "いいね！" },
            { num: "毎週", lbl: "投稿" },
          ].map(({ num, lbl }) => (
            <div key={lbl}>
              <span
                className="block text-[15px] font-medium leading-none mb-[3px]"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-secondary)",
                }}
              >
                {num}
              </span>
              <span
                className="text-[9.5px] uppercase tracking-[0.1em]"
                style={{
                  fontFamily: "var(--font-label)",
                  color: "rgba(248,250,248,0.35)",
                }}
              >
                {lbl}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="pt-3"
          style={{ borderTop: "0.5px solid rgba(201,168,76,0.2)" }}
        >
          <a
            href="https://www.facebook.com/glowingpartner.co.ltd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group transition-opacity duration-200 hover:opacity-70"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-[12px] h-[12px]"
              style={{ color: "var(--color-secondary)" }}
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            <span
              className="text-[10.5px] uppercase tracking-[0.14em]"
              style={{
                fontFamily: "var(--font-label)",
                color: "var(--color-secondary)",
              }}
            >
              ページを見る
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[11px] h-[11px] ml-auto"
              style={{ color: "var(--color-secondary)" }}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function FooterSection() {
  const [policyOpen, setPolicyOpen] = useState(false);

  return (
    <footer
      style={{
        background: "var(--color-primary)",
        color: "var(--color-surface)",
      }}
    >
      {/* Gold top hairline */}
      <div
        className="h-px w-full"
        style={{ background: "rgba(201,168,76,0.35)" }}
      />

      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 px-10 md:px-10 pt-4 pb-10">
        {/* Col 1 */}
        <div
          className="pb-10 md:pb-0 md:pr-6 md:border-r"
          style={{ borderColor: "rgba(201,168,76,0.15)" }}
        >
          <BrandColumn />
        </div>

        {/* Col 2 */}
        <div
          className="pt-10 md:pt-0 md:pl-10 border-t md:border-t-0 flex flex-col gap-10"
          style={{ borderColor: "rgba(201,168,76,0.15)" }}
        >
          <FacebookColumn />
          <HoursNewsletterColumn />
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="px-10 md:px-16 py-4 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ borderTop: "0.5px solid rgba(201,168,76,0.18)" }}
      >
        <p
          className="text-[10.5px] tracking-[0.04em]"
          style={{
            fontFamily: "var(--font-label)",
            color: "rgba(248,250,248,0.28)",
          }}
        >
          © {new Date().getFullYear()} Glowing Partner Japan.
        </p>
        <div className="flex gap-6">
          {["プライバシーポリシー", "利用規約", "Sitemap"].map((link) => (
            <a
              key={link}
              href="#"
              onClick={(e) => {
                if (link === "プライバシーポリシー" || link === "利用規約") {
                  e.preventDefault();
                  setPolicyOpen(true);
                }
              }}
              className="text-[10.5px] uppercase tracking-[0.07em] transition-colors duration-200"
              style={{
                fontFamily: "var(--font-label)",
                color: "rgba(248,250,248,0.28)",
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>

      {policyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setPolicyOpen(false)}
        >
          <div
            className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl bg-white p-8 text-left"
            style={{ color: "var(--color-primary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className="whitespace-pre-line text-[13px] leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {PRIVACY_POLICY_TEXT}
            </p>
            <button
              onClick={() => setPolicyOpen(false)}
              className="mt-6 text-[11px] uppercase tracking-[0.1em]"
              style={{ fontFamily: "var(--font-label)", color: "var(--color-secondary)" }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
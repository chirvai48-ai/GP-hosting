"use client";

export const PRIVACY_POLICY_TEXT = `個人情報の取り扱いについて
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

export default function PolicyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
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
        <p
          className="whitespace-pre-line text-[13px] leading-relaxed mt-6"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {`株式会社Glowing Partner
代表取締役 上中 豪
電話番号　03-6694-6943`}
        </p>
        <button
          onClick={onClose}
          className="mt-6 text-[11px] uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-label)", color: "var(--color-secondary)" }}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}

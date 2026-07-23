"use client";
import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    {
      question: "どのような種類のビザの申請に対応していますか？",
      answer: (
        <div className="space-y-2">
          <p>現在、当社では以下のビザ取得および就労サポートを行っております。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>特定技能ビザ</li>
            <li>技能実習ビザ</li>
          </ul>
          <p className="pt-2">
            ※留学生ビザ（留学ビザ）の手続きについては、現在は取り扱っておりませんが、近い将来に対応を開始する予定です。
          </p>
        </div>
      )
    },
    {
      question: "日本への渡航や手続きにはどのくらいの費用がかかりますか？",
      answer: (
        <p>
          費用は取得するビザの種類、就職先の地域、勤務する企業によって異なります。個別面談の際に、ご希望の条件に応じた詳細な費用内訳をご案内いたしますので、まずはお気軽にご相談ください。
        </p>
      )
    },
    {
      question: "申し込みから日本で働き始めるまでに、どのくらいの期間がかかりますか？",
      answer: (
        <p>
          ビザの種類や申請のタイミングによって異なります。例えば特定技能（SSW）ビザの場合、日本語試験や技能試験にすでに合格しているかどうかで期間が大きく変わります。目安となるスケジュールはカウンセリング時にご説明いたします。
        </p>
      )
    },
    {
      question: "どのような書類を準備する必要がありますか？",
      answer: (
        <p>
          申請するビザによって必要書類は異なりますが、一般的にはパスポート、履歴書（CV）、卒業証明書、顔写真などが必要です。面談の際に、個別の必要書類チェックリストをお渡しいたします。
        </p>
      )
    },
    {
      question: "日本語はどのくらいのレベルが必要ですか？",
      answer: (
        <p>
          ビザによって異なりますが、特定技能（SSW）ビザの場合はJLPT N4（基本的な日常会話レベル）以上が必須となります。N3やN2の資格をお持ちであれば、より条件の良い求人をご紹介可能です。当社では日本語の学習支援も行っています。
        </p>
      )
    },
    {
      question: "日本での給与はどのくらいですか？",
      answer: (
        <p>
          給与はビザの種類、勤務地（都道府県）、職種によって異なります。なお、ご紹介するすべての求人は日本国内の労働法および各地域の最低賃金を厳守しておりますのでご安心ください。具体的な給与額は求人をご紹介する際にご提示いたします。
        </p>
      )
    },
    {
      question: "家族（配偶者や子供）を日本に呼ぶことはできますか？",
      answer: (
        <p>
          はい、「技術・人文知識・国際業務」ビザ、または「特定技能2号」ビザを取得した場合は、家族帯同で日本に滞在することが可能です。将来的に家族と一緒に日本で暮らしたい方には、長期的なキャリアプランをご提案いたします。
        </p>
      )
    },
    {
      question: "日本で病気になったり、困ったことが起きたりした場合はどうすればよいですか？",
      answer: (
        <p>
          どうぞご安心ください。日本の本社オフィスが皆様を全面的にサポートします。病気やケガ、職場でのトラブルなどが発生した際は、当社の日本人スタッフおよび現地スタッフが迅速に相談に乗り、解決に向けて対応いたします。
        </p>
      )
    },
    {
      question: "学校を卒業したばかりの新卒ですが、応募は可能ですか？",
      answer: (
        <p>
          はい、大歓迎です！新卒の方の応募も広く受け付けております。特に大学の学士号をお持ちの場合は、「技術・人文知識・国際業務」ビザでの就労チャンスもあります。若い皆様の日本での第一歩をしっかり支えます。
        </p>
      )
    },
    {
      question: "面接で不採用になってしまった場合、次のお仕事は紹介してもらえなくなりますか？",
      answer: (
        <p>
          いいえ、決して諦める必要はありません。万が一不採用となった場合でも、何が課題だったかを一緒に分析し、次の面接に向けた対策を行います。内定を獲得できるまで、何度でも継続してサポートいたします。
        </p>
      )
    },
    {
      question: "オンラインでの相談や面談は可能ですか？",
      answer: (
        <p>
          はい、可能です。遠方にお住まいの方や来社が難しい方でも、ZoomやGoogle Meetなどのオンラインツールを使用して、カウンセリングからお仕事の選考面接までスムーズに進めることができます。
        </p>
      )
    }
  ];

  const middleIndex = Math.ceil(faqItems.length / 2);
  const firstColumnItems = faqItems.slice(0, middleIndex);
  const secondColumnItems = faqItems.slice(middleIndex);

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-white to-[#f8fbfb]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-[#2C5A5B] mb-3 tracking-wide">
            よくあるご質問（FAQ）
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#2C5A5B] to-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            日本での就労や新しい生活に向けた、よくあるご質問にお答えします
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          <div className="space-y-4">
            {firstColumnItems.map((item, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left border-b border-gray-200 pb-4"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900 pr-6 group-hover:text-[#2C5A5B] transition-colors duration-200">
                      {item.question}
                    </h3>
                    <span className="flex-shrink-0 ml-2 mt-1">
                      <svg
                        className={`w-4 h-4 text-[#2C5A5B] transform transition-transform duration-300 ${
                          openIndex === index ? 'rotate-45' : 'group-hover:translate-x-1'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </span>
                  </div>

                  {openIndex === index && (
                    <div className="mt-3 text-gray-600 text-sm leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {secondColumnItems.map((item, index) => (
              <div key={index + middleIndex} className="group">
                <button
                  onClick={() => toggleFAQ(index + middleIndex)}
                  className="w-full text-left border-b border-gray-200 pb-4"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900 pr-6 group-hover:text-[#2C5A5B] transition-colors duration-200">
                      {item.question}
                    </h3>
                    <span className="flex-shrink-0 ml-2 mt-1">
                      <svg
                        className={`w-4 h-4 text-[#2C5A5B] transform transition-transform duration-300 ${
                          openIndex === index + middleIndex ? 'rotate-45' : 'group-hover:translate-x-1'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </span>
                  </div>

                  {openIndex === index + middleIndex && (
                    <div className="mt-3 text-gray-600 text-sm leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-600 mb-4 text-sm">
            より詳細な情報や個別の確認をご希望ですか？
          </p>
          <a href="/contact/customer">
            <button className="group relative px-6 py-3 text-white font-medium text-sm tracking-wide">
              <span className="relative z-10">無料の個別カウンセリングに申し込む</span>
              <div className="absolute inset-0 border bg-gradient-to-br from-[#2C5A5B] to-[#4C9E9F] rounded-lg transition-all duration-300"></div>
              <div className="absolute text-2xl -bottom-1 left-1/2 w-0 group-hover:w-3/4 h-px bg-gradient-to-r from-transparent via-[#2C5A5B] to-transparent group-hover:left-1/5 transition-all duration-300"></div>
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

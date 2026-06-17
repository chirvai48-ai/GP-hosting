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
      question: "Which visas can I apply for?",
      answer: (
        <div className="space-y-2">
          <p>Currently, we assist with the following visa types:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Specified Skilled Worker Visa (SSW)</li>
            <li>Technical Intern Training Visa (TIT)</li>
          </ul>
          <p className="pt-2">
            Regarding Student Visa, we are not currently processing them, but we plan to offer this service in the near future.
          </p>
        </div>
      )
    },
    {
      question: "How much does it cost to go to Japan?",
      answer: (
        <p>
          The cost varies depending on the visa type, the destination region, and the employing company.
          Please contact us for a consultation, and we will explain the details based on your specific situation.
        </p>
      )
    },
    {
      question: "How long does the process take?",
      answer: (
        <p>
          The timeline differs depending on the visa category and timing. For example, for the SSW visa,
          the process time varies significantly depending on whether you have already passed the Japanese language and skills exams.
          Please consult us for an estimated timeline.
        </p>
      )
    },
    {
      question: "What documents are required?",
      answer: (
        <p>
          Required documents depend on the specific visa type. Generally, you will need a passport,
          resume (CV), graduation certificates, and photos. We will provide a specific checklist during our consultation.
        </p>
      )
    },
    {
      question: "What level of Japanese is required?",
      answer: (
        <p>
          It depends on the visa, but for the SSW visa, JLPT N4 (basic conversational level) is the minimum requirement.
          However, having N3 or N2 will give you access to better job opportunities. We also provide support for Japanese language learning.
        </p>
      )
    },
    {
      question: "What is the salary in Japan?",
      answer: (
        <p>
          Salaries vary based on the visa type, region (prefecture), and job industry. However, please be assured that all job offers
          comply with Japanese labor laws regarding minimum wage. We will provide specific salary details when introducing job offers.
        </p>
      )
    },
    {
      question: "Can I bring my family (spouse/children) to Japan?",
      answer: (
        <p>
          Yes, if you obtain an &quot;Engineer/Specialist in Humanities/International Services&quot; visa or an &quot;SSW Type 2&quot; visa,
          you can bring your family to live with you. We can propose a long-term career plan if you wish to live with your family in the future.
        </p>
      )
    },
    {
      question: "What if I get sick or have trouble in Japan?",
      answer: (
        <p>
          Please do not worry. Our parent company (Japan office) is there for you. If you face illness, injury, or workplace issues,
          our Japanese staff will be available to consult and help you solve the problem immediately.
        </p>
      )
    },
    {
      question: "Can new graduates apply?",
      answer: (
        <p>
          Yes, absolutely! New graduates are welcome to apply. In particular, those with a university bachelor&apos;s degree may be eligible
          for the &quot;Engineer/Specialist in Humanities/International Services&quot; visa. We support young talent in starting their careers.
        </p>
      )
    },
    {
      question: "If I fail an interview, will you stop introducing jobs?",
      answer: (
        <p>
          No, please don&apos;t give up. Even if you are not selected, we will analyze the reasons and provide training for the next interview.
          We will support you as many times as needed until you secure a job offer.
        </p>
      )
    },
    {
      question: "Is online consultation available?",
      answer: (
        <p>
          Yes, it is available. Even if you live far away, we can conduct counseling sessions and interviews online
          using tools like Zoom or Google Meet.
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
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#2C5A5B] to-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Clear answers to common questions about your journey to Japan
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
            Need more specific information?
          </p>
          <a href="/contact/customer">
            <button className="group relative px-6 py-3 text-white font-medium text-sm tracking-wide">
              <span className="relative z-10">Get Personalized Consultation</span>
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

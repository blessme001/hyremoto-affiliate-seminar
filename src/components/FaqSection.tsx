const faqs = [
  [
    'Who can attend?',
    'Individuals, creators, agents, brokers and businesses interested in the HyreMoto affiliate program. Attendance is free.',
  ],
  [
    'When and where is the seminar?',
    'It will take place online. Register your interest to receive the date, time, timezone and joining details once confirmed.',
  ],
  [
    'Does registering make me an affiliate?',
    'No. This signup is for the seminar announcement list. Affiliate requirements and next steps will be explained during the session.',
  ],
];

export function FaqSection() {
  return (
    <section
      id="faqs"
      aria-labelledby="faq-heading"
      className="px-6 lg:px-12 py-14 lg:py-16 bg-white scroll-mt-24"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="eyebrow">FAQs</p>
          <h2 id="faq-heading" className="section-heading">
            A few things to know.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map(([question, answer]) => (
            <details
              key={question}
              className="group bg-white rounded-2xl border border-[#172822]/10"
            >
              <summary className="px-6 py-5 font-bold text-[#0F3324] cursor-pointer flex justify-between items-center gap-4 list-none">
                {question}
                <span
                  aria-hidden="true"
                  className="text-[#216B42] text-xl group-open:rotate-45 transition-transform"
                >
                  +
                </span>
              </summary>

              <p className="px-6 pb-6 text-sm text-[#4A5B53] leading-relaxed">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
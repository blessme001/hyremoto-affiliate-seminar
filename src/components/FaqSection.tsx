const faqs = [
 ['Who is this seminar for?','Individuals, creators, agents, brokers, travel businesses and company representatives interested in exploring referral opportunities with HyreMoto.'],
 ['Is the seminar free?','Yes. Registration and attendance at this online seminar are free.'],
 ['When and where will it take place?','The seminar will take place online. The date, time and access details are to be announced.'],
 ['Do I need an existing audience or business?','You can register as an individual with personal or professional connections. The seminar will explain participation requirements.'],
 ['Can companies participate?','Company representatives can register to learn about the opportunity and the final participation requirements.'],
 ['How will referrals and commissions work?','HyreMoto will explain approved referral methods, eligibility, tracking, commission rules and payout arrangements. Final terms are to be confirmed.'],
 ['Does registering make me an approved affiliate?','No. Registering expresses interest in the seminar. Affiliate approval follows a separate onboarding process under the program’s final terms.'],
];
export function FaqSection() { return <section id="faqs" className="px-6 lg:px-12 py-20 bg-[#FFFFFF]"><div className="max-w-4xl mx-auto"><div className="text-center mb-10"><p className="eyebrow">Questions & Answers</p><h2 className="section-heading">A few things to know.</h2></div><div className="space-y-3">{faqs.map(([question,answer])=><details key={question} className="group bg-white rounded-2xl border border-[#172822]/10"><summary className="px-6 py-5 font-bold text-[#0F3324] cursor-pointer flex justify-between items-center gap-4 list-none">{question}<span aria-hidden="true" className="text-[#216B42] text-xl group-open:rotate-45 transition-transform">+</span></summary><p className="px-6 pb-6 text-sm text-[#4A5B53] leading-relaxed">{answer}</p></details>)}</div></div></section>; }

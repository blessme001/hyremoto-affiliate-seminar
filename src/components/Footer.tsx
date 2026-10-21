export function Footer({
  onNavigateToSection,
}: {
  onNavigateToSection: (id: string) => void;
}) {
  return (
    <footer className="px-6 lg:px-12 pt-10 pb-28 md:pb-10 bg-[#0F3324] border-t border-white/10 text-white/65">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-7 items-start lg:items-center justify-between">
        <div>
          <img
            src="/images/hyremoto-logo.png"
            alt="HyreMoto"
            className="w-44 h-auto object-contain"
          />
          <p className="text-xs mt-2">
            Affiliate Program · Free online seminar
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-5 text-xs"
        >
          {[
            ['opportunity', 'The Opportunity'],
            ['what-you-learn', 'What You’ll Learn'],
            ['faqs', 'FAQs'],
            ['register', 'Register'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => onNavigateToSection(id)}
              className="hover:text-[#7BCB88]"
            >
              {label}
            </button>
          ))}
        </nav>

        <p className="text-xs">
          © {new Date().getFullYear()} HyreMoto.
        </p>
      </div>
    </footer>
  );
}
export function Footer({
  onNavigateToSection,
}: {
  onNavigateToSection: (id: string) => void;
}) {
  return (
    <footer className="px-6 lg:px-12 pt-10 pb-28 md:pb-10 bg-[#EDF7EF] border-t border-[#0F3324]/10 text-[#0F3324]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div>
            <a
              href="https://hyremoto.com"
              aria-label="Visit the HyreMoto website"
              className="inline-block"
            >
              <img
                src="/images/hyremoto-logo.png"
                alt="HyreMoto"
                className="w-44 h-auto object-contain"
              />
            </a>

            <p className="text-xs mt-3">
              Affiliate Program · Free online seminar
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href="mailto:info@hyremoto.com"
              className="hover:text-[#216B42] transition-colors"
            >
              info@hyremoto.com
            </a>

            <a
              href="tel:+2347127099922"
              className="hover:text-[#216B42] transition-colors"
            >
              +234 712 709 9922
            </a>

            <a
              href="https://hyremoto.com"
              className="hover:text-[#216B42] transition-colors"
            >
              Visit hyremoto.com ↗
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#0F3324]/10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-3 text-xs"
          >
            {[
              ['opportunity', 'The Seminar'],
              ['faqs', 'FAQs'],
              ['register', 'Register Interest'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigateToSection(id)}
                className="hover:text-[#216B42] transition-colors"
              >
                {label}
              </button>
            ))}

            <a
              href="https://hyremoto.com/legal#company"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#216B42] transition-colors"
            >
              Privacy Policy
            </a>
          </nav>

          <p className="text-xs text-[#4A5B53]">
            © {new Date().getFullYear()} HyreMoto.
          </p>
        </div>
      </div>
    </footer>
  );
}
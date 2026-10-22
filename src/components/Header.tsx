export function Header({
  onNavigateToSection,
}: {
  onNavigateToSection: (id: string) => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6 lg:px-12 py-4 bg-white text-[#0F3324] border-b border-[#0F3324]/10 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <a
          href="https://hyremoto.com"
          aria-label="Visit the HyreMoto website"
          className="shrink-0"
        >
          <img
            src="/images/hyremoto-logo.png"
            alt="HyreMoto"
            className="block w-24 sm:w-44 h-auto object-contain"
          />
        </a>

        <button
          type="button"
          onClick={() => onNavigateToSection('register')}
          className="shrink-0 rounded-full bg-[#7BCB88] text-[#0F3324] px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold hover:bg-[#A7E2B1] transition-colors"
        >
          Register Interest
        </button>
      </div>
    </header>
  );
}

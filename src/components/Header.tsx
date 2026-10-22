import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header({
  onNavigateToSection,
}: {
  onNavigateToSection: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const links = [
    ['opportunity', 'The Seminar'],
    ['faqs', 'FAQs'],
  ];

  const go = (id: string) => {
    setOpen(false);
    onNavigateToSection(id);
  };

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

        <nav
          aria-label="Main navigation"
          className="hidden lg:flex gap-7 text-sm font-medium text-[#0F3324]"
        >
          {links.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={event => {
                event.preventDefault();
                go(id);
              }}
              className="hover:text-[#216B42] transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go('register')}
            className="rounded-full bg-[#7BCB88] text-[#0F3324] px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold hover:bg-[#A7E2B1] transition-colors"
          >
            Register Interest
          </button>

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-lg bg-[#EDF7EF] text-[#0F3324] border border-[#0F3324]/15 hover:bg-[#DDEFE1] transition-colors"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(previous => !previous)}
          >
            {open ? (
              <X size={24} strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <Menu size={24} strokeWidth={2.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
        className={`lg:hidden ${
          open ? 'flex' : 'hidden'
        } max-w-7xl mx-auto flex-col gap-1 pt-5 bg-white text-[#0F3324]`}
      >
        {links.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={event => {
              event.preventDefault();
              go(id);
            }}
            className="text-left py-3 text-base font-semibold border-t border-[#0F3324]/15 text-[#0F3324] hover:text-[#216B42] transition-colors"
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

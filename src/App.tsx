import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RegistrationSection } from './components/RegistrationSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { AdminPage } from './components/AdminPage';

export default function App() {
  const [admin, setAdmin] = useState(
    window.location.hash === '#admin'
  );

  useEffect(() => {
    const update = () => {
      setAdmin(window.location.hash === '#admin');
    };

    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const navigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    });
  };

  if (admin) return <AdminPage />;

  return (
    <div className="min-h-screen bg-white text-[#172822] font-sans">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Header onNavigateToSection={navigate} />

      <main id="main">
        <HeroSection
          onReserveClick={() => navigate('register')}
          onExploreClick={() => navigate('opportunity')}
        />

        <section
          id="opportunity"
          aria-labelledby="seminar-overview"
          className="scroll-mt-24 px-6 py-14 lg:px-12 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#216B42]">
              The opportunity
            </p>

            <h2
              id="seminar-overview"
              className="max-w-2xl font-display text-3xl font-bold tracking-tight text-[#0F3324] sm:text-4xl"
            >
              You know people. Discover what that could mean.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#4A5B53]">
              Join HyreMoto’s free online seminar to explore its affiliate
              program and ask your questions directly.
            </p>

            <div
              id="what-you-learn"
              className="mt-10 grid scroll-mt-24 gap-6 border-t border-[#0F3324]/15 pt-7 md:grid-cols-3"
            >
              {[
                ['01', 'Explore the program', 'Understand the referral opportunity.'],
                ['02', 'Find your fit', 'Discover who can participate.'],
                ['03', 'Know your next step', 'Learn how to get started.'],
              ].map(([number, title, description]) => (
                <div key={number}>
                  <span className="text-xs font-semibold text-[#216B42]">
                    {number}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold text-[#0F3324]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4A5B53]">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div
              id="who-should-attend"
              className="mt-8 scroll-mt-24 border-t border-[#0F3324]/15 pt-6"
            >
              <p className="text-sm leading-relaxed text-[#4A5B53]">
                <strong className="font-semibold text-[#0F3324]">
                  Who it’s for:
                </strong>{' '}
                Individuals, creators, agents, brokers and businesses with
                people to connect.
              </p>
            </div>
          </div>
        </section>

        <RegistrationSection preselectedCategory="" />
        <FaqSection />
      </main>

      <Footer onNavigateToSection={navigate} />
      <MobileStickyBar onReserveClick={() => navigate('register')} />
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Calendar, ArrowDown, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onReserveClick: () => void;
  onExploreClick: () => void;
}

export function HeroSection({
  onReserveClick,
  onExploreClick,
}: HeroSectionProps) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const posterUrl = `${import.meta.env.BASE_URL}images/hero-poster.svg`;
  const videoUrl = `${import.meta.env.BASE_URL}videos/hero.mp4`;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);

    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const handleVideoError = () => {
    setFailed(true);
    setReady(false);
  };

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[85svh] lg:min-h-[90svh] flex flex-col justify-between pt-32 pb-10 lg:pb-12 px-6 lg:px-12 bg-[#0F3324] overflow-hidden text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <img
          alt=""
          src={posterUrl}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {!reducedMotion && !failed && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              ready ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectPosition: '65% center' }}
            poster={posterUrl}
            onPlaying={() => setReady(true)}
            onError={handleVideoError}
          >
            <source
              src={videoUrl}
              type="video/mp4"
              onError={handleVideoError}
            />
          </video>
        )}

        <div className="absolute inset-0 video-overlay-gradient" />

        <svg
          className="absolute inset-0 w-full h-full opacity-15"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100,500 C300,300 600,750 1100,450 C1300,320 1500,400 1600,380"
            fill="none"
            stroke="#7BCB88"
            strokeDasharray="6,8"
            strokeWidth="1.5"
          />
          <circle cx="600" cy="750" fill="#7BCB88" r="4" />
          <circle cx="1100" cy="450" fill="#7BCB88" r="4" />
          <circle cx="300" cy="300" fill="#7BCB88" r="3" />
        </svg>

        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#7BCB88]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto my-auto py-8">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wider uppercase mb-6 text-[#7BCB88]">
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-[#7BCB88]"
            />
            HyreMoto Affiliate Program
          </p>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.08] text-white mb-6"
          >
            Your network.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7BCB88] via-[#A7E2B1] to-white">
              New possibilities.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white leading-relaxed max-w-xl font-medium mb-8 drop-shadow-md">
            Explore the HyreMoto referral opportunity at our free online
            seminar. Register your interest to hear when it’s happening.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={onReserveClick}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold bg-[#7BCB88] text-[#0F3324] hover:bg-[#A7E2B1] active:scale-[0.98] transition-all shadow-xl shadow-[#0A2419]/50 group cursor-pointer"
            >
              Register My Interest
              <ArrowRight
                aria-hidden="true"
                className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform"
              />
            </button>

            <button
              type="button"
              onClick={onExploreClick}
              className="inline-flex items-center justify-center text-sm font-semibold text-white hover:text-[#A7E2B1] transition-colors py-2 cursor-pointer drop-shadow-md"
            >
              About the seminar
              <ArrowDown
                aria-hidden="true"
                className="w-4 h-4 ml-1.5"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto border-t border-white/15 pt-6">
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs sm:text-sm text-white/80">
          <p className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full bg-[#7BCB88]"
            />
            Free online seminar
          </p>

          <p className="flex items-center gap-2">
            <Calendar
              aria-hidden="true"
              className="w-4 h-4 text-[#7BCB88]"
            />
            Date and time to be announced
          </p>
        </div>
      </div>
    </section>
  );
}
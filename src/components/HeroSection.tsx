import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Calendar, ShieldCheck, ArrowDown, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onReserveClick: () => void;
  onExploreClick: () => void;

}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onReserveClick,
  onExploreClick,

}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const posterUrl = `${import.meta.env.BASE_URL}images/hero-poster.svg`;
  const videoUrl = `${import.meta.env.BASE_URL}videos/hero.mp4`;
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { try { await video.play(); } catch { setIsPlaying(false); } }
    else video.pause();
  };

  return (
    <section
      id="hero"
      aria-label="Seminar Introduction"
      className="relative min-h-[94vh] lg:min-h-screen flex flex-col justify-between pt-32 pb-12 lg:pb-16 px-6 lg:px-12 bg-[#0C3027] overflow-hidden text-white"
    >
      {/* Video Background & Static Fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          alt=""
          id="hero-fallback-poster"
          src={posterUrl}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {!reducedMotion && !failed && <video
          ref={videoRef}
          autoPlay muted loop playsInline preload="metadata"
          aria-hidden="true" tabIndex={-1}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectPosition: '65% center' }}
          poster={posterUrl}
          onCanPlay={() => setReady(true)}
          onPlaying={() => { setIsPlaying(true); setReady(true); }}
          onPause={() => setIsPlaying(false)}
          onError={() => { setFailed(true); setReady(false); setIsPlaying(false); }}
        ><source src={videoUrl} type="video/mp4" onError={() => { setFailed(true); setReady(false); setIsPlaying(false); }} /></video>}

        {/* Rich Forest Green Dark Cinematic Gradient Overlay */}
        <div className="absolute inset-0 video-overlay-gradient"></div>

        {/* Subtle architectural route line SVG decorative accent */}
        <svg
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100,500 C300,300 600,750 1100,450 C1300,320 1500,400 1600,380"
            fill="none"
            stroke="#D4B36A"
            strokeDasharray="6,8"
            strokeWidth="1.5"
          ></path>
          <circle cx="600" cy="750" fill="#D4B36A" r="4"></circle>
          <circle cx="1100" cy="450" fill="#D4B36A" r="4"></circle>
          <circle cx="300" cy="300" fill="#D4B36A" r="3"></circle>
        </svg>

        {/* Floating geometric glow accents */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#D4B36A]/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-7xl w-full mx-auto my-auto py-8">
        <div className="max-w-3xl">
          {/* Category & Type Tag */}
          <div className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wider uppercase mb-6 text-[#D4B36A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4B36A] animate-pulse"></span>
            <span>HYREMOTO AFFILIATE PROGRAM</span>
            <span className="text-white/40">•</span>
            <span className="text-white/90">FREE ONLINE SEMINAR</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.08] text-white mb-6">
            Your network.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4B36A] via-[#E8CA88] to-white">
              New possibilities.
            </span>
          </h1>

          {/* Supporting text */}
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl font-light mb-8">
            Discover how individuals, creators, agents and businesses can earn commissions by
            referring customers to HyreMoto, a vehicle rental platform operating in Nigeria.
          </p>

          {/* CTA Cluster */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
            <button
              onClick={onReserveClick}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold bg-[#D4B36A] text-[#0C3027] hover:bg-[#E8CA88] active:scale-[0.98] transition-all shadow-xl shadow-[#08211A]/50 group cursor-pointer"
            >
              <span>Reserve Your Free Spot</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={onExploreClick}
              className="inline-flex items-center justify-center text-sm font-medium text-white/80 hover:text-[#D4B36A] transition-colors py-2 group cursor-pointer"
            >
              <span>Explore the opportunity</span>
              <ArrowDown className="w-4 h-4 ml-1.5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Event Information Strip & Media Controls */}
      <div className="relative z-10 max-w-7xl w-full mx-auto border-t border-white/15 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Info Badges */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs sm:text-sm text-white/80 font-normal">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4B36A]"></span>
            <span className="font-medium text-white">Online seminar</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D4B36A]" />
            <span>Date to be announced</span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4B36A]" />
            <span>Free registration</span>
          </div>


        </div>

        {/* Controls: Video Pause/Play & Scroll Indicator */}
        <div className="flex items-center gap-4 text-xs text-white/60">
          {ready && !failed && !reducedMotion && <button
            type="button"
            onClick={toggleVideo}
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/80 focus:outline-none focus:ring-1 focus:ring-[#D4B36A]"
            title={isPlaying ? "Pause background video" : "Play background video"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-[#D4B36A]" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#D4B36A]" />
            )}
            <span>{isPlaying ? 'Pause video' : 'Play video'}</span>
          </button>}

          <button
            onClick={onExploreClick}
            className="hidden sm:inline-flex items-center gap-1.5 text-white/60 hover:text-[#D4B36A] transition-colors cursor-pointer"
          >
            <span>Scroll</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};

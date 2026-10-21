import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCtaSectionProps {
  onRegisterClick: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onRegisterClick }) => {
  return (
    <section
  aria-label="Closing Call to Action"
  className="py-20 lg:py-28 px-6 lg:px-12 bg-[#0A2419] text-white text-center relative overflow-hidden bg-cover bg-center"
  style={{
    backgroundImage:
      "linear-gradient(rgba(15, 51, 36, 0.75), rgba(10, 36, 25, 0.88)), url('/images/seminar-background.jpg')",
  }}
>
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#7BCB88]/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-block w-12 h-1 bg-[#7BCB88] mb-6"></div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white mb-6">
          Make your next connection count.
        </h2>

        <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto font-light mb-10 leading-relaxed">
          Join our free online seminar to discover how the HyreMoto Affiliate Program can open new
          possibilities for your network.
        </p>

        <div>
          <button
            onClick={onRegisterClick}
            className="inline-flex items-center justify-center px-10 py-4 rounded-full text-base font-bold bg-[#7BCB88] text-[#0F3324] hover:bg-[#A7E2B1] active:scale-[0.98] transition-all shadow-xl shadow-black/40 group cursor-pointer"
          >
            <span>Register for the Free Seminar</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        <p className="text-xs text-white/50 mt-4 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#7BCB88]" />
          <span>Free online seminar • Date to be announced</span>
        </p>
      </div>
    </section>
  );
};

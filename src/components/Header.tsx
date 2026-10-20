import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
export function Header({ onNavigateToSection }: { onNavigateToSection: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 40); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  useEffect(() => { const close = (e: KeyboardEvent) => { if(e.key === 'Escape') setOpen(false); }; window.addEventListener('keydown',close); return () => window.removeEventListener('keydown',close); }, []);
  const links = [['opportunity', 'The Opportunity'], ['what-you-learn', 'What You’ll Learn'], ['faqs', 'FAQs']];
  const go = (id: string) => { setOpen(false); onNavigateToSection(id); };
  return <header className={`fixed inset-x-0 top-0 z-50 px-4 sm:px-6 lg:px-12 py-4 transition-colors ${scrolled || open ? 'bg-[#08211A]/95 backdrop-blur-md border-b border-white/10' : 'bg-[#08211A]/60 sm:bg-transparent'}`}>
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
      <a href="#hero" className="text-white font-display font-extrabold text-xl sm:text-2xl tracking-wider">HYREMOTO<span className="hidden sm:inline text-[10px] font-sans text-[#D4B36A] border-l border-white/20 ml-3 pl-3 uppercase">Affiliate</span></a>
      <nav aria-label="Main navigation" className="hidden lg:flex gap-7 text-sm text-white/85">{links.map(([id,label]) => <a key={id} href={`#${id}`} className="hover:text-[#D4B36A]">{label}</a>)}</nav>
      <div className="flex items-center gap-2"><button onClick={() => go('register')} className="rounded-full bg-[#D4B36A] text-[#0C3027] px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold">Reserve Your Spot</button><button className="lg:hidden p-2 text-white" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
    </div>
    {open && <nav id="mobile-nav" aria-label="Mobile navigation" className="lg:hidden flex flex-col gap-1 pt-5 text-white">{links.map(([id,label]) => <button key={id} onClick={() => go(id)} className="text-left py-3 border-t border-white/10">{label}</button>)}</nav>}
  </header>;
}

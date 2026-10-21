import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { OpportunitySection } from './components/OpportunitySection';
import { CurriculumSection } from './components/CurriculumSection';
import { WhoShouldAttendSection } from './components/WhoShouldAttendSection';
import { RegistrationSection } from './components/RegistrationSection';
import { AboutSection } from './components/AboutSection';
import { FaqSection } from './components/FaqSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { AdminPage } from './components/AdminPage';

export default function App() {
  const [category, setCategory] = useState('');
  const [admin, setAdmin] = useState(window.location.hash === '#admin');
  useEffect(() => { const update = () => setAdmin(window.location.hash === '#admin'); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update); }, []);
  if (admin) return <AdminPage />;
  const navigate = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  return <div className="min-h-screen bg-[#FFFFFF] text-[#172822] font-sans">
    <a href="#main" className="skip-link">Skip to content</a>
    <Header onNavigateToSection={navigate} />
    <main id="main">
      <HeroSection onReserveClick={() => navigate('register')} onExploreClick={() => navigate('opportunity')} />
      <OpportunitySection />
      <CurriculumSection />
      <WhoShouldAttendSection onSelectCategoryForForm={(value) => { setCategory(value); navigate('register'); }} />
      <RegistrationSection preselectedCategory={category} />
      <AboutSection />
      <FaqSection />
      <FinalCtaSection onRegisterClick={() => navigate('register')} />
    </main>
    <Footer onNavigateToSection={navigate} />
    <MobileStickyBar onReserveClick={() => navigate('register')} />
  </div>;
}

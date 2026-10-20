import React from 'react';
import { User, Video, Briefcase, Building2, Compass, Landmark, CheckCircle, ArrowRight } from 'lucide-react';

interface WhoShouldAttendSectionProps {
  onSelectCategoryForForm: (category: string) => void;
}

export const WhoShouldAttendSection: React.FC<WhoShouldAttendSectionProps> = ({
  onSelectCategoryForForm,
}) => {


  const personas = [
    {
      id: 'individual',
      category: 'Individual affiliate',
      title: 'Connected Individuals',
      icon: User,
      description:
        'Professionals, frequent travelers, and well-connected people whose circles frequently require premium vehicles or drivers across Nigerian cities.',
      strength: 'Friends, weddings, overseas diaspora visits & airport runs',
    },
    {
      id: 'creator',
      category: 'Influencer or content creator',
      title: 'Influencers & Creators',
      icon: Video,
      description:
        'Lifestyle, business, and travel content creators who speak to audiences seeking reliable transport, luxury arrivals, or airport concierge rides.',
      strength: 'Bio link referral, event coverage & lifestyle vlog promos',
    },
    {
      id: 'broker',
      category: 'Sales agent or broker',
      title: 'Sales Agents & Brokers',
      icon: Briefcase,
      description:
        'Independent agents working across real estate, protocol services, event planning, and concierge arrangements who need trusted vehicle suppliers.',
      strength: 'Client introductions, event connections & rental enquiries',
    },
    {
      id: 'business',
      category: 'Business owner or company representative',
      title: 'Business Owners',
      icon: Building2,
      description:
        'Business owners and representatives whose clients or partners may need vehicle rentals.',
      strength: 'Visiting business delegations, board meetings & partners',
    },
    {
      id: 'travel',
      category: 'Travel agent or travel business',
      title: 'Travel Agents & Tour Guides',
      icon: Compass,
      description:
        'Travel agencies, tour curators, and hotel concierges looking to connect travellers with vehicle rental options.',
      strength: 'Packaged tour logistics, airport pickups & stay extensions',
    },
    {
      id: 'corporate',
      category: 'Corporate partnership representative',
      title: 'Corporate Representatives',
      icon: Landmark,
      description:
        'Procurement leads and partnership managers seeking the affiliate opportunity for their organisation.',
      strength: 'Business relationships & partnership enquiries',
    },
  ];

  return (
    <section
      id="who-should-attend"
      aria-labelledby="who-heading"
      className="py-16 lg:py-20 px-6 lg:px-12 bg-[#F7F4EC] text-[#172822]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 lg:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#D4B36A]"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-[#0C3027]/70">
              Participants
            </span>
          </div>
          <h2
            id="who-heading"
            className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-[#0C3027] leading-[1.15] mb-4"
          >
            There’s more than one way to be connected.
          </h2>
          <p className="text-base text-[#4A5B53]">
            Our affiliate ecosystem is built for diverse network builders across industries.
            Choose your category to prefill the registration form.
          </p>
        </div>

        {/* Compact 6-card editorial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => {
            const Icon = persona.icon;
            const isSelected = false;

            return (
              <div
                key={persona.id}
                className={`bg-white p-7 rounded-2xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-[#D4B36A] shadow-md ring-2 ring-[#D4B36A]/20'
                    : 'border-[#172822]/10 shadow-sm hover:shadow-md hover:border-[#172822]/20'
                }`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[#EFEBE0] flex items-center justify-center text-[#0C3027]">
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-[#0C3027] text-[#D4B36A] px-2.5 py-0.5 rounded-full">
                      Selected Persona
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#0C3027] mb-2">{persona.title}</h3>

                <p className="text-sm text-[#4A5B53] leading-relaxed mb-4">{persona.description}</p>

                {/* Persona Breakdown when toggled or hovered */}
                <div className="pt-3 border-t border-[#172822]/10 text-xs space-y-1.5">
                  <div className="text-[#0C3027] font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4B36A]"></span>
                    <span>Best For: {persona.strength}</span>
                  </div>

                </div>

                {/* Quick Register as this role button */}
                <div className="mt-4 pt-3 border-t border-[#172822]/5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCategoryForForm(persona.category);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0C3027] hover:text-[#D4B36A] transition-colors"
                  >
                    <span>Register in this category</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-xs text-[#4A5B53]">
          Participation is open to all qualified categories. Joining the program remains subject to
          official verification.
        </div>
      </div>
    </section>
  );
};

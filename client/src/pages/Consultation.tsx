import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, Check, Shield, Watch, Glasses, Gem, Sparkle, Heart, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { ConsultationProfile } from '../types';

export const Consultation: React.FC = () => {
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const totalSteps = 5;

  const [formData, setFormData] = useState<ConsultationProfile>({
    recipientName: '',
    relationship: 'partner',
    occasion: 'anniversary',
    interests: ['Fine Horology & Watches', 'Niche Perfumes & Scents'],
    personality: ['innovative', 'refined'],
    desiredEmotion: 'romance',
    budget: { min: 10000, max: 35000, currency: 'INR' },
    productCategories: ['wearables_eyewear', 'curated_boxes'],
    exclusions: [],
    notes: ''
  });

  const relationships = [
    { id: 'partner', label: 'Partner / Spouse', icon: '💍', desc: 'Intimate, lasting heirloom of devotion' },
    { id: 'best_friend', label: 'Best Friend', icon: '✨', desc: 'Inside memories, shared journeys' },
    { id: 'father', label: 'Father', icon: '👔', desc: 'Quiet admiration, utility & prestige' },
    { id: 'mother', label: 'Mother', icon: '🌸', desc: 'Deep care, pampering & grace' },
    { id: 'sibling', label: 'Brother / Sister', icon: '⚡', desc: 'Modern lifestyle, dynamic tech' },
    { id: 'colleague', label: 'Mentor / Colleague', icon: '💼', desc: 'Refined professional milestone' },
  ];

  const occasions = [
    { id: 'anniversary', label: 'Cherished Anniversary', tag: 'Romance & Heirloom', icon: '🥂' },
    { id: 'birthday', label: 'Milestone Birthday', tag: 'Personal Celebration', icon: '🎂' },
    { id: 'thank_you', label: 'Deep Gratitude', tag: 'Sincere Appreciation', icon: '🙏' },
    { id: 'promotion', label: 'Career Breakthrough', tag: 'Milestone Triumph', icon: '🚀' },
    { id: 'housewarming', label: 'New Sanctuary / Home', tag: 'Ambient Living', icon: '🏡' },
    { id: 'just_because', label: 'Just Because / Unprompted', tag: 'Pure Delight', icon: '🎁' },
  ];

  // Zero food items! Pure luxury tech, watches, perfumes, sunglasses, leather, and keepsakes.
  const aestheticCategories = [
    { id: 'Fine Horology & Watches', label: 'Luxury Watches & Horology', icon: <Watch className="w-5 h-5" />, desc: 'Mechanical automatic timepieces' },
    { id: 'Niche Perfumes & Scents', label: 'Artisan Perfume & Botanical Scents', icon: <Sparkle className="w-5 h-5" />, desc: 'Single-harvest Grasse extraits' },
    { id: 'Handcrafted Sunglasses', label: 'Designer Sunglasses & Eyewear', icon: <Glasses className="w-5 h-5" />, desc: 'Japanese titanium & acetate frames' },
    { id: 'Biometric Rings & Health', label: 'Biometric Rings & Smart Recovery', icon: <Gem className="w-5 h-5" />, desc: 'Titanium biometric wellness rings' },
    { id: 'Tuscan Leather & Totes', label: 'Handcrafted Italian Leather Goods', icon: <Compass className="w-5 h-5" />, desc: 'Full-grain bags, wallets & journals' },
    { id: 'Bespoke Keepsakes & Maps', label: 'Bespoke Star Maps & Engraved Art', icon: <Heart className="w-5 h-5" />, desc: 'Coordinate bracelets & soundwave art' },
  ];

  const emotions = [
    {
      id: 'romance',
      title: 'Tender Romance & Devotion',
      subtitle: 'A meaningful heirloom that deepens your shared intimacy.',
      tag: 'Cherished Bond'
    },
    {
      id: 'appreciation',
      title: 'Quiet Respect & Gratitude',
      subtitle: 'Making them feel genuinely recognized and treasured.',
      tag: 'Sincere Honor'
    },
    {
      id: 'celebration',
      title: 'Breakthrough Wonder & Joy',
      subtitle: 'An awe-inspiring innovation that sparks pure excitement.',
      tag: 'Triumph'
    },
    {
      id: 'comfort',
      title: 'Daily Solace & Warm Haven',
      subtitle: 'Effortless luxury that brings restorative peace to their life.',
      tag: 'Restoration'
    },
  ];

  const budgetTiers = [
    { min: 3000, max: 10000, label: 'Bespoke Keepsakes', range: '₹3,000 – ₹10,000', desc: 'Star maps, engraved metal tokens, custom journals' },
    { min: 10000, max: 35000, label: 'Atelier Curations', range: '₹10,000 – ₹35,000', desc: 'Biometric rings, niche perfumes, Italian leather' },
    { min: 35000, max: 85000, label: 'Signature Heirlooms', range: '₹35,000 – ₹85,000+', desc: 'Swiss automatic chronographs, luxury travel bags' },
  ];

  const toggleInterest = (id: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(id);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter(item => item !== id)
          : [...prev.interests, id]
      };
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      runCalibration();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const runCalibration = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      saveSession({
        recipientName: formData.recipientName || 'Recipient',
        relationship: formData.relationship,
        occasion: formData.occasion,
        desiredEmotion: formData.desiredEmotion,
        budgetFormatted: `₹${formData.budget.min.toLocaleString('en-IN')} – ₹${formData.budget.max.toLocaleString('en-IN')}`,
        interests: formData.interests
      });
      navigate('/recommendations', { state: { profile: formData } });
    }, 2400);
  };

  return (
    <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[7rem] pb-[6rem] px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header (Continuous Kolibrie Styling) */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#141110]/10 text-xs font-archivo uppercase tracking-widest text-[#ef4a23] font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Sentiment Calibration</span>
          </div>
          <h1
            className="font-archivo uppercase text-4xl sm:text-6xl font-bold tracking-tight text-[#141110] leading-none"
            style={{ fontStretch: '72%' }}
          >
            THE CONSULTATION <span className="font-playfair italic font-normal text-[#ef4a23] lowercase">session.</span>
          </h1>
          <p className="font-playfair text-base sm:text-lg text-[#141110]/75 max-w-xl mx-auto leading-relaxed italic">
            Calibrate intent, aesthetic nuances, and personal coordinates to discover gifts that feel truly irreplaceable.
          </p>

          {/* Step Indicator Progress Bar */}
          <div className="pt-6 max-w-md mx-auto">
            <div className="flex justify-between items-center text-xs font-archivo uppercase tracking-wider text-[#141110]/60 mb-2 font-bold">
              <span>Step 0{currentStep}</span>
              <span>Total 0{totalSteps}</span>
            </div>
            <div className="h-2 w-full bg-[#141110]/10 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-[#ef4a23] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* INTERACTIVE WORKSPACE CARD */}
        <div className="bg-white rounded-3xl border border-[#141110]/10 shadow-[0_20px_50px_rgba(20,17,16,0.06)] p-6 sm:p-10 relative overflow-hidden">
          
          {/* STEP 1: RECIPIENT & RELATIONSHIP */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#ef4a23] font-bold">Step 01 / 05</span>
                <h2 className="font-archivo uppercase text-2xl sm:text-3xl font-bold text-[#141110] mt-1">
                  Who are we honoring today?
                </h2>
                <p className="font-playfair text-sm sm:text-base text-[#141110]/70 mt-1 italic">
                  Every relationship speaks its own subtle language.
                </p>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80">
                  Recipient Name or Personal Nickname *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Eleanor, Marcus, Mom, Dev"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full px-5 py-4 bg-[#faf3e4]/40 rounded-2xl border border-[#141110]/15 text-lg font-archivo focus:outline-none focus:border-[#ef4a23] focus:bg-white transition-all shadow-xs"
                />
              </div>

              {/* Relationship Cards */}
              <div className="space-y-3">
                <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80">
                  Your Bond with Them
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {relationships.map((rel) => {
                    const isSelected = formData.relationship === rel.id;
                    return (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, relationship: rel.id })}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#141110] text-[#faf3e4] border-[#141110] shadow-md scale-[1.02]'
                            : 'bg-white hover:bg-[#faf3e4]/50 border-[#141110]/10 text-[#141110]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{rel.icon}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#ffd46e]" />}
                        </div>
                        <div className="mt-3">
                          <h4 className="font-archivo uppercase text-xs font-bold tracking-wide">
                            {rel.label}
                          </h4>
                          <p className={`text-[11px] font-playfair mt-0.5 line-clamp-1 italic ${isSelected ? 'text-[#faf3e4]/70' : 'text-[#141110]/60'}`}>
                            {rel.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: OCCASION & MILESTONE */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#ef4a23] font-bold">Step 02 / 05</span>
                <h2 className="font-archivo uppercase text-2xl sm:text-3xl font-bold text-[#141110] mt-1">
                  What is the occasion?
                </h2>
                <p className="font-playfair text-sm sm:text-base text-[#141110]/70 mt-1 italic">
                  Gifts mark chapters in time. Tell us what we are commemorating.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {occasions.map((occ) => {
                  const isSelected = formData.occasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, occasion: occ.id })}
                      className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#141110] text-[#faf3e4] border-[#141110] shadow-md scale-[1.02]'
                          : 'bg-white hover:bg-[#faf3e4]/50 border-[#141110]/10 text-[#141110]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{occ.icon}</span>
                        <span className={`text-[10px] font-archivo uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#ef4a23] text-white' : 'bg-stone-100 text-[#141110]/70'
                        }`}>
                          {occ.tag}
                        </span>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-archivo uppercase text-sm font-bold tracking-tight">
                          {occ.label}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: AESTHETIC & LIFESTYLE (NO FOOD!) */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#ef4a23] font-bold">Step 03 / 05</span>
                <h2 className="font-archivo uppercase text-2xl sm:text-3xl font-bold text-[#141110] mt-1">
                  What aesthetic & craft matches their style?
                </h2>
                <p className="font-playfair text-sm sm:text-base text-[#141110]/70 mt-1 italic">
                  Select all that resonate. Handcrafted horology, fragrances, titanium eyewear, or leather.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aestheticCategories.map((item) => {
                  const isSelected = formData.interests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                        isSelected
                          ? 'bg-[#ef4a23] text-white border-[#ef4a23] shadow-md'
                          : 'bg-white hover:bg-[#faf3e4]/50 border-[#141110]/10 text-[#141110]'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-[#faf3e4] text-[#ef4a23]'}`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-archivo uppercase text-sm font-bold tracking-tight">
                            {item.label}
                          </h4>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <p className={`text-xs font-playfair mt-1 italic ${isSelected ? 'text-white/80' : 'text-[#141110]/60'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: DESIRED SENTIMENT */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#ef4a23] font-bold">Step 04 / 05</span>
                <h2 className="font-archivo uppercase text-2xl sm:text-3xl font-bold text-[#141110] mt-1">
                  What feeling should this gift evoke?
                </h2>
                <p className="font-playfair text-sm sm:text-base text-[#141110]/70 mt-1 italic">
                  The heart of CHARIS. Every gift has an emotional intent.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {emotions.map((emo) => {
                  const isSelected = formData.desiredEmotion === emo.id;
                  return (
                    <button
                      key={emo.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, desiredEmotion: emo.id })}
                      className={`p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#141110] text-[#faf3e4] border-[#141110] shadow-lg scale-[1.02]'
                          : 'bg-white hover:bg-[#faf3e4]/50 border-[#141110]/10 text-[#141110]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-archivo uppercase tracking-wider px-2.5 py-1 rounded-full font-bold ${
                          isSelected ? 'bg-[#ffd46e] text-[#141110]' : 'bg-[#faf3e4] text-[#ef4a23]'
                        }`}>
                          {emo.tag}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#ffd46e]" />}
                      </div>
                      <div className="mt-4 space-y-1">
                        <h4 className="font-archivo uppercase text-base font-bold tracking-tight">
                          {emo.title}
                        </h4>
                        <p className={`text-xs font-playfair italic leading-relaxed ${isSelected ? 'text-[#faf3e4]/80' : 'text-[#141110]/70'}`}>
                          {emo.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: BUDGET & BESPOKE DETAILS */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#ef4a23] font-bold">Step 05 / 05</span>
                <h2 className="font-archivo uppercase text-2xl sm:text-3xl font-bold text-[#141110] mt-1">
                  Budget tier & custom engraving nuances
                </h2>
                <p className="font-playfair text-sm sm:text-base text-[#141110]/70 mt-1 italic">
                  Transparent atelier pricing with zero hidden retail surcharges.
                </p>
              </div>

              {/* Budget Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {budgetTiers.map((tier) => {
                  const isSelected = formData.budget.min === tier.min && formData.budget.max === tier.max;
                  return (
                    <button
                      key={tier.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: { min: tier.min, max: tier.max, currency: 'INR' } })}
                      className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#ef4a23] text-white border-[#ef4a23] shadow-md scale-[1.02]'
                          : 'bg-white hover:bg-[#faf3e4]/50 border-[#141110]/10 text-[#141110]'
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] font-archivo uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#141110]/60'
                        }`}>
                          Tier
                        </span>
                        <h4 className="font-archivo uppercase text-sm font-bold tracking-tight mt-2">
                          {tier.label}
                        </h4>
                        <span className="text-base font-archivo font-bold block mt-1">
                          {tier.range}
                        </span>
                      </div>
                      <p className={`text-[11px] font-playfair mt-3 italic ${isSelected ? 'text-white/80' : 'text-[#141110]/60'}`}>
                        {tier.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Personal Notes / Engraving Intention */}
              <div className="space-y-2">
                <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80">
                  Special Dates, Locations or Meaningful Coordinates (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wedding date 14.02.2021, Paris coordinates, initials 'E & J'"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#faf3e4]/40 rounded-xl border border-[#141110]/15 text-sm font-sans focus:outline-none focus:border-[#ef4a23] focus:bg-white transition-all shadow-xs"
                />
              </div>
            </div>
          )}

          {/* NAVIGATION ACTION BAR */}
          <div className="pt-8 border-t border-[#141110]/10 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 rounded-full border border-[#141110]/20 hover:bg-[#141110]/5 text-[#141110] font-archivo uppercase text-xs tracking-widest font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              disabled={currentStep === 1 && (!formData.recipientName || !formData.recipientName.trim())}
              className="px-8 py-3.5 rounded-full bg-[#ef4a23] hover:bg-[#141110] disabled:opacity-40 disabled:cursor-not-allowed text-white font-archivo uppercase text-xs tracking-widest font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>{currentStep === totalSteps ? 'Calibrate & Reveal Curations' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* LOADING / CALIBRATION OVERLAY */}
        {isCalibrating && (
          <div className="fixed inset-0 z-[300] bg-[#141110]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-[#faf3e4] text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white/10 border-t-[#ef4a23] animate-spin" />
              <Sparkles className="w-8 h-8 text-[#ffd46e] animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="font-archivo uppercase text-2xl sm:text-3xl font-bold tracking-tight">
                Calibrating Sentiment Index
              </h3>
              <p className="font-playfair text-base sm:text-lg text-[#faf3e4]/70 italic">
                Cross-referencing {formData.recipientName || 'your recipient'}'s emotional profile with 100+ master atelier keepsakes...
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 font-mono text-xs text-[#ffd46e]">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero mass-retail items • 100% Provenance Guaranteed</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Consultation;

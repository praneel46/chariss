import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, Check, Shield, Zap, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CURATED_PRODUCTS } from '../data/mockData';
import type { ConsultationProfile } from '../types';

export const Consultation: React.FC = () => {
  const navigate = useNavigate();
  const { saveSession, isAuthenticated } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const totalSteps = 6;

  const [formData, setFormData] = useState<ConsultationProfile>({
    recipientName: '',
    relationship: 'partner',
    occasion: 'anniversary',
    interests: ['Smart Wearables & Audio', 'Smart Living & Tech'],
    personality: ['innovative', 'refined'],
    desiredEmotion: 'romance',
    budget: { min: 15000, max: 45000, currency: 'INR' },
    productCategories: ['wearables_eyewear', 'curated_boxes'],
    exclusions: [],
    notes: ''
  });

  const relationships = [
    { id: 'partner', label: 'Partner / Spouse', icon: '💍', desc: 'Intimate, lasting, celebratory' },
    { id: 'best_friend', label: 'Best Friend', icon: '✨', desc: 'Inside jokes, mutual passions' },
    { id: 'father', label: 'Father', icon: '👔', desc: 'Quiet admiration, utility & prestige' },
    { id: 'mother', label: 'Mother', icon: '🌸', desc: 'Deep care, pampering & grace' },
    { id: 'sibling', label: 'Brother / Sister', icon: '🎈', desc: 'Dynamic, modern lifestyle' },
    { id: 'colleague', label: 'Mentor / Colleague', icon: '💼', desc: 'Refined professional milestone' },
  ];

  const occasions = [
    { id: 'anniversary', label: 'Cherished Anniversary', tag: 'Romance & Heirloom', icon: '🥂' },
    { id: 'birthday', label: 'Milestone Birthday', tag: 'Personal Celebration', icon: '🎂' },
    { id: 'thank_you', label: 'Deep Gratitude', tag: 'Sincere Appreciation', icon: '🙏' },
    { id: 'promotion', label: 'Career Breakthrough / Graduation', tag: 'Achievement', icon: '🚀' },
    { id: 'housewarming', label: 'New Sanctuary / Housewarming', tag: 'Smart Living', icon: '🏡' },
    { id: 'just_because', label: 'Just Because / Unprompted', tag: 'Pure Delight', icon: '🎁' },
  ];

  const interestCategories = [
    { id: 'Smart Wearables & Audio', label: 'Smart Glasses & Wearables', icon: '🕶️' },
    { id: 'Biometrics & Rings', label: 'Biometric Rings & Health Tech', icon: '💍' },
    { id: 'Smart Living & Tech', label: 'Smart Home & Ambient Lighting', icon: '💡' },
    { id: 'Content Creation & Gear', label: 'Content Creation & Gimbal Cameras', icon: '📸' },
    { id: 'Luxury Leather & Bags', label: 'Luxury Bags & Travel Gear', icon: '👜' },
    { id: 'Fine Timepieces', label: 'Smartwatches & Horology', icon: '⌚' },
    { id: 'Biohacking & Wellness', label: 'Metabolism & Deep Recovery Tech', icon: '🧘' },
    { id: 'Robotics & Automation', label: 'Autonomous Home & Pet Robotics', icon: '🤖' },
  ];

  const emotions = [
    {
      id: 'romance',
      title: 'Tender Romance & Devotion',
      subtitle: 'A meaningful heirloom that deepens your shared bond.',
      gradient: 'from-amber-50 to-rose-50 border-rose-200'
    },
    {
      id: 'appreciation',
      title: 'Quiet Respect & Gratitude',
      subtitle: 'Making them feel genuinely recognized and treasured.',
      gradient: 'from-stone-50 to-amber-50 border-amber-200'
    },
    {
      id: 'celebration',
      title: 'Breakthrough Joy & Wonder',
      subtitle: 'An awe-inspiring innovation that sparks pure excitement.',
      gradient: 'from-amber-50 to-emerald-50 border-emerald-200'
    },
    {
      id: 'comfort',
      title: 'Restoration & Daily Ease',
      subtitle: 'Effortless luxury that brings peace to their daily life.',
      gradient: 'from-blue-50 to-stone-50 border-blue-200'
    },
  ];

  const budgetPresets = [
    { min: 5000, max: 15000, label: 'Bespoke Essentials', range: '₹5,000 – ₹15,000' },
    { min: 15000, max: 35000, label: 'Curated Smart Luxury', range: '₹15,000 – ₹35,000' },
    { min: 35000, max: 70000, label: 'Signature Heirlooms', range: '₹35,000 – ₹70,000+' },
  ];

  const exclusionTags = [
    'No Screen Devices',
    'No Leather Goods',
    'Minimalist Only',
    'iOS / Apple Ecosystem Only',
    'Quiet / Screenless Only'
  ];

  // Dynamic live matching count based on current form
  const liveMatchCount = CURATED_PRODUCTS.filter(p => {
    return p.price <= (formData.budget.max || 100000);
  }).length;

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleExclusionToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.includes(tag)
        ? prev.exclusions.filter(t => t !== tag)
        : [...prev.exclusions, tag]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Trigger AI calibration animation
      setIsCalibrating(true);
      setTimeout(() => {
        localStorage.setItem('charis_active_consultation', JSON.stringify(formData));
        
        // Save to member session
        saveSession({
          recipientName: formData.recipientName || 'Recipient',
          relationship: formData.relationship,
          occasion: formData.occasion,
          desiredEmotion: formData.desiredEmotion,
          budgetFormatted: `₹${formData.budget.min.toLocaleString('en-IN')} – ₹${formData.budget.max.toLocaleString('en-IN')}`,
          interests: formData.interests
        });

        navigate('/recommendations');
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  if (isCalibrating) {
    return (
      <div className="bg-[#FAF9F6] py-32 px-4 flex flex-col items-center justify-center text-center min-h-[75vh]">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-[#EDE5DA] border-t-[#D4A359] animate-spin flex items-center justify-center" />
          <Sparkles className="w-8 h-8 text-[#D4A359] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#292820]">
          Synthesizing Emotional Match...
        </h2>
        <p className="text-sm text-[#292820]/70 mt-2 max-w-md font-mono">
          Calibrating 50+ verified smart wearables, timepieces, luxury leather, and home innovations against {formData.recipientName || 'your recipient'}'s profile.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] py-10 md:py-16 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Dynamic Neural HUD Banner */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#292820]/10 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#151419] text-[#D4A359] flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 fill-[#D4A359]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  CHARIS Concierge AI • Active Engine
                </span>
              </div>
              <p className="text-xs text-[#292820] font-medium mt-0.5">
                Calibrating live matches for <strong className="font-serif">{formData.recipientName || 'Your Recipient'}</strong>
              </p>
            </div>
          </div>

          {/* Real-time match counter indicator */}
          <div className="flex items-center gap-2 bg-[#EDE5DA]/50 px-3 py-1.5 rounded-full border border-[#292820]/10">
            <Eye className="w-3.5 h-3.5 text-[#B69A78]" />
            <span className="text-xs font-mono font-bold text-[#292820]">
              {liveMatchCount} Curated Pieces Calibrated
            </span>
          </div>
        </div>

        {/* Step Indicator & Fluid Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold mb-2">
            <span>Stage 0{currentStep} / 0{totalSteps}</span>
            <span>{progressPercentage}% Calibrated</span>
          </div>
          <div className="w-full h-1.5 bg-[#EDE5DA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#151419] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Main Wizard Card Container */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#292820]/10 shadow-lg relative transition-all">
          
          {/* STEP 1: RELATIONSHIP */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Stage 01 • The Connection
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                  Who are you looking to honor?
                </h2>
                <p className="text-sm text-[#292820]/70 mt-1 leading-relaxed">
                  Relationship dynamics govern emotional intimacy, gift etiquette, and perceived thoughtfulness.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-[#292820]/80">
                  Recipient Name or Preferred Nickname
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="e.g. Maya, Julian, Dad, Sarah"
                  className="w-full px-4 py-3 rounded-lg bg-[#FAF9F6] border border-[#292820]/15 text-sm text-[#292820] focus:outline-none focus:border-[#B69A78]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {relationships.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => setFormData({ ...formData, relationship: rel.id })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      formData.relationship === rel.id
                        ? 'border-[#292820] bg-[#FAF9F6] ring-2 ring-[#151419]'
                        : 'border-[#292820]/15 hover:border-[#292820]/40 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{rel.icon}</span>
                      {formData.relationship === rel.id && (
                        <span className="w-2 h-2 rounded-full bg-[#D4A359]" />
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="font-serif text-sm font-bold text-[#292820]">
                        {rel.label}
                      </p>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                        {rel.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: OCCASION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Stage 02 • The Occasion
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                  What moment are we celebrating?
                </h2>
                <p className="text-sm text-[#292820]/70 mt-1">
                  Occasions set the celebratory tenor, surprise factor, and commemorative weight.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {occasions.map((occ) => {
                  const isSelected = formData.occasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      onClick={() => setFormData({ ...formData, occasion: occ.id })}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#292820] bg-[#FAF9F6] ring-2 ring-[#151419]'
                          : 'border-[#292820]/15 hover:border-[#292820]/40 bg-white'
                      }`}
                    >
                      <span className="text-2xl">{occ.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-sm font-bold text-[#292820]">{occ.label}</h4>
                          {isSelected && <Check className="w-4 h-4 text-[#D4A359]" />}
                        </div>
                        <span className="text-[10px] font-mono text-[#B69A78] uppercase font-bold mt-0.5 block">
                          {occ.tag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: PASSIONS & LIFESTYLE */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Stage 03 • Daily Rituals & Passions
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                  What captures {formData.recipientName || 'their'} curiosity?
                </h2>
                <p className="text-sm text-[#292820]/70 mt-1">
                  Select 2 or more areas of lifestyle interest. (No food/beverage items).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interestCategories.map((cat) => {
                  const isSelected = formData.interests.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleInterestToggle(cat.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#151419] bg-[#151419] text-[#FAF9F6]'
                          : 'border-[#292820]/15 hover:border-[#292820]/40 bg-[#FAF9F6] text-[#292820]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-serif text-xs sm:text-sm font-bold">{cat.label}</span>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#D4A359]" />
                      ) : (
                        <span className="text-xs font-mono text-stone-400">+</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: EMOTIONAL INTENT */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Stage 04 • The Emotional Resonance
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                  What feeling do you wish to awaken?
                </h2>
                <p className="text-sm text-[#292820]/70 mt-1">
                  Every gift carries an emotional frequency. Choose the sentiment you want them to feel upon opening.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {emotions.map((emo) => {
                  const isSelected = formData.desiredEmotion === emo.id;
                  return (
                    <button
                      key={emo.id}
                      onClick={() => setFormData({ ...formData, desiredEmotion: emo.id })}
                      className={`p-5 rounded-xl border text-left transition-all cursor-pointer bg-gradient-to-br ${emo.gradient} ${
                        isSelected
                          ? 'border-[#151419] ring-2 ring-[#151419] shadow-sm'
                          : 'border-opacity-60 hover:border-opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-serif text-base font-bold text-[#292820]">
                          {emo.title}
                        </h4>
                        {isSelected && <Check className="w-4 h-4 text-[#D4A359]" />}
                      </div>
                      <p className="text-xs text-[#292820]/75 leading-relaxed">
                        {emo.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: BUDGET IN INR */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Stage 05 • Budget Boundary (INR ₹)
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                  What is your target investment?
                </h2>
                <p className="text-sm text-[#292820]/70 mt-1">
                  All recommendations strictly adhere to verified pricing with zero hidden checkout markups.
                </p>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {budgetPresets.map((b, i) => {
                  const isMatch = formData.budget.min === b.min && formData.budget.max === b.max;
                  return (
                    <button
                      key={i}
                      onClick={() => setFormData({ ...formData, budget: { min: b.min, max: b.max, currency: 'INR' } })}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isMatch
                          ? 'border-[#151419] bg-[#151419] text-[#FAF9F6]'
                          : 'border-[#292820]/15 hover:border-[#292820]/40 bg-[#FAF9F6] text-[#292820]'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-wider block opacity-75">
                        {b.label}
                      </span>
                      <strong className="font-serif text-base block mt-1">
                        {b.range}
                      </strong>
                    </button>
                  );
                })}
              </div>

              {/* Slider Adjustment */}
              <div className="pt-4 border-t border-[#292820]/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-500 uppercase">Maximum Budget Ceiling</span>
                  <span className="text-sm font-bold text-[#292820]">
                    ₹{formData.budget.max.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="75000"
                  step="2500"
                  value={formData.budget.max}
                  onChange={(e) => setFormData({
                    ...formData,
                    budget: { ...formData.budget, max: Number(e.target.value) }
                  })}
                  className="w-full accent-[#151419] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 6: PREFERENCES & EXCLUSIONS */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Stage 06 • Personal Notes & Exclusions (Optional)
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                  Any specific preferences or exclusions?
                </h2>
                <p className="text-sm text-[#292820]/70 mt-1">
                  Tag specific nuances or share a personal memory for the AI letterpress card writer to reference.
                </p>
              </div>

              {/* Exclusion Tags */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#292820]/70">
                  Filter by Specific Boundaries
                </label>
                <div className="flex flex-wrap gap-2">
                  {exclusionTags.map((tag) => {
                    const isTagged = formData.exclusions.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleExclusionToggle(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                          isTagged
                            ? 'bg-stone-800 text-white'
                            : 'bg-[#EDE5DA]/50 text-stone-700 hover:bg-[#EDE5DA]'
                        }`}
                      >
                        {tag} {isTagged && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#292820]/70">
                  Shared Memory or Personal Quirk (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Loves minimalist titanium aesthetics, travels frequently for work, appreciates quiet design."
                  className="w-full p-4 rounded-lg bg-[#FAF9F6] border border-[#292820]/15 text-xs sm:text-sm text-[#292820] focus:outline-none focus:border-[#B69A78] resize-none"
                />
              </div>

              {/* Member Session Sync Notice */}
              <div className="p-3.5 bg-[#EDE5DA]/40 rounded-xl flex items-center justify-between text-xs text-[#292820]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#B69A78] shrink-0" />
                  <span>
                    {isAuthenticated
                      ? 'Session automatically synced to your Member Sanctuary.'
                      : 'Consultation will run in private mode. Sign in anytime to preserve history.'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-10 pt-6 border-t border-[#292820]/10 flex items-center justify-between gap-4">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-[#292820] font-bold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              )}
            </div>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider shadow-brutal hover:bg-[#292820] transition-all cursor-pointer"
            >
              <span>{currentStep === totalSteps ? 'Synthesize Recommendations' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4A359]" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

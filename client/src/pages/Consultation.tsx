import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Shield } from 'lucide-react';
import type { ConsultationProfile } from '../types';

export const Consultation: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState<ConsultationProfile>({
    recipientName: '',
    relationship: 'best_friend',
    occasion: 'birthday',
    interests: ['tea', 'nature'],
    personality: ['thoughtful', 'epicurean'],
    desiredEmotion: 'appreciation',
    budget: { min: 1000, max: 3500, currency: 'INR' },
    productCategories: ['wellness_gourmet', 'home_decor'],
    exclusions: [],
    notes: ''
  });

  const relationships = [
    { id: 'partner', label: 'Partner / Spouse', icon: '💍' },
    { id: 'best_friend', label: 'Best Friend', icon: '✨' },
    { id: 'mother', label: 'Mother', icon: '🌸' },
    { id: 'father', label: 'Father', icon: '🌿' },
    { id: 'sibling', label: 'Sibling', icon: '🎈' },
    { id: 'colleague', label: 'Colleague / Mentor', icon: '💼' },
  ];

  const occasions = [
    { id: 'birthday', label: 'Birthday Celebration' },
    { id: 'anniversary', label: 'Cherished Anniversary' },
    { id: 'thank_you', label: 'Deep Gratitude / Thank You' },
    { id: 'housewarming', label: 'New Home / Housewarming' },
    { id: 'just_because', label: 'Just Because / Unprompted' },
  ];

  const interestOptions = [
    'Artisanal Tea & Coffee',
    'Botanicals & Nature',
    'Fine Stationery & Journaling',
    'Sensory Fragrance & Candles',
    'Interior Design & Ceramics',
    'Reading & Literature',
    'Culinary Arts & Gourmet',
    'Self-Care & Slow Living'
  ];

  const emotions = [
    { id: 'appreciation', label: 'Quiet Appreciation', desc: 'Making them feel genuinely seen and valued' },
    { id: 'romance', label: 'Tender Romance', desc: 'An intimate keepsake celebrating your bond' },
    { id: 'comfort', label: 'Warmth & Comfort', desc: 'A soothing sanctuary token for stressful days' },
    { id: 'celebration', label: 'Joyous Breakthrough', desc: 'Lively, memorable toast to high achievement' },
  ];

  const budgets = [
    { min: 500, max: 1500, label: 'Modest & Sweet (₹500 – ₹1,500)' },
    { min: 1500, max: 3500, label: 'Curated Artisan (₹1,500 – ₹3,500)' },
    { min: 3500, max: 7000, label: 'Signature Keepsake (₹3,500 – ₹7,000)' },
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save consultation profile in session/local storage and navigate to recommendations
      localStorage.setItem('charis_active_consultation', JSON.stringify(formData));
      navigate('/recommendations');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    handleNext();
  };

  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="bg-[#FAF9F6] py-12 md:py-20 min-h-[80vh] flex flex-col justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
        
        {/* Step Indicator & Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold mb-2">
            <span>Question {currentStep} of {totalSteps}</span>
            <span>{progressPercentage}% Completed</span>
          </div>
          <div className="w-full h-1.5 bg-[#EDE5DA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#151419] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Wizard Card Container */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#292820]/10 shadow-sm relative">
          
          {/* Step 1: Relationship */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Step 01
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                  Who are you gifting for?
                </h2>
                <p className="text-sm text-[#292820]/70 mt-1">
                  We use their relationship to gauge intimacy, tone, and appropriate etiquette.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-mono uppercase text-[#292820]/80">
                  Recipient Name or Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="e.g. Maya, Mom, Dev"
                  className="w-full px-4 py-3 rounded-lg bg-[#FAF9F6] border border-[#292820]/15 text-sm text-[#292820] focus:outline-none focus:border-[#B69A78]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {relationships.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => setFormData({ ...formData, relationship: rel.id })}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      formData.relationship === rel.id
                        ? 'border-[#292820] bg-[#FAF9F6] ring-1 ring-[#292820]'
                        : 'border-[#292820]/15 hover:border-[#292820]/40'
                    }`}
                  >
                    <span className="text-xl">{rel.icon}</span>
                    <p className="font-serif text-xs font-bold text-[#292820] mt-2">
                      {rel.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Occasion */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Step 02
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                  What is the occasion?
                </h2>
                <p className="text-sm text-[#292820]/70 mt-1">
                  Occasions set the celebratory intensity and thematic resonance.
                </p>
              </div>

              <div className="space-y-3">
                {occasions.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => setFormData({ ...formData, occasion: occ.id })}
                    className={`w-full p-4 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                      formData.occasion === occ.id
                        ? 'border-[#292820] bg-[#FAF9F6] ring-1 ring-[#292820]'
                        : 'border-[#292820]/15 hover:border-[#292820]/40'
                    }`}
                  >
                    <span className="font-serif text-sm font-bold text-[#292820]">{occ.label}</span>
                    {formData.occasion === occ.id && <Check className="w-4 h-4 text-[#D4A359]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Interests & Quirks */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Step 03
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                  What does {formData.recipientName || 'your recipient'} gravitate toward?
                </h2>
                <p className="text-sm text-[#292820]/70 mt-1">
                  Select 2 or more areas of interest to guide our deterministic matching engine.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {interestOptions.map((item) => {
                  const isSelected = formData.interests.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => handleInterestToggle(item)}
                      className={`px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#151419] text-[#FAF9F6] shadow-xs'
                          : 'bg-[#FAF9F6] border border-[#292820]/15 text-[#292820]/80 hover:bg-[#EDE5DA]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Emotional Intent */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Step 04
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                  What feeling do you wish to evoke?
                </h2>
                <p className="text-sm text-[#292820]/70 mt-1">
                  The soul of CHARIS: aligning product attributes with emotional resonance.
                </p>
              </div>

              <div className="space-y-3">
                {emotions.map((emo) => (
                  <button
                    key={emo.id}
                    onClick={() => setFormData({ ...formData, desiredEmotion: emo.id })}
                    className={`w-full p-4 rounded-lg border text-left transition-all cursor-pointer ${
                      formData.desiredEmotion === emo.id
                        ? 'border-[#292820] bg-[#FAF9F6] ring-1 ring-[#292820]'
                        : 'border-[#292820]/15 hover:border-[#292820]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-bold text-[#292820]">{emo.label}</span>
                      {formData.desiredEmotion === emo.id && <Check className="w-4 h-4 text-[#D4A359]" />}
                    </div>
                    <p className="text-xs text-[#292820]/60 mt-1">{emo.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Budget */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Step 05
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                  What is your comfortable budget?
                </h2>
                <p className="text-sm text-[#292820]/70 mt-1">
                  All recommendations stay strictly within your target in INR (₹).
                </p>
              </div>

              <div className="space-y-3">
                {budgets.map((b, i) => {
                  const isMatch = formData.budget.min === b.min && formData.budget.max === b.max;
                  return (
                    <button
                      key={i}
                      onClick={() => setFormData({ ...formData, budget: { min: b.min, max: b.max, currency: 'INR' } })}
                      className={`w-full p-4 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isMatch
                          ? 'border-[#292820] bg-[#FAF9F6] ring-1 ring-[#292820]'
                          : 'border-[#292820]/15 hover:border-[#292820]/40'
                      }`}
                    >
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#292820]">{b.label}</span>
                      {isMatch && <Check className="w-4 h-4 text-[#D4A359]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6: Exclusions & Memories (Optional) */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Step 06 (Optional)
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                  Any exclusions or shared memories?
                </h2>
                <p className="text-sm text-[#292820]/70 mt-1">
                  Allergies (e.g. scent sensitivities), dislikes, or a personal detail you would like the AI card studio to reference.
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Loves brass, allergic to lavender, loves quiet Sunday morning tea."
                  className="w-full p-4 rounded-lg bg-[#FAF9F6] border border-[#292820]/15 text-sm text-[#292820] focus:outline-none focus:border-[#B69A78] resize-none"
                />
              </div>

              <div className="p-3 bg-[#EDE5DA]/40 rounded-lg flex items-center gap-2 text-xs text-[#292820]/70">
                <Shield className="w-4 h-4 text-[#B69A78] shrink-0" />
                <span>Private & confidential. Never shared with third parties or advertisers.</span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-10 pt-6 border-t border-[#292820]/10 flex items-center justify-between gap-4">
            <div>
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-[#292820] font-bold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-stone-400">Anonymous Mode</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentStep > 1 && currentStep < totalSteps && (
                <button
                  onClick={handleSkip}
                  className="text-xs font-mono uppercase tracking-wider text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  Skip
                </button>
              )}

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider shadow-brutal hover:bg-[#292820] transition-all cursor-pointer"
              >
                <span>{currentStep === totalSteps ? 'Curate Recommendations' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4A359]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

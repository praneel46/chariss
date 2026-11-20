import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Check,
  Shield,
  RotateCcw,
  Send,
  Edit3,
  Sparkle,
  Compass,
  Heart,
  Gem,
  Glasses,
  Watch,
  Headphones,
  Smartphone,
  Award,
  Coffee,
  Flame,
  CheckCircle2,
  X,
  Lock,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBag } from '../context/BagContext';
import { useWishlist } from '../context/WishlistContext';
import { consultationService } from '../services/consultationService';
import type { ConsultationProfile, RankedRecommendationItem } from '../types';

/**
 * Tara's Signature Avatar
 * An understated, bespoke monogram badge reflecting personal gifting guide identity.
 */
const TaraAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions =
    size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';

  return (
    <div
      className={`relative shrink-0 rounded-full flex items-center justify-center font-archivo font-bold text-[#faf3e4] bg-gradient-to-tr from-[#ef4a23] via-[#e2421c] to-[#f4704e] shadow-md ${dimensions} select-none ring-2 ring-white/60`}
      aria-label="Tara, CHARIS Gifting Guide"
    >
      <span className="font-playfair italic font-medium">T</span>
      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10b981] border-2 border-white rounded-full" />
    </div>
  );
};

/**
 * Three-dot Typing Indicator
 */
const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1.5 px-4 py-3 bg-white/90 backdrop-blur-xs rounded-2xl rounded-tl-sm border border-[#141110]/8 shadow-xs w-fit">
    <motion.span
      className="w-1.5 h-1.5 bg-[#ef4a23] rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
    />
    <motion.span
      className="w-1.5 h-1.5 bg-[#ef4a23]/70 rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
    />
    <motion.span
      className="w-1.5 h-1.5 bg-[#ef4a23]/40 rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
    />
  </div>
);

export const Consultation: React.FC = () => {
  const navigate = useNavigate();
  const { saveSession, isAuthenticated, login, register } = useAuth();
  const { setActiveConsultationId: setBagConsultationId } = useBag();
  const { setActiveConsultationId: setWishlistConsultationId } = useWishlist();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef<boolean>(false);
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const isUserReviewingRef = useRef<boolean>(false);

  // Active step counter (1 to 7)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [calibrationStage, setCalibrationStage] = useState<'persisting' | 'generating' | 'revealing'>('persisting');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState<string | null>(null);

  // Guest pre-curation auth prompt state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [authName, setAuthName] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState<boolean>(false);

  // Custom text input buffer
  const [customInputText, setCustomInputText] = useState<string>('');

  // Checks reduced motion preference safely
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Form Data conforming strictly to the existing ConsultationProfile schema
  const [formData, setFormData] = useState<ConsultationProfile>({
    recipientName: '',
    relationship: '',
    occasion: '',
    interests: [],
    personality: [],
    desiredEmotion: '',
    budget: { min: 1500, max: 3500, currency: 'INR' },
    productCategories: ['wearables_eyewear', 'curated_boxes'],
    exclusions: [],
    notes: '',
  });

  // Options catalogs mapped to existing backend values
  const relationshipOptions = [
    { id: 'partner', label: 'Partner / Spouse', icon: '💍', desc: 'Devotion & intimate heirloom' },
    { id: 'best_friend', label: 'Best Friend', icon: '✨', desc: 'Inside jokes & shared journeys' },
    { id: 'mother', label: 'Mother', icon: '🌸', desc: 'Deep care, pampering & grace' },
    { id: 'father', label: 'Father', icon: '👔', desc: 'Quiet admiration & prestige' },
    { id: 'sibling', label: 'Sibling', icon: '⚡', desc: 'Dynamic lifestyle & modern tech' },
    { id: 'colleague', label: 'Mentor / Colleague', icon: '💼', desc: 'Refined professional milestone' },
    { id: 'someone_special', label: 'Someone Special', icon: '🎁', desc: 'A bespoke unprompted delight' },
  ];

  const occasionOptions = [
    { id: 'anniversary', label: 'Anniversary', icon: '🥂', tag: 'Romance' },
    { id: 'birthday', label: 'Milestone Birthday', icon: '🎂', tag: 'Celebration' },
    { id: 'thank_you', label: 'Deep Gratitude', icon: '🙏', tag: 'Appreciation' },
    { id: 'housewarming', label: 'New Home / Sanctuary', icon: '🏡', tag: 'Living' },
    { id: 'just_because', label: 'Just Because', icon: '🎁', tag: 'Pure Delight' },
  ];

  const personalityOptions = [
    { id: 'refined', label: 'Minimal & Elegant', icon: '🏛️' },
    { id: 'creative', label: 'Creative & Artistic', icon: '🎨' },
    { id: 'innovative', label: 'Tech & Innovative', icon: '⚡' },
    { id: 'sentimental', label: 'Nostalgic & Warm', icon: '📖' },
    { id: 'adventurous', label: 'Free-Spirited & Bold', icon: '🧭' },
    { id: 'curator', label: 'Discerning Connoisseur', icon: '💎' },
  ];

  const aestheticInterests = [
    { id: 'Audiophile Audio & Headphones', label: 'Luxury Headphones & Earpods', icon: <Headphones className="w-4 h-4" /> },
    { id: 'Smart Tech & Wearables', label: 'Smart Tech & AI Wearables', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'Fine Horology & Watches', label: 'Luxury Timepieces & Horology', icon: <Watch className="w-4 h-4" /> },
    { id: 'Niche Perfumes & Scents', label: 'Artisan Perfume & Botanicals', icon: <Sparkle className="w-4 h-4" /> },
    { id: 'Handcrafted Sunglasses', label: 'Titanium Eyewear & Sunglasses', icon: <Glasses className="w-4 h-4" /> },
    { id: 'Biometric Rings & Health', label: 'Biometric Rings & Smart Wellness', icon: <Gem className="w-4 h-4" /> },
    { id: 'Tuscan Leather & Totes', label: 'Handcrafted Italian Leather Goods', icon: <Compass className="w-4 h-4" /> },
    { id: 'Bespoke Keepsakes & Maps', label: 'Bespoke Star Maps & Engraved Art', icon: <Heart className="w-4 h-4" /> },
  ];

  const emotionOptions = [
    {
      id: 'romance',
      title: 'Tender Romance & Devotion',
      desc: 'A lasting heirloom that honors your deepest shared intimacy.',
      tag: 'Cherished Bond',
      icon: <Heart className="w-4 h-4 text-[#ef4a23]" />,
    },
    {
      id: 'appreciation',
      title: 'Quiet Respect & Gratitude',
      desc: 'Making them feel genuinely recognized, treasured, and held in high esteem.',
      tag: 'Sincere Honor',
      icon: <Award className="w-4 h-4 text-[#ffd46e]" />,
    },
    {
      id: 'celebration',
      title: 'Breakthrough Wonder & Joy',
      desc: 'An awe-inspiring innovation that sparks pure excitement and triumph.',
      tag: 'Triumph',
      icon: <Flame className="w-4 h-4 text-[#ef4a23]" />,
    },
    {
      id: 'comfort',
      title: 'Daily Solace & Warm Haven',
      desc: 'Effortless luxury that brings restorative peace, calm, and sanctuary.',
      tag: 'Restoration',
      icon: <Coffee className="w-4 h-4 text-[#8fc6e8]" />,
    },
  ];

  const budgetTiers = [
    { min: 500, max: 1500, label: 'Thoughtful Tokens', range: '₹500 – ₹1,500', desc: 'Star maps, custom journals, engraved tokens & fine candles' },
    { min: 1500, max: 3500, label: 'Crafted Keepsakes', range: '₹1,500 – ₹3,500', desc: 'Touch lamps, soundwave art, leather goods & cozy cashmere' },
    { min: 3500, max: 6500, label: 'Signature Heirlooms', range: '₹3,500 – ₹6,500', desc: 'Smart recovery rings, automatic watches & decanters' },
  ];

  // Track whether the user has intentionally scrolled up to review previous messages
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      // If user has scrolled up by more than 280px from the bottom, preserve their reading position
      isUserReviewingRef.current = distanceFromBottom > 280;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Targeted, non-disruptive viewport alignment that keeps the question and answer comfortably in view
  const scrollToStep = useCallback(
    (stepNumber: number, force: boolean = false) => {
      // If user is actively reviewing earlier conversation turns and this isn't an explicit user action (force), do not steal scroll
      if (!force && isUserReviewingRef.current) {
        return;
      }

      requestAnimationFrame(() => {
        const el = questionRefs.current[stepNumber];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        // Check if question speech bubble is already comfortably visible
        // 85px top allowance for sticky/fixed header elements, 60px bottom allowance
        const isComfortablyVisible = rect.top >= 85 && rect.bottom <= viewportHeight - 60;

        if (!isComfortablyVisible) {
          el.scrollIntoView({
            behavior: isReducedMotion ? 'auto' : 'smooth',
            block: 'nearest',
          });
        }
      });
    },
    [isReducedMotion]
  );

  // Focus input automatically for text-heavy steps without jumping the viewport
  useEffect(() => {
    if (currentStep === 1) {
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 400);
    }
  }, [currentStep]);

  // Advance step helper with natural typing simulation
  const advanceStep = (nextStepNumber: number) => {
    setSubmissionError(null);
    setRetryKey(null);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setCurrentStep(nextStepNumber);
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      scrollToStep(nextStepNumber);
    }, isReducedMotion ? 0 : 350);
  };

  // Jump to a previous step for interactive editing
  const handleEditStep = (stepNumber: number) => {
    if (isSubmitting || isCalibrating) return;
    setSubmissionError(null);
    setRetryKey(null);
    setCurrentStep(stepNumber);
    scrollToStep(stepNumber, true);
  };

  // Step 1: Submit Recipient Name
  const handleNameSubmit = (nameToUse?: string) => {
    const rawName = nameToUse || customInputText.trim();
    if (!rawName) return;

    setFormData((prev) => ({ ...prev, recipientName: rawName }));
    setCustomInputText('');
    advanceStep(2);
  };

  // Step 2: Submit Relationship
  const handleRelationshipSelect = (relId: string) => {
    // If "someone_special", map to partner or friend under the hood for backend compatibility
    const mappedRel = relId === 'someone_special' ? 'partner' : relId;
    setFormData((prev) => ({ ...prev, relationship: mappedRel }));
    advanceStep(3);
  };

  // Step 3: Submit Occasion
  const handleOccasionSelect = (occId: string) => {
    setFormData((prev) => ({ ...prev, occasion: occId }));
    advanceStep(4);
  };

  // Step 4: Toggle Personality
  const handleTogglePersonality = (traitId: string) => {
    setFormData((prev) => {
      const exists = prev.personality.includes(traitId);
      const next = exists ? prev.personality.filter((t) => t !== traitId) : [...prev.personality, traitId];
      return { ...prev, personality: next };
    });
  };

  // Step 5: Toggle Interests
  const handleToggleInterest = (interestId: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interestId);
      const next = exists ? prev.interests.filter((i) => i !== interestId) : [...prev.interests, interestId];
      return { ...prev, interests: next };
    });
  };

  // Step 6: Submit Emotion
  const handleEmotionSelect = (emotionId: string) => {
    setFormData((prev) => ({ ...prev, desiredEmotion: emotionId }));
    advanceStep(7);
  };

  // Step 7: Submit Budget & Notes -> Trigger Calibration
  const handleBudgetSelect = (tier: { min: number; max: number }) => {
    setFormData((prev) => ({
      ...prev,
      budget: { min: tier.min, max: tier.max, currency: 'INR' },
    }));
  };

  // Check if authenticated before revealing curations; prompt guest to authenticate
  const handleInitiateCalibration = () => {
    if (!isAuthenticated) {
      setAuthError(null);
      setIsAuthModalOpen(true);
      return;
    }
    runCalibration();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please provide both your email and password.');
      return;
    }

    if (authMode === 'signup' && !authName.trim()) {
      setAuthError('Please enter your name.');
      return;
    }

    setIsAuthSubmitting(true);
    try {
      let success = false;
      if (authMode === 'signin') {
        success = await login(authEmail.trim(), authPassword);
      } else {
        success = await register(authName.trim(), authEmail.trim(), authPassword);
      }

      if (success) {
        setIsAuthModalOpen(false);
        // Seamlessly continue without losing answers or restarting!
        await runCalibration();
      } else {
        setAuthError(
          authMode === 'signin'
            ? 'Invalid email or password. Please verify your credentials and try again.'
            : 'Registration failed. An account with this email may already exist.'
        );
      }
    } catch (err: any) {
      setAuthError(
        err?.response?.data?.message || err?.message || 'Authentication error. Please try again.'
      );
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  // Final Calibration Submission
  const runCalibration = async () => {
    if (isSubmitting || isCalibrating || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    // Safe UUID generation with fallback for non-secure / older browser contexts
    const generateId = () => {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    // Use stable idempotency key during retries; generate fresh UUID key on first attempt
    const keyToUse = retryKey || `charis-sub-${generateId()}`;
    if (!retryKey) {
      setRetryKey(keyToUse);
    }

    setIsSubmitting(true);
    setIsCalibrating(true);
    setCalibrationStage('persisting');
    setSubmissionError(null);

    try {
      // Ensure recipientName has a graceful default if empty
      const payload: ConsultationProfile = {
        ...formData,
        recipientName: (formData.recipientName && formData.recipientName.trim()) || 'Recipient',
        relationship: formData.relationship || 'partner',
        occasion: formData.occasion || 'anniversary',
        desiredEmotion: formData.desiredEmotion || 'romance',
        interests: formData.interests.length > 0 ? formData.interests : ['Fine Horology & Watches'],
        personality: formData.personality.length > 0 ? formData.personality : ['refined'],
        budget: formData.budget || { min: 1500, max: 3500, currency: 'INR' },
      };

      const persisted = await consultationService.createConsultation(payload, keyToUse);

      // Keep local session storage in sync for backwards compatibility
      saveSession({
        recipientName: persisted.recipientName,
        relationship: persisted.relationship,
        occasion: persisted.occasion,
        desiredEmotion: persisted.desiredEmotion,
        budgetFormatted: persisted.budgetFormatted,
        interests: persisted.interests,
      });

      localStorage.setItem('charis_active_consultation', JSON.stringify(persisted));
      localStorage.setItem('charis_active_consultation_id', persisted.id);

      // Lock Bag and Wishlist contexts to this specific consultation
      setBagConsultationId(persisted.id);
      setWishlistConsultationId(persisted.id);

      // Progressive Stage 2: Grounded recommendation synthesis
      setCalibrationStage('generating');

      let initialItems: RankedRecommendationItem[] | undefined;
      try {
        const recResult = await consultationService.generateRecommendations(persisted.id);
        if (recResult?.items && recResult.items.length > 0) {
          initialItems = recResult.items;
        }
      } catch (recErr) {
        // Non-blocking: Recommendations page will attempt fetch/retry with consultationId
        console.warn('Pre-generation recommendation warning:', recErr);
      }

      // Progressive Stage 3: Instant reveal transition
      setCalibrationStage('revealing');

      await new Promise((resolve) => setTimeout(resolve, isReducedMotion ? 0 : 250));

      navigate('/recommendations', {
        state: {
          consultationId: persisted.id,
          profile: persisted,
          initialItems,
        },
      });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : null) ||
        err.message ||
        'Unable to persist consultation profile. Please check your connection and try again.';
      setSubmissionError(errorMsg);
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
      });
    } finally {
      setIsCalibrating(false);
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const recipientDisplayName = (formData.recipientName && formData.recipientName.trim()) || 'them';

  return (
    <div className="relative w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[6.5rem] sm:pt-[7rem] pb-20 px-4 sm:px-6 md:px-8 overflow-x-hidden selection:bg-[#ef4a23] selection:text-white">
      {/* Subtle Ambient Floating Elements */}
      {!isReducedMotion && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#ef4a23]/6 blur-3xl"
            animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[#ffd46e]/8 blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-[#8fc6e8]/6 blur-3xl"
            animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
        {/* Tara Identity & Progress Header (Normal Document Flow) */}
        <div className="relative w-full mb-6 sm:mb-8 bg-white/90 backdrop-blur-xs py-3.5 px-4 sm:px-6 rounded-2xl border border-[#141110]/8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 transition-all">
          {/* Identity Section (Left-aligned, vertically centered) */}
          <div className="flex items-center gap-3">
            <TaraAvatar size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-archivo text-sm font-bold uppercase tracking-tight text-[#141110]">
                  Tara
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#faf3e4] text-[#ef4a23] font-bold border border-[#141110]/8">
                  Gift Guide
                </span>
              </div>
              <p className="text-[11px] font-playfair italic text-[#141110]/65 leading-none mt-1 truncate">
                Your Personal Gifting Guide
              </p>
            </div>
          </div>

          {/* Progress Information (Right-aligned, stacked cleanly on mobile) */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#141110]/8">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-archivo uppercase tracking-widest text-[#141110]/60 font-bold block">
                Step 0{currentStep} / 07
              </span>
              <span className="text-[11px] font-playfair italic text-[#141110]/75 block">
                {currentStep === 1 && 'The Recipient'}
                {currentStep === 2 && 'Your Bond'}
                {currentStep === 3 && 'The Occasion'}
                {currentStep === 4 && 'Personality'}
                {currentStep === 5 && 'Aesthetic Passions'}
                {currentStep === 6 && 'Emotional Nuance'}
                {currentStep === 7 && 'Atelier Budget'}
              </span>
            </div>
            <div className="w-20 sm:w-28 h-1.5 bg-[#141110]/10 rounded-full overflow-hidden shrink-0">
              <motion.div
                className="h-full bg-[#ef4a23] rounded-full"
                initial={false}
                animate={{ width: `${(currentStep / 7) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Conversation Thread Container */}
        <div className="flex-1 space-y-6 sm:space-y-7 pb-28">
          {/* Opening Greeting */}
          <div className="flex items-start gap-3.5">
            <TaraAvatar size="sm" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl rounded-tl-sm p-4 sm:p-5 border border-[#141110]/8 shadow-xs max-w-lg text-[#141110] space-y-2"
            >
              <p className="font-archivo text-sm font-semibold text-[#141110] leading-relaxed">
                Hey there! I'm <span className="text-[#ef4a23]">Tara</span>, your personal gifting guide at CHARIS.
              </p>
              <p className="font-playfair text-sm text-[#141110]/80 leading-relaxed italic">
                Let's find something that feels just right. Tell me a little about the person you're gifting.
              </p>
            </motion.div>
          </div>

          {/* TURN 1: RECIPIENT NAME */}
          <div className="space-y-4">
            <div ref={(el) => { questionRefs.current[1] = el; }} className="flex items-start gap-3.5">
              <TaraAvatar size="sm" />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="bg-white rounded-2xl rounded-tl-sm p-4 sm:p-5 border border-[#141110]/8 shadow-xs max-w-lg text-[#141110]"
              >
                <p className="font-archivo text-sm font-semibold text-[#141110] leading-relaxed">
                  Who are we finding something special for today?
                </p>
                <p className="font-playfair text-xs text-[#141110]/65 mt-1 italic">
                  A name, a sweet nickname, or simply who they are to you.
                </p>
              </motion.div>
            </div>

            {/* Answer Display if Step 1 is passed */}
            {completedSteps.includes(1) && currentStep > 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-end gap-2 group"
              >
                <button
                  type="button"
                  onClick={() => handleEditStep(1)}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs font-archivo text-[#141110]/50 hover:text-[#ef4a23] transition-all flex items-center gap-1 cursor-pointer pr-1"
                  aria-label="Edit recipient name"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <div className="bg-[#141110] text-[#faf3e4] px-5 py-3 rounded-2xl rounded-tr-sm shadow-xs font-archivo text-sm font-semibold flex items-center gap-2">
                  <span>{formData.recipientName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd46e]" />
                </div>
              </motion.div>
            )}

            {/* Active Control for Step 1 */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="pl-11 space-y-4 pt-1"
              >
                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-2">
                  {['My Partner', 'My Mom', 'My Dad', 'My Best Friend', 'A Colleague', 'Someone Special'].map(
                    (suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleNameSubmit(suggestion)}
                        className="px-4 py-2 rounded-full bg-white hover:bg-[#141110] hover:text-[#faf3e4] text-[#141110] text-xs font-archivo font-medium border border-[#141110]/12 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {suggestion}
                      </button>
                    )
                  )}
                </div>

                {/* Free-text input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNameSubmit();
                  }}
                  className="flex items-center gap-2 max-w-md"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={customInputText}
                    onChange={(e) => setCustomInputText(e.target.value)}
                    placeholder="Or type their name (e.g. Eleanor, Dev, Mom)..."
                    className="flex-1 px-5 py-3.5 rounded-full bg-white border border-[#141110]/15 text-sm font-archivo text-[#141110] placeholder:text-[#141110]/40 focus:outline-none focus:border-[#ef4a23] focus:ring-2 focus:ring-[#ef4a23]/10 shadow-xs transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!customInputText.trim()}
                    className="px-4 py-3.5 rounded-full bg-[#ef4a23] hover:bg-[#141110] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-archivo font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          {/* TURN 2: RELATIONSHIP / BOND */}
          {currentStep >= 2 && (
            <div className="space-y-4">
              <div ref={(el) => { questionRefs.current[2] = el; }} className="flex items-start gap-3.5">
                <TaraAvatar size="sm" />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl rounded-tl-sm p-4 sm:p-5 border border-[#141110]/8 shadow-xs max-w-lg text-[#141110]"
                >
                  <p className="font-archivo text-sm font-semibold text-[#141110] leading-relaxed">
                    {formData.recipientName}... what a meaningful bond. How would you describe your connection with {recipientDisplayName}?
                  </p>
                  <p className="font-playfair text-xs text-[#141110]/65 mt-1 italic">
                    Every relationship speaks its own subtle aesthetic language.
                  </p>
                </motion.div>
              </div>

              {/* Answer Display if Step 2 is completed */}
              {completedSteps.includes(2) && currentStep > 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-end gap-2 group"
                >
                  <button
                    type="button"
                    onClick={() => handleEditStep(2)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs font-archivo text-[#141110]/50 hover:text-[#ef4a23] transition-all flex items-center gap-1 cursor-pointer pr-1"
                    aria-label="Edit relationship"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <div className="bg-[#141110] text-[#faf3e4] px-5 py-3 rounded-2xl rounded-tr-sm shadow-xs font-archivo text-sm font-semibold flex items-center gap-2">
                    <span>
                      {relationshipOptions.find((r) => r.id === formData.relationship)?.label ||
                        formData.relationship}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd46e]" />
                  </div>
                </motion.div>
              )}

              {/* Active Control for Step 2 */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pl-11 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1"
                >
                  {relationshipOptions.map((rel) => {
                    const isSelected = formData.relationship === rel.id;
                    return (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => handleRelationshipSelect(rel.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#141110] text-[#faf3e4] border-[#141110] shadow-md scale-[1.02]'
                            : 'bg-white hover:bg-[#141110]/5 text-[#141110] border-[#141110]/10 hover:border-[#141110]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{rel.icon}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#ffd46e]" />}
                        </div>
                        <div className="mt-2">
                          <h4 className="font-archivo text-xs font-bold uppercase tracking-tight">{rel.label}</h4>
                          <p
                            className={`text-[11px] font-playfair italic mt-0.5 line-clamp-1 ${
                              isSelected ? 'text-[#faf3e4]/70' : 'text-[#141110]/60'
                            }`}
                          >
                            {rel.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          )}

          {/* TURN 3: OCCASION / MILESTONE */}
          {currentStep >= 3 && (
            <div className="space-y-4">
              <div ref={(el) => { questionRefs.current[3] = el; }} className="flex items-start gap-3.5">
                <TaraAvatar size="sm" />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl rounded-tl-sm p-4 sm:p-5 border border-[#141110]/8 shadow-xs max-w-lg text-[#141110]"
                >
                  <p className="font-archivo text-sm font-semibold text-[#141110] leading-relaxed">
                    Every memorable gift marks a chapter in time. What's the occasion we're commemorating for {recipientDisplayName}?
                  </p>
                  <p className="font-playfair text-xs text-[#141110]/65 mt-1 italic">
                    Whether a landmark milestone or a spontaneous expression of care.
                  </p>
                </motion.div>
              </div>

              {/* Answer Display if Step 3 is completed */}
              {completedSteps.includes(3) && currentStep > 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-end gap-2 group"
                >
                  <button
                    type="button"
                    onClick={() => handleEditStep(3)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs font-archivo text-[#141110]/50 hover:text-[#ef4a23] transition-all flex items-center gap-1 cursor-pointer pr-1"
                    aria-label="Edit occasion"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <div className="bg-[#141110] text-[#faf3e4] px-5 py-3 rounded-2xl rounded-tr-sm shadow-xs font-archivo text-sm font-semibold flex items-center gap-2">
                    <span>
                      {occasionOptions.find((o) => o.id === formData.occasion)?.label || formData.occasion}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd46e]" />
                  </div>
                </motion.div>
              )}

              {/* Active Control for Step 3 */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pl-11 flex flex-wrap gap-2.5 pt-1"
                >
                  {occasionOptions.map((occ) => {
                    const isSelected = formData.occasion === occ.id;
                    return (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => handleOccasionSelect(occ.id)}
                        className={`px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-[#141110] text-[#faf3e4] border-[#141110] shadow-md scale-[1.02]'
                            : 'bg-white hover:bg-[#141110]/5 text-[#141110] border-[#141110]/10 hover:border-[#141110]/20'
                        }`}
                      >
                        <span className="text-xl">{occ.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-archivo text-xs font-bold uppercase tracking-tight">
                              {occ.label}
                            </span>
                            <span
                              className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isSelected ? 'bg-[#ef4a23] text-white' : 'bg-stone-100 text-[#141110]/70'
                              }`}
                            >
                              {occ.tag}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          )}

          {/* TURN 4: PERSONALITY & TEMPERAMENT */}
          {currentStep >= 4 && (
            <div className="space-y-4">
              <div ref={(el) => { questionRefs.current[4] = el; }} className="flex items-start gap-3.5">
                <TaraAvatar size="sm" />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl rounded-tl-sm p-4 sm:p-5 border border-[#141110]/8 shadow-xs max-w-lg text-[#141110]"
                >
                  <p className="font-archivo text-sm font-semibold text-[#141110] leading-relaxed">
                    Tell me a little about {recipientDisplayName}'s personality and how they move through the world.
                  </p>
                  <p className="font-playfair text-xs text-[#141110]/65 mt-1 italic">
                    Select 1 to 3 traits that capture their authentic temperament.
                  </p>
                </motion.div>
              </div>

              {/* Answer Display if Step 4 is completed */}
              {completedSteps.includes(4) && currentStep > 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-end gap-2 group"
                >
                  <button
                    type="button"
                    onClick={() => handleEditStep(4)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs font-archivo text-[#141110]/50 hover:text-[#ef4a23] transition-all flex items-center gap-1 cursor-pointer pr-1"
                    aria-label="Edit personality traits"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <div className="bg-[#141110] text-[#faf3e4] px-5 py-3 rounded-2xl rounded-tr-sm shadow-xs font-archivo text-sm font-semibold flex items-center gap-2">
                    <span>
                      {formData.personality
                        .map((t) => personalityOptions.find((p) => p.id === t)?.label || t)
                        .join(', ')}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd46e]" />
                  </div>
                </motion.div>
              )}

              {/* Active Control for Step 4 */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pl-11 space-y-3 pt-1"
                >
                  <div className="flex flex-wrap gap-2.5">
                    {personalityOptions.map((trait) => {
                      const isSelected = formData.personality.includes(trait.id);
                      return (
                        <button
                          key={trait.id}
                          type="button"
                          onClick={() => handleTogglePersonality(trait.id)}
                          className={`px-4 py-2.5 rounded-full border text-xs font-archivo font-medium transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
                            isSelected
                              ? 'bg-[#ef4a23] text-white border-[#ef4a23] shadow-xs scale-[1.02]'
                              : 'bg-white hover:bg-[#141110] hover:text-white text-[#141110] border-[#141110]/12'
                          }`}
                        >
                          <span>{trait.icon}</span>
                          <span>{trait.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={formData.personality.length === 0}
                      onClick={() => advanceStep(5)}
                      className="px-6 py-2.5 rounded-full bg-[#141110] hover:bg-[#ef4a23] disabled:opacity-30 disabled:cursor-not-allowed text-[#faf3e4] text-xs font-archivo font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center gap-2"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* TURN 5: AESTHETIC & CRAFT INTERESTS */}
          {currentStep >= 5 && (
            <div className="space-y-4">
              <div ref={(el) => { questionRefs.current[5] = el; }} className="flex items-start gap-3.5">
                <TaraAvatar size="sm" />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl rounded-tl-sm p-4 sm:p-5 border border-[#141110]/8 shadow-xs max-w-lg text-[#141110]"
                >
                  <p className="font-archivo text-sm font-semibold text-[#141110] leading-relaxed">
                    What aesthetic, craft, or lifestyle passions speak to {recipientDisplayName}?
                  </p>
                  <p className="font-playfair text-xs text-[#141110]/65 mt-1 italic">
                    Select all that resonate. Handcrafted horology, single-harvest fragrances, titanium eyewear, or leather.
                  </p>
                </motion.div>
              </div>

              {/* Answer Display if Step 5 is completed */}
              {completedSteps.includes(5) && currentStep > 5 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-end gap-2 group"
                >
                  <button
                    type="button"
                    onClick={() => handleEditStep(5)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs font-archivo text-[#141110]/50 hover:text-[#ef4a23] transition-all flex items-center gap-1 cursor-pointer pr-1"
                    aria-label="Edit aesthetic interests"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <div className="bg-[#141110] text-[#faf3e4] px-5 py-3 rounded-2xl rounded-tr-sm shadow-xs font-archivo text-sm font-semibold flex items-center gap-2">
                    <span>
                      {formData.interests
                        .map((i) => aestheticInterests.find((a) => a.id === i)?.label || i)
                        .join(', ')}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd46e]" />
                  </div>
                </motion.div>
              )}

              {/* Active Control for Step 5 */}
              {currentStep === 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pl-11 space-y-3 pt-1"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {aestheticInterests.map((item) => {
                      const isSelected = formData.interests.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleToggleInterest(item.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 shadow-2xs ${
                            isSelected
                              ? 'bg-[#ef4a23] text-white border-[#ef4a23] shadow-xs scale-[1.01]'
                              : 'bg-white hover:bg-[#141110]/5 text-[#141110] border-[#141110]/10 hover:border-[#141110]/20'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl shrink-0 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#faf3e4] text-[#ef4a23]'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-archivo text-xs font-bold uppercase tracking-tight truncate">
                              {item.label}
                            </h4>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={formData.interests.length === 0}
                      onClick={() => advanceStep(6)}
                      className="px-6 py-2.5 rounded-full bg-[#141110] hover:bg-[#ef4a23] disabled:opacity-30 disabled:cursor-not-allowed text-[#faf3e4] text-xs font-archivo font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center gap-2"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* TURN 6: DESIRED FEELING & EMOTION */}
          {currentStep >= 6 && (
            <div className="space-y-4">
              <div ref={(el) => { questionRefs.current[6] = el; }} className="flex items-start gap-3.5">
                <TaraAvatar size="sm" />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl rounded-tl-sm p-4 sm:p-5 border border-[#141110]/8 shadow-xs max-w-lg text-[#141110]"
                >
                  <p className="font-archivo text-sm font-semibold text-[#141110] leading-relaxed">
                    Here's my favorite question: what feeling would you love this gift to leave {recipientDisplayName} with?
                  </p>
                  <p className="font-playfair text-xs text-[#141110]/65 mt-1 italic">
                    The heart of CHARIS. Every heirloom should evoke a genuine emotional coordinate.
                  </p>
                </motion.div>
              </div>

              {/* Answer Display if Step 6 is completed */}
              {completedSteps.includes(6) && currentStep > 6 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-end gap-2 group"
                >
                  <button
                    type="button"
                    onClick={() => handleEditStep(6)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs font-archivo text-[#141110]/50 hover:text-[#ef4a23] transition-all flex items-center gap-1 cursor-pointer pr-1"
                    aria-label="Edit desired emotion"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <div className="bg-[#141110] text-[#faf3e4] px-5 py-3 rounded-2xl rounded-tr-sm shadow-xs font-archivo text-sm font-semibold flex items-center gap-2">
                    <span>
                      {emotionOptions.find((e) => e.id === formData.desiredEmotion)?.title ||
                        formData.desiredEmotion}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd46e]" />
                  </div>
                </motion.div>
              )}

              {/* Active Control for Step 6 */}
              {currentStep === 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pl-11 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1"
                >
                  {emotionOptions.map((emo) => {
                    const isSelected = formData.desiredEmotion === emo.id;
                    return (
                      <button
                        key={emo.id}
                        type="button"
                        onClick={() => handleEmotionSelect(emo.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#141110] text-[#faf3e4] border-[#141110] shadow-md scale-[1.02]'
                            : 'bg-white hover:bg-[#141110]/5 text-[#141110] border-[#141110]/10 hover:border-[#141110]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-archivo uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                              isSelected ? 'bg-[#ffd46e] text-[#141110]' : 'bg-[#faf3e4] text-[#ef4a23]'
                            }`}
                          >
                            {emo.tag}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#ffd46e]" />}
                        </div>
                        <div className="mt-3">
                          <h4 className="font-archivo text-xs font-bold uppercase tracking-tight">{emo.title}</h4>
                          <p
                            className={`text-[11px] font-playfair italic mt-1 leading-relaxed ${
                              isSelected ? 'text-[#faf3e4]/80' : 'text-[#141110]/65'
                            }`}
                          >
                            {emo.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          )}

          {/* TURN 7: BUDGET TIER & SPECIAL NOTES */}
          {currentStep >= 7 && (
            <div className="space-y-4">
              <div ref={(el) => { questionRefs.current[7] = el; }} className="flex items-start gap-3.5">
                <TaraAvatar size="sm" />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl rounded-tl-sm p-4 sm:p-5 border border-[#141110]/8 shadow-xs max-w-lg text-[#141110]"
                >
                  <p className="font-archivo text-sm font-semibold text-[#141110] leading-relaxed">
                    Almost there! What budget window should we calibrate within for {recipientDisplayName}?
                  </p>
                  <p className="font-playfair text-xs text-[#141110]/65 mt-1 italic">
                    Transparent atelier pricing with zero hidden retail surcharges. You can also share any special dates or engravings below.
                  </p>
                </motion.div>
              </div>

              {/* Active Control for Step 7 */}
              {currentStep === 7 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pl-11 space-y-4 pt-1"
                >
                  {/* Budget Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {budgetTiers.map((tier) => {
                      const isSelected =
                        formData.budget.min === tier.min && formData.budget.max === tier.max;
                      return (
                        <button
                          key={tier.label}
                          type="button"
                          onClick={() => handleBudgetSelect(tier)}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#ef4a23] text-white border-[#ef4a23] shadow-md scale-[1.02]'
                              : 'bg-white hover:bg-[#141110]/5 text-[#141110] border-[#141110]/10 hover:border-[#141110]/20'
                          }`}
                        >
                          <div>
                            <span
                              className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#141110]/60'
                              }`}
                            >
                              Tier
                            </span>
                            <h4 className="font-archivo text-xs font-bold uppercase tracking-tight mt-2">
                              {tier.label}
                            </h4>
                            <span className="text-sm font-archivo font-bold block mt-1">{tier.range}</span>
                          </div>
                          <p
                            className={`text-[10px] font-playfair italic mt-2 line-clamp-2 ${
                              isSelected ? 'text-white/85' : 'text-[#141110]/60'
                            }`}
                          >
                            {tier.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Personal Coordinates Input */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-archivo uppercase tracking-wider font-bold text-[#141110]/80">
                      Meaningful Dates, Coordinates or Engravings (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Wedding 14.02.2021, Paris coords, initials 'E & J'"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-5 py-3 rounded-2xl bg-white border border-[#141110]/15 text-sm font-archivo text-[#141110] placeholder:text-[#141110]/40 focus:outline-none focus:border-[#ef4a23] focus:ring-2 focus:ring-[#ef4a23]/10 shadow-xs transition-all"
                    />
                  </div>

                  {/* Final Calibration Trigger */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isSubmitting || isCalibrating}
                      onClick={handleInitiateCalibration}
                      className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white font-archivo text-xs uppercase font-bold tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 group"
                    >
                      <Sparkles className="w-4 h-4 text-[#ffd46e]" />
                      <span>{isSubmitting ? 'Calibrating...' : 'Calibrate & Reveal Curations'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3.5">
              <TaraAvatar size="sm" />
              <TypingIndicator />
            </div>
          )}

          {/* SUBMISSION ERROR ALERT INSIDE CHAT */}
          {submissionError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3.5"
            >
              <TaraAvatar size="sm" />
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2 max-w-lg shadow-xs">
                <p className="font-archivo text-xs uppercase tracking-wider font-bold text-rose-900">
                  Calibration Persistence Note
                </p>
                <p className="text-xs text-rose-700 leading-relaxed font-sans">{submissionError}</p>
                <button
                  type="button"
                  onClick={handleInitiateCalibration}
                  className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-archivo uppercase font-bold tracking-wider transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs mt-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Calibration</span>
                </button>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* GUEST PRE-CURATION AUTHENTICATION PROMPT MODAL */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[250] bg-[#141110]/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#FAF9F6] text-[#292820] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#292820]/15 relative overflow-hidden space-y-5"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#EDE5DA] text-[#292820] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Tara Guide Identity */}
              <div className="flex items-center gap-3">
                <TaraAvatar size="md" />
                <div>
                  <span className="font-archivo text-[11px] uppercase tracking-widest text-[#B69A78] font-bold block">
                    Curations Calibrated
                  </span>
                  <span className="font-serif text-sm font-bold text-[#292820]">
                    Tara, CHARIS Gifting Guide
                  </span>
                </div>
              </div>

              {/* Exact Requested Prompt */}
              <div className="space-y-2 pt-1">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#292820] leading-snug">
                  Your thoughtful gift collection is ready to be curated!
                </h3>
                <p className="text-xs text-[#292820]/75 leading-relaxed">
                  Please sign in or create an account to reveal your personalized recommendations.
                </p>
              </div>

              {/* Auth Mode Toggle Tabs */}
              <div className="grid grid-cols-2 p-1 bg-[#EDE5DA]/60 rounded-xl border border-[#292820]/10 text-xs font-archivo uppercase font-bold tracking-wider">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthError(null);
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-white text-[#ef4a23] shadow-xs'
                      : 'text-[#292820]/60 hover:text-[#292820]'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthError(null);
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white text-[#ef4a23] shadow-xs'
                      : 'text-[#292820]/60 hover:text-[#292820]'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {/* Error Alert */}
              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                  {authError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authMode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-mono tracking-wider text-[#292820]/70 font-semibold block">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Elena Rostova"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#292820]/15 rounded-xl text-xs text-[#292820] focus:outline-none focus:ring-2 focus:ring-[#ef4a23]"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#292820]/70 font-semibold block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="you@sanctuary.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#292820]/15 rounded-xl text-xs text-[#292820] focus:outline-none focus:ring-2 focus:ring-[#ef4a23]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#292820]/70 font-semibold block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#292820]/15 rounded-xl text-xs text-[#292820] focus:outline-none focus:ring-2 focus:ring-[#ef4a23]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full py-3.5 mt-2 rounded-xl bg-[#ef4a23] hover:bg-[#141110] text-white font-archivo text-xs uppercase font-bold tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#ffd46e]" />
                  <span>
                    {isAuthSubmitting
                      ? 'Securing Sanctuary...'
                      : authMode === 'signup'
                      ? 'Create Account & Reveal Curations'
                      : 'Sign In & Reveal Curations'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-[10px] text-center text-[#292820]/60 font-mono">
                ✓ All 7 consultation answers are saved and will link directly to your account.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN CALIBRATION OVERLAY */}
      <AnimatePresence>
        {isCalibrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#141110]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-[#faf3e4] text-center space-y-6"
          >
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white/10 border-t-[#ef4a23] animate-spin" />
              <Sparkles className="w-8 h-8 text-[#ffd46e] animate-pulse" />
            </div>

            <div className="space-y-3 max-w-md">
              <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ffd46e]">
                <span className="w-2 h-2 rounded-full bg-[#ef4a23] animate-ping" />
                <span>
                  {calibrationStage === 'persisting' && 'Phase 1 of 2 • Persisting Profile'}
                  {calibrationStage === 'generating' && 'Phase 2 of 2 • Synthesizing Curations'}
                  {calibrationStage === 'revealing' && 'Finalizing • Curations Ready'}
                </span>
              </div>
              <h3 className="font-archivo uppercase text-2xl sm:text-3xl font-bold tracking-tight">
                {calibrationStage === 'persisting' && 'Calibrating Sentiment Index'}
                {calibrationStage === 'generating' && 'Evaluating Suitability Guardrails'}
                {calibrationStage === 'revealing' && 'Revealing Master Keepsakes'}
              </h3>
              <p className="font-playfair text-base sm:text-lg text-[#faf3e4]/70 italic">
                {calibrationStage === 'persisting' && `Cross-referencing ${recipientDisplayName}'s emotional profile...`}
                {calibrationStage === 'generating' && `Matching genuine aesthetic passions with verified atelier listings...`}
                {calibrationStage === 'revealing' && `Preparing your bespoke gift curations...`}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 font-mono text-xs text-[#ffd46e]">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero mass-retail items • 100% Provenance Guaranteed</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Consultation;

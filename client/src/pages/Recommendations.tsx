import React, { useState, useEffect, useCallback, useRef } from 'react';
import { consultationService } from '../services/consultationService';
import { useBag } from '../context/BagContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import type { Product, ConsultationProfile, RankedRecommendationItem } from '../types';
import { Sparkles, Heart, Check, RotateCcw, PenTool, BookmarkCheck, ShoppingBag, AlertCircle, Compass } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { FramedGiftCardModal } from '../components/gift/FramedGiftCardModal';

export const Recommendations: React.FC = () => {
  const location = useLocation();
  const routerState = location.state as
    | {
        consultationId?: string;
        profile?: ConsultationProfile;
        initialItems?: RankedRecommendationItem[];
      }
    | undefined;

  const { addToBag, setActiveConsultationId: setBagConsultationId } = useBag();
  const { toggleWishlist, isWishlisted, setActiveConsultationId: setWishlistConsultationId } = useWishlist();
  const { saveSession } = useAuth();

  const [rankedItems, setRankedItems] = useState<RankedRecommendationItem[]>(
    () => routerState?.initialItems || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    () => !routerState?.initialItems || routerState.initialItems.length === 0
  );
  const [error, setError] = useState<string | null>(null);

  // Obtain consultation ID from router state, profile payload, or localStorage session cache
  const [consultationId, setConsultationId] = useState<string | null>(() => {
    return (
      routerState?.consultationId ||
      routerState?.profile?.id ||
      routerState?.profile?._id ||
      localStorage.getItem('charis_active_consultation_id') ||
      null
    );
  });

  const [profile, setProfile] = useState<ConsultationProfile | null>(() => routerState?.profile || null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [sessionSavedNotice, setSessionSavedNotice] = useState(false);
  const [cardProduct, setCardProduct] = useState<Product | null>(null);

  // Synchronize consultation-isolated Gift Bag and Wishlist context
  useEffect(() => {
    if (consultationId) {
      setBagConsultationId(consultationId);
      setWishlistConsultationId(consultationId);
    }
  }, [consultationId, setBagConsultationId, setWishlistConsultationId]);

  // Ref guard to prevent duplicate concurrent API requests during React renders/effects
  const isFetchingRef = useRef<boolean>(false);
  const fetchedIdRef = useRef<string | null>(
    routerState?.initialItems && routerState.initialItems.length > 0
      ? routerState.consultationId || routerState.profile?.id || routerState.profile?._id || 'pre-fetched'
      : null
  );

  const fetchRecommendations = useCallback(async (targetId: string) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const result = await consultationService.generateRecommendations(targetId);
      setRankedItems(result.items);
      fetchedIdRef.current = targetId;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to generate calibrated recommendations. Please verify your connection and try again.';
      setError(errorMsg);
      setRankedItems([]);
      // If access is forbidden (403) or not found (404), prune stale localStorage session cache
      if (err?.response?.status === 403 || err?.response?.status === 404) {
        try {
          localStorage.removeItem('charis_active_consultation_id');
          localStorage.removeItem('charis_active_consultation');
        } catch {
          // Ignore storage availability error
        }
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // 1. Resolve Profile details for header synthesis
    if (!profile) {
      try {
        const saved = localStorage.getItem('charis_active_consultation');
        if (saved) {
          setProfile(JSON.parse(saved));
        }
      } catch {
        // Safe fallback if localStorage is unavailable
      }
    }

    // 2. Resolve Consultation ID with strict 24-character hexadecimal format validation
    const rawId =
      consultationId ||
      routerState?.consultationId ||
      routerState?.profile?.id ||
      routerState?.profile?._id ||
      localStorage.getItem('charis_active_consultation_id');

    const cleanRawId = typeof rawId === 'string' ? rawId.trim() : '';
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(cleanRawId);
    const effectiveId = isValidObjectId ? cleanRawId : null;

    if (!isValidObjectId && rawId) {
      // Malformed ID in storage: clean up invalid localStorage entry
      try {
        localStorage.removeItem('charis_active_consultation_id');
      } catch {
        // Ignore storage error
      }
    }

    if (effectiveId && !consultationId) {
      setConsultationId(effectiveId);
    }

    // 3. Trigger recommendation fetch only when valid consultationId is present and not yet fetched
    if (effectiveId) {
      if (fetchedIdRef.current !== effectiveId && rankedItems.length === 0) {
        fetchRecommendations(effectiveId);
      } else if (fetchedIdRef.current !== effectiveId && rankedItems.length > 0) {
        fetchedIdRef.current = effectiveId;
      }
    } else {
      // If no valid consultationId is present at all, terminate loading to show missing-ID state
      if (rankedItems.length === 0) {
        setIsLoading(false);
      }
    }
  }, [fetchRecommendations, routerState, profile, consultationId]);

  const handleRetry = () => {
    if (consultationId) {
      fetchedIdRef.current = null;
      fetchRecommendations(consultationId);
    }
  };

  const handleAdd = (product: Product) => {
    addToBag(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleSaveToDashboard = () => {
    if (profile) {
      saveSession({
        recipientName: profile.recipientName || 'Recipient',
        relationship: profile.relationship,
        occasion: profile.occasion,
        desiredEmotion: profile.desiredEmotion,
        budgetFormatted: `₹${profile.budget?.min?.toLocaleString('en-IN') || '1,500'} – ₹${profile.budget?.max?.toLocaleString('en-IN') || '3,500'}`,
        interests: profile.interests,
        chosenGiftName: rankedItems[0]?.product.name || 'Personalized Gift',
      });
      setSessionSavedNotice(true);
      setTimeout(() => setSessionSavedNotice(false), 3000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[7rem] pb-[6rem] px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Profile Synthesis Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#141110]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-archivo uppercase tracking-widest text-[#ef4a23] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Calibrated Recommendations</span>
            </div>
            <h1
              className="font-archivo uppercase text-3xl sm:text-5xl font-bold tracking-tight text-[#141110] leading-none"
              style={{ fontStretch: '72%' }}
            >
              FOR {profile?.recipientName || 'YOUR RECIPIENT'} <span className="font-playfair italic font-normal text-[#ef4a23] lowercase">curations.</span>
            </h1>
            <p className="font-playfair text-sm sm:text-base text-[#141110]/70 italic">
              Bond: <strong className="text-[#141110] capitalize">{profile?.relationship || 'partner'}</strong> • Occasion: <strong className="text-[#141110] capitalize">{profile?.occasion || 'anniversary'}</strong> • Desired Sentiment: <strong className="text-[#ef4a23] capitalize">{profile?.desiredEmotion || 'devotion'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveToDashboard}
              className="px-4 py-2.5 rounded-full bg-[#141110] hover:bg-[#ef4a23] text-white text-xs font-archivo uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-[#ffd46e]" />
              <span>{sessionSavedNotice ? 'Saved to Sanctuary!' : 'Save Session'}</span>
            </button>

            <Link
              to="/gift-studio"
              className="px-4 py-2.5 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white text-xs font-archivo uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PenTool className="w-3.5 h-3.5 text-[#ffd46e]" />
              <span>Gift Studio</span>
            </Link>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-[#141110]/10 pb-4">
          <div>
            <h2 className="font-archivo uppercase text-2xl sm:text-3xl font-bold tracking-tight text-[#141110]">
              Ranked Atelier & Tech Matches ({rankedItems.length})
            </h2>
            <p className="font-playfair text-sm text-[#141110]/60 italic mt-0.5">
              Strictly luxury watches, perfumes, eyewear, biometric wearables, and leather. Zero food items.
            </p>
          </div>
          <span className="text-xs font-mono text-[#ef4a23] font-bold">
            100% Provenance Guaranteed
          </span>
        </div>

        {/* UI State: Loading, Missing ID, Error, Empty, or Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-[#141110]/10 p-6 space-y-4 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-[#faf3e4] rounded-full w-24" />
                  <div className="h-5 bg-[#faf3e4] rounded-full w-28" />
                </div>
                <div className="flex gap-5 items-start">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#faf3e4] shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-[#faf3e4] rounded w-20" />
                    <div className="h-5 bg-[#faf3e4] rounded w-4/5" />
                    <div className="h-3 bg-[#faf3e4] rounded w-full" />
                    <div className="h-6 bg-[#faf3e4] rounded w-28 mt-2" />
                  </div>
                </div>
                <div className="h-14 bg-[#faf3e4] rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : !consultationId ? (
          /* Missing Consultation ID State */
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-[#141110]/10 shadow-sm max-w-xl mx-auto my-8 space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#faf3e4] text-[#ef4a23] mx-auto flex items-center justify-center">
              <Compass className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-archivo text-xl font-bold uppercase tracking-tight text-[#141110]">
                No Active Consultation Found
              </h3>
              <p className="text-sm font-playfair italic text-[#141110]/70 max-w-md mx-auto leading-relaxed">
                To discover genuinely grounded luxury gifts calibrated for your recipient, please calibrate a consultation session first.
              </p>
            </div>
            <div>
              <Link
                to="/consultation"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white text-xs font-archivo uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Begin Consultation</span>
              </Link>
            </div>
          </div>
        ) : error ? (
          /* Error State with Retry Button */
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-rose-200 shadow-sm max-w-xl mx-auto my-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-archivo text-xl font-bold text-[#141110]">
                Unable to Load Recommendations
              </h3>
              <p className="text-xs text-[#141110]/65 mt-1 leading-relaxed">
                {error}
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white text-xs font-archivo uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Generation</span>
            </button>
          </div>
        ) : rankedItems.length === 0 ? (
          /* Honest Empty Results State */
          <div className="text-center py-20 px-6 bg-white rounded-3xl border border-[#141110]/10 max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#faf3e4] text-[#141110]/60 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-archivo text-xl font-bold uppercase tracking-tight text-[#141110]">
                No Matching Gifts Found
              </h3>
              <p className="text-sm font-playfair italic text-[#141110]/70 max-w-md mx-auto leading-relaxed">
                No active catalogue products currently matched the exact budget range, occasion, or exclusion parameters of your consultation.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/consultation"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white text-xs font-archivo uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Show Reconsult</span>
              </Link>
              <Link
                to="/gift-studio"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#141110]/20 hover:bg-[#141110]/5 text-xs font-archivo uppercase tracking-wider text-[#141110] font-bold transition-colors cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Browse Gift Studio</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Success State: Products Rendered in Exact Backend Order with Real Scores & Rationales */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rankedItems.map(({ product, score, rationale }, rankIdx) => {
              const isWish = isWishlisted(product.id);
              const isAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-[#141110]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    {/* Top Bar: Rank & Real Backend Score */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#141110] text-[#faf3e4] text-xs font-archivo uppercase tracking-wider font-bold">
                        Match #{rankIdx + 1}
                      </span>
                      <span className="text-xs font-archivo font-bold text-[#ef4a23] px-2.5 py-0.5 rounded-full bg-[#ef4a23]/10">
                        {score}% Emotional Fit
                      </span>
                    </div>

                    {/* Image & Title */}
                    <div className="flex gap-5 items-start">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#141110]/50 font-bold">
                          {product.categoryName}
                        </span>
                        <h3 className="font-archivo uppercase text-lg sm:text-xl font-bold text-[#141110] leading-tight">
                          {product.name}
                        </h3>
                        <p className="font-playfair text-xs sm:text-sm text-[#141110]/75 line-clamp-2 italic">
                          {product.tagline}
                        </p>
                        <div className="font-archivo text-xl font-bold text-[#141110] pt-1">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Real Grounded Calibration Rationale from Backend */}
                    <div className="p-3.5 rounded-xl bg-[#faf3e4]/60 border border-[#141110]/10 text-xs font-playfair text-[#141110]/80 italic leading-relaxed">
                      "{rationale}"
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="p-6 pt-0 flex flex-wrap items-center justify-between gap-3 border-t border-[#141110]/5">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="flex items-center gap-1.5 text-xs font-archivo uppercase tracking-wider text-[#141110]/70 hover:text-[#ef4a23] transition-colors cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isWish ? 'fill-[#ef4a23] text-[#ef4a23]' : ''}`} />
                      <span>{isWish ? 'Saved' : 'Wishlist'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCardProduct(product)}
                        className="px-4 py-2.5 rounded-full border border-[#ef4a23]/30 text-[#ef4a23] hover:bg-[#ef4a23] hover:text-white font-archivo uppercase text-xs tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        title="Personalize AI Gift Card for this recommendation"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>Framed Card</span>
                      </button>

                      <button
                        onClick={() => handleAdd(product)}
                        className={`px-5 py-2.5 rounded-full font-archivo uppercase text-xs tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#141110] hover:bg-[#ef4a23] text-white shadow-sm'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Framed Gift Card Modal for Recommendations */}
        {cardProduct && (
          <FramedGiftCardModal
            isOpen={!!cardProduct}
            onClose={() => setCardProduct(null)}
            giftName={cardProduct.name}
            giftPrice={cardProduct.price}
            giftCategory={cardProduct.categoryName}
            initialRecipientName={profile?.recipientName || 'Recipient'}
            initialEmotion={profile?.desiredEmotion || 'romance'}
          />
        )}

      </div>
    </div>
  );
};

export default Recommendations;

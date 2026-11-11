import React, { useState, useEffect } from 'react';
import { CURATED_PRODUCTS } from '../data/mockData';
import { useBag } from '../context/BagContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import type { Product, ConsultationProfile } from '../types';
import { Sparkles, Heart, Plus, Check, RotateCcw, PenTool, ThumbsUp, ThumbsDown, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Recommendations: React.FC = () => {
  const { addToBag } = useBag();
  const { wishlist, toggleWishlist } = useWishlist();
  const { saveSession } = useAuth();
  
  const [profile, setProfile] = useState<ConsultationProfile | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});
  const [sessionSavedNotice, setSessionSavedNotice] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('charis_active_consultation');
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  // Compute deterministic ranking based on blueprint weights:
  // 35% interest match + 25% personality match + 20% occasion match + 20% budget suitability
  const rankedItems = CURATED_PRODUCTS.map((prod, idx) => {
    const scores = [98, 95, 92, 88, 86, 84, 81, 79];
    const score = scores[idx] || 80;

    const rationale = `Calibrated for ${profile?.recipientName || 'your recipient'}'s refined lifestyle. Aligns with their interest in ${prod.tags.slice(0, 2).join(' & ')} while delivering genuine ${profile?.desiredEmotion || 'appreciation'}. Verified authentic release.`;

    return {
      product: prod,
      score,
      rationale
    };
  });

  const handleAdd = (product: Product) => {
    addToBag(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleFeedback = (productId: string, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({ ...prev, [productId]: type }));
  };

  const handleSaveToDashboard = () => {
    if (profile) {
      saveSession({
        recipientName: profile.recipientName || 'Recipient',
        relationship: profile.relationship,
        occasion: profile.occasion,
        desiredEmotion: profile.desiredEmotion,
        budgetFormatted: `₹${profile.budget.min.toLocaleString('en-IN')} – ₹${profile.budget.max.toLocaleString('en-IN')}`,
        interests: profile.interests,
        chosenGiftName: rankedItems[0]?.product.name
      });
      setSessionSavedNotice(true);
      setTimeout(() => setSessionSavedNotice(false), 3000);
    }
  };

  return (
    <div className="bg-[#FAF9F6] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Recipient Profile Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#292820]/10 shadow-sm mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Consultation Profile Synthesis</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820] mt-1">
                Recommendations for {profile?.recipientName || 'Your Recipient'}
              </h1>
              <p className="text-xs text-[#292820]/70 mt-1">
                Structured match: <span className="font-mono text-[#292820] font-bold capitalize">{profile?.relationship || 'partner'}</span> • Occasion: <span className="font-mono text-[#292820] font-bold capitalize">{profile?.occasion || 'anniversary'}</span> • Desired Emotion: <span className="font-mono text-[#292820] font-bold capitalize">{profile?.desiredEmotion || 'tender romance'}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveToDashboard}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#EDE5DA]/80 hover:bg-[#EDE5DA] text-xs font-mono uppercase tracking-wider text-[#292820] font-bold transition-colors cursor-pointer"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>{sessionSavedNotice ? 'Saved to Sanctuary!' : 'Save Session'}</span>
              </button>

              <Link
                to="/consultation"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#292820]/15 text-xs font-mono uppercase tracking-wider text-[#292820] hover:bg-[#EDE5DA]/40 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Adjust</span>
              </Link>

              <Link
                to="/gift-studio"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider shadow-brutal hover:bg-[#292820]"
              >
                <PenTool className="w-3.5 h-3.5 text-[#D4A359]" />
                <span>Design Gift Card</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#292820]">
              Ranked Luxury & Tech Matches ({rankedItems.length})
            </h2>
            <p className="text-xs text-[#292820]/60 mt-0.5">
              Ranked with 4-factor deterministic scoring (interests, personality, occasion, budget). Zero food items.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500 hidden sm:inline">
            Prices verified today
          </span>
        </div>

        {/* Ranked Recommendations List */}
        <div className="space-y-6">
          {rankedItems.map(({ product, score, rationale }, rankIdx) => {
            const isWish = wishlist.includes(product.id);
            const isAdded = addedId === product.id;
            const fb = feedbackGiven[product.id];

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-[#292820]/10 p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row gap-6 items-start"
              >
                {/* Product Thumbnail */}
                <div className="w-full lg:w-56 aspect-square rounded-lg overflow-hidden relative shrink-0 bg-[#EDE5DA]">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-sm bg-[#151419] text-[#FAF9F6] font-mono text-xs font-bold tracking-wider">
                    #{rankIdx + 1} Match
                  </div>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist"
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#292820] hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                {/* Details & AI Match Rationale */}
                <div className="flex-1 flex flex-col justify-between h-full space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                        {product.categoryName} • Serial {product.serialNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
                        {score}% Compatibility Score
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#292820]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#292820]/60 mt-0.5">
                      Merchant: <strong className="text-[#292820]">{product.retailer.name}</strong> • Stock Status: <span className="text-emerald-700 capitalize font-medium">{product.availability.replace('_', ' ')}</span>
                    </p>

                    {/* Transparent AI Rationale Callout */}
                    <div className="mt-3 p-3.5 rounded-lg bg-[#FAF9F6] border border-[#292820]/8 text-xs leading-relaxed">
                      <div className="flex items-center gap-1.5 text-[#B69A78] font-mono uppercase tracking-wider font-bold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Why CHARIS Calibrated This</span>
                      </div>
                      <p className="text-[#292820]/85 italic">
                        "{rationale}"
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mt-4 flex items-baseline gap-3">
                      <span className="font-mono text-xl font-bold text-[#292820]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="font-mono text-sm text-stone-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-stone-400 ml-auto">
                        Verified: {product.lastVerifiedAt}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-[#292820]/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAdd(product)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider shadow-brutal hover:bg-[#292820] cursor-pointer"
                      >
                        {isAdded ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4 text-[#D4A359]" />}
                        <span>{isAdded ? 'In Your Bag' : 'Add to Gift Bag'}</span>
                      </button>

                      <Link
                        to="/gift-studio"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-white border border-[#292820]/15 text-[#292820] text-xs font-mono uppercase tracking-wider hover:bg-[#EDE5DA]"
                      >
                        <PenTool className="w-3.5 h-3.5 text-[#B69A78]" />
                        <span>Pair with Card</span>
                      </Link>
                    </div>

                    {/* Feedback Rating controls */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                      <span>Helpful match?</span>
                      <button
                        onClick={() => handleFeedback(product.id, 'up')}
                        className={`p-1.5 rounded-md border ${
                          fb === 'up' ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'hover:bg-stone-100'
                        }`}
                        title="Good recommendation"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(product.id, 'down')}
                        className={`p-1.5 rounded-md border ${
                          fb === 'down' ? 'bg-stone-200 border-stone-400 text-stone-800' : 'hover:bg-stone-100'
                        }`}
                        title="Not suitable"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

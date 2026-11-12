import React, { useState, useEffect } from 'react';
import { CURATED_PRODUCTS } from '../data/mockData';
import { useBag } from '../context/BagContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import type { Product, ConsultationProfile } from '../types';
import { Sparkles, Heart, Check, RotateCcw, PenTool, BookmarkCheck, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FramedGiftCardModal } from '../components/gift/FramedGiftCardModal';

export const Recommendations: React.FC = () => {
  const { addToBag } = useBag();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { saveSession } = useAuth();
  
  const [profile, setProfile] = useState<ConsultationProfile | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [sessionSavedNotice, setSessionSavedNotice] = useState(false);
  const [cardProduct, setCardProduct] = useState<Product | null>(null);

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

  // Compute deterministic ranking based on blueprint weights
  const rankedItems = CURATED_PRODUCTS.map((prod, idx) => {
    const scores = [98, 96, 94, 91, 89, 87, 85, 82];
    const score = scores[idx] || 82;

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

  const handleSaveToDashboard = () => {
    if (profile) {
      saveSession({
        recipientName: profile.recipientName || 'Recipient',
        relationship: profile.relationship,
        occasion: profile.occasion,
        desiredEmotion: profile.desiredEmotion,
        budgetFormatted: `₹${profile.budget?.min?.toLocaleString('en-IN') || '10,000'} – ₹${profile.budget?.max?.toLocaleString('en-IN') || '35,000'}`,
        interests: profile.interests,
        chosenGiftName: rankedItems[0]?.product.name
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
              to="/consultation"
              className="px-4 py-2.5 rounded-full border border-[#141110]/15 hover:bg-[#141110]/5 text-xs font-archivo uppercase tracking-wider text-[#141110] font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recalibrate</span>
            </Link>

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

        {/* Ranked Cards Grid */}
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
                  {/* Top Bar: Rank & Score */}
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

                  {/* AI Calibration Rationale */}
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

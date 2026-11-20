import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useBag } from '../context/BagContext';
import { productService } from '../services/productService';
import { consultationService, type ConsultationRecord } from '../services/consultationService';
import type { Product } from '../types';
import {
  Calendar,
  ArrowUpRight,
  LogOut,
  PenTool,
  Plus,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Package,
  Crown,
  Heart,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const { wishlist, refreshWishlist } = useWishlist();
  const { setIsBagOpen, addToBag } = useBag();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [isConsultationsLoading, setIsConsultationsLoading] = useState<boolean>(true);
  const [consultationsError, setConsultationsError] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  useEffect(() => {
    productService.getProducts().then(setAllProducts).catch(() => setAllProducts([]));
  }, []);

  const fetchConsultations = useCallback(async () => {
    setIsConsultationsLoading(true);
    setConsultationsError(null);
    try {
      const data = await consultationService.getConsultations();
      setConsultations(data);
    } catch (err: any) {
      setConsultationsError(
        err.response?.data?.message || err.message || 'Unable to retrieve your consultations from the sanctuary.'
      );
      setConsultations([]);
    } finally {
      setIsConsultationsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // Multi-identifier wishlist matching with deduplication
  const wishlistedProducts = useMemo(() => {
    if (!wishlist || wishlist.length === 0 || !allProducts || allProducts.length === 0) {
      return [];
    }

    const wishlistSet = new Set(wishlist);
    const seenProductKeys = new Set<string>();

    return allProducts.filter((product) => {
      if (!product) return false;

      const matchesId = Boolean(product.id && wishlistSet.has(product.id));
      const matchesMongoId = Boolean(product._id && wishlistSet.has(product._id));
      const matchesSlug = Boolean(product.slug && wishlistSet.has(product.slug));

      const isMatch = matchesId || matchesMongoId || matchesSlug;
      if (!isMatch) return false;

      const uniqueKey = product.id || product._id || product.slug;
      if (!uniqueKey || seenProductKeys.has(uniqueKey)) {
        return false;
      }

      seenProductKeys.add(uniqueKey);
      return true;
    });
  }, [allProducts, wishlist]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleQuickAddToBag = (product: Product) => {
    addToBag(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[8rem] pb-[6rem] px-4 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#ef4a23] border-t-transparent rounded-full animate-spin" />
        <p className="font-archivo text-xs uppercase tracking-widest text-[#141110]/60">
          Entering Private Atelier Sanctuary...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[8rem] pb-[6rem] px-4 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-[#ef4a23] mx-auto border border-[#141110]/10">
          <Crown className="w-8 h-8" />
        </div>
        <h2 className="font-archivo uppercase text-3xl font-bold tracking-tight">
          Member Session Required
        </h2>
        <p className="font-playfair text-base text-[#141110]/70 italic max-w-md">
          Please sign in to access your curated consultations, emotional calibrations, and bespoke atelier keepsakes.
        </p>
        <Link
          to="/login"
          className="px-7 py-3.5 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white font-archivo uppercase text-xs tracking-widest font-bold transition-all shadow-md"
        >
          Sign In to Sanctuary
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[7.5rem] pb-[6rem] px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Luxury Atelier Profile Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#141110]/10 shadow-[0_10px_35px_rgba(20,17,16,0.04)] relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#ffd46e]/30 via-[#ef4a23]/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#141110] text-[#ffd46e] font-archivo text-2xl sm:text-3xl font-bold flex items-center justify-center border-2 border-[#ef4a23] shadow-md shrink-0">
                {user.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd46e]/40 border border-[#ffd46e] text-[#141110] text-[10px] font-archivo uppercase font-bold tracking-wider">
                  <Crown className="w-3 h-3 text-[#ef4a23]" />
                  <span>Private Atelier Member • Haute Connoisseur</span>
                </div>

                <h1
                  className="font-archivo uppercase text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141110] leading-none"
                  style={{ fontStretch: '72%' }}
                >
                  {user.name}
                </h1>

                <p className="text-xs sm:text-sm text-[#141110]/65 font-mono">
                  {user.email} • Member ID: #{user.id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Link
                to="/consultation"
                className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white font-archivo uppercase text-xs tracking-wider font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Consultation</span>
              </Link>

              <button
                onClick={() => setIsBagOpen(true)}
                className="px-5 py-3 rounded-full bg-[#faf3e4] hover:bg-[#ffd46e] text-xs font-archivo uppercase tracking-wider text-[#141110] font-bold transition-colors flex items-center justify-center gap-2 border border-[#141110]/10 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#ef4a23]" />
                <span>Gift Bag</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-3 rounded-full border border-rose-200 hover:bg-rose-50 text-xs font-archivo uppercase tracking-wider text-rose-600 font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Sign out of active atelier session"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Key Atelier Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#141110]/10">
            <div className="p-4 rounded-2xl bg-[#faf3e4]/70 border border-[#141110]/5 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#141110]/60 font-bold">
                Active Consultations
              </span>
              <p className="font-archivo text-2xl font-bold text-[#141110]">
                {consultations.length}
              </p>
              <span className="text-[11px] font-playfair italic text-[#141110]/70">
                Calibrated Tara profiles
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf3e4]/70 border border-[#141110]/5 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#141110]/60 font-bold">
                Bookmarked Keepsakes
              </span>
              <p className="font-archivo text-2xl font-bold text-[#ef4a23]">
                {wishlistedProducts.length}
              </p>
              <span className="text-[11px] font-playfair italic text-[#141110]/70">
                Curated atelier tokens
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf3e4]/70 border border-[#141110]/5 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#141110]/60 font-bold">
                Artisan Provenance
              </span>
              <p className="font-archivo text-2xl font-bold text-[#141110]">
                100%
              </p>
              <span className="text-[11px] font-playfair italic text-[#141110]/70">
                Direct verified workshops
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf3e4]/70 border border-[#141110]/5 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#141110]/60 font-bold">
                Member Concierge
              </span>
              <p className="font-archivo text-2xl font-bold text-[#141110] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </p>
              <span className="text-[11px] font-playfair italic text-[#141110]/70">
                Priority artisan liaison
              </span>
            </div>
          </div>
        </div>

        {/* Member Sanctuary Privileges Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#141110]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffd46e]/40 text-[#141110] flex items-center justify-center">
              <PenTool className="w-5 h-5 text-[#ef4a23]" />
            </div>
            <h3 className="font-archivo uppercase text-base font-bold text-[#141110]">
              Hand-Penned Stationery
            </h3>
            <p className="font-playfair text-xs text-[#141110]/70 leading-relaxed italic">
              Every consultation gift unlocks complimentary artisan calligraphy cards crafted by our Bangalore studio calligraphers.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#141110]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffd46e]/40 text-[#141110] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#ef4a23]" />
            </div>
            <h3 className="font-archivo uppercase text-base font-bold text-[#141110]">
              Direct Artisan Checkout
            </h3>
            <p className="font-playfair text-xs text-[#141110]/70 leading-relaxed italic">
              Verified HTTPS checkout connections directly to original ateliers, independent perfumers, and authorized watchmakers with zero markup.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#141110]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffd46e]/40 text-[#141110] flex items-center justify-center">
              <Package className="w-5 h-5 text-[#ef4a23]" />
            </div>
            <h3 className="font-archivo uppercase text-base font-bold text-[#141110]">
              Discrete Matte Presentation
            </h3>
            <p className="font-playfair text-xs text-[#141110]/70 leading-relaxed italic">
              All gifts arrive in signature matte ivory sanctuary encasements tied with pure raw silk ribbon and hot stamped wax seal.
            </p>
          </div>
        </div>

        {/* Saved Consultations Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#141110]/10 pb-3">
            <div>
              <h2 className="font-archivo uppercase text-2xl sm:text-3xl font-bold text-[#141110]">
                Saved Consultations & Profiles ({consultations.length})
              </h2>
              <p className="font-playfair text-xs sm:text-sm text-[#141110]/65 italic">
                Active Tara empathy sessions and calibrated recommendation sets
              </p>
            </div>
            <Link
              to="/consultation"
              className="text-xs font-archivo uppercase tracking-wider text-[#ef4a23] font-bold hover:underline flex items-center gap-1"
            >
              <span>New Session</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isConsultationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl p-6 border border-[#141110]/10 shadow-xs space-y-4 animate-pulse"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-[#faf3e4] rounded w-20" />
                    <div className="h-3 bg-[#faf3e4] rounded w-24" />
                  </div>
                  <div className="h-6 bg-[#faf3e4] rounded w-3/4" />
                  <div className="h-4 bg-[#faf3e4] rounded w-full" />
                  <div className="h-3 bg-[#faf3e4] rounded w-1/2 pt-2" />
                </div>
              ))}
            </div>
          ) : consultationsError ? (
            <div className="p-8 rounded-2xl bg-white border border-rose-200 text-center space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-archivo text-lg font-bold text-[#141110]">
                  Unable to Load Consultations
                </h3>
                <p className="text-xs text-[#141110]/70 mt-1 leading-relaxed">
                  {consultationsError}
                </p>
              </div>
              <button
                onClick={fetchConsultations}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white text-xs font-archivo uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          ) : consultations.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#141110]/10 text-center space-y-4 max-w-xl mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#faf3e4] text-[#ef4a23] mx-auto flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-archivo uppercase text-xl font-bold text-[#141110]">
                  No Consultations Saved Yet
                </h3>
                <p className="font-playfair text-sm text-[#141110]/70 italic leading-relaxed">
                  Tara, our sentiment architect, is ready to help you discover heirloom-quality keepsakes for your loved ones.
                </p>
              </div>
              <Link
                to="/consultation"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white font-archivo uppercase text-xs tracking-widest font-bold transition-colors shadow-sm"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Consult Tara Now</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultations.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-3xl p-6 border border-[#141110]/10 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#141110]/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#ef4a23]" />
                        {session.date}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ef4a23]/10 text-[#ef4a23] font-bold uppercase text-[10px]">
                        {session.occasion}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-archivo uppercase text-xl font-bold text-[#141110]">
                        For {session.recipientName}
                      </h3>
                      <p className="text-xs font-playfair text-[#141110]/75 italic mt-0.5">
                        Bond: <strong className="text-[#141110] capitalize">{session.relationship}</strong> • Emotion:{' '}
                        <strong className="text-[#ef4a23] capitalize">{session.desiredEmotion}</strong>
                      </p>
                    </div>

                    {session.interests && session.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {session.interests.slice(0, 3).map((int, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-[#faf3e4] text-[#141110]/70 text-[10px] font-mono font-medium"
                          >
                            {int}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-xs font-mono text-[#141110]/60 pt-2 border-t border-[#141110]/10 flex items-center justify-between">
                      <span>Calibrated Budget</span>
                      <span className="font-bold text-[#141110]">{session.budgetFormatted}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#141110]/5">
                    <Link
                      to="/recommendations"
                      state={{ consultationId: session.id, profile: session }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141110] hover:bg-[#ef4a23] text-white text-xs font-archivo uppercase tracking-wider font-bold transition-colors shadow-xs"
                    >
                      <span>View Curations</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#ffd46e]" />
                    </Link>

                    <Link
                      to="/gift-studio"
                      className="p-2.5 rounded-full border border-[#141110]/15 hover:bg-[#faf3e4] text-[#141110] transition-colors"
                      title="Write Stationery Card in Studio"
                    >
                      <PenTool className="w-4 h-4 text-[#ef4a23]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Items */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#141110]/10 pb-3">
            <div>
              <h2 className="font-archivo uppercase text-2xl sm:text-3xl font-bold text-[#141110]">
                Bookmarked Keepsakes & Heirlooms ({wishlistedProducts.length})
              </h2>
              <p className="font-playfair text-xs sm:text-sm text-[#141110]/65 italic">
                Artisan pieces saved from the consultation sanctuary and gift studio
              </p>
            </div>
            <Link
              to="/gift-studio"
              className="text-xs font-archivo uppercase tracking-wider text-[#ef4a23] font-bold hover:underline flex items-center gap-1"
            >
              <span>Explore All 100</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white border border-[#141110]/10 text-center space-y-3 max-w-xl mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#faf3e4] text-[#141110]/40 mx-auto flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <p className="font-playfair text-base text-[#141110]/75 italic">
                No bookmarked keepsakes yet. Tap the heart on any piece in the studio or recommendations to save it here.
              </p>
              <Link
                to="/gift-studio"
                className="inline-block px-6 py-2.5 rounded-full bg-[#141110] hover:bg-[#ef4a23] text-white text-xs font-archivo uppercase tracking-wider font-bold transition-colors"
              >
                Browse 100 Curated Gifts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistedProducts.map((prod) => (
                <div
                  key={prod.id || prod._id || prod.slug}
                  className="bg-white rounded-3xl border border-[#141110]/10 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative group">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#141110]/80 text-[#faf3e4] font-mono text-[9px] uppercase font-bold tracking-wider backdrop-blur-xs">
                      {prod.categoryName}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="font-archivo uppercase text-sm font-bold text-[#141110] line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-xs font-playfair italic text-[#141110]/60 line-clamp-1">
                        {prod.tagline}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#141110]/10">
                      <span className="font-archivo font-bold text-base text-[#141110]">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>

                      <button
                        onClick={() => handleQuickAddToBag(prod)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-archivo uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                          addedProductId === prod.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#ef4a23] hover:bg-[#141110] text-white shadow-xs'
                        }`}
                      >
                        {addedProductId === prod.id ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

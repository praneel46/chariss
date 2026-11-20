import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { productService } from '../services/productService';
import { consultationService, type ConsultationRecord } from '../services/consultationService';
import type { Product } from '../types';
import { Calendar, ArrowUpRight, LogOut, PenTool, Plus, AlertCircle, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const { wishlist, refreshWishlist } = useWishlist();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [isConsultationsLoading, setIsConsultationsLoading] = useState<boolean>(true);
  const [consultationsError, setConsultationsError] = useState<string | null>(null);

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

  // Multi-identifier wishlist matching with deduplication and safe fallback
  const wishlistedProducts = useMemo(() => {
    if (!wishlist || wishlist.length === 0 || !allProducts || allProducts.length === 0) {
      return [];
    }

    const wishlistSet = new Set(wishlist);
    const seenProductKeys = new Set<string>();

    return allProducts.filter((product) => {
      if (!product) return false;

      // 1. Support MongoDB _id, normalized id, and product slug
      const matchesId = Boolean(product.id && wishlistSet.has(product.id));
      const matchesMongoId = Boolean(product._id && wishlistSet.has(product._id));
      const matchesSlug = Boolean(product.slug && wishlistSet.has(product.slug));

      const isMatch = matchesId || matchesMongoId || matchesSlug;
      if (!isMatch) return false;

      // 2. Prevent duplicate product cards if multiple identifiers refer to the same product
      const uniqueKey = product.id || product._id || product.slug;
      if (!uniqueKey || seenProductKeys.has(uniqueKey)) {
        return false;
      }

      seenProductKeys.add(uniqueKey);
      return true;
    });
  }, [allProducts, wishlist]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[8rem] pb-[6rem] px-4 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#ef4a23] border-t-transparent rounded-full animate-spin" />
        <p className="font-archivo text-xs uppercase tracking-widest text-[#141110]/60">Loading Session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[8rem] pb-[6rem] px-4 text-center flex flex-col items-center justify-center space-y-4">
        <h2 className="font-archivo uppercase text-3xl font-bold">Session Required</h2>
        <p className="font-playfair text-base text-[#141110]/70 italic">Please sign in to access your saved consultations and curations.</p>
        <Link
          to="/login"
          className="px-6 py-3 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white font-archivo uppercase text-xs tracking-widest font-bold transition-colors shadow-sm"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[7rem] pb-[6rem] px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* User Atelier Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#141110]/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#141110] text-[#ffd46e] font-archivo text-2xl font-bold flex items-center justify-center border-2 border-[#ef4a23]">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h1
                className="font-archivo uppercase text-2xl sm:text-4xl font-bold tracking-tight text-[#141110] leading-none"
                style={{ fontStretch: '72%' }}
              >
                {user.name}
              </h1>
              <p className="text-xs text-[#141110]/60 font-mono">
                {user.email} • {consultations.length} Active Consultations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/consultation"
              className="px-5 py-2.5 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white font-archivo uppercase text-xs tracking-wider font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Consultation</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-full border border-[#141110]/15 hover:bg-[#141110]/5 text-xs font-archivo uppercase tracking-wider text-[#141110] font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Saved Consultations Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#141110]/10 pb-3">
            <h2 className="font-archivo uppercase text-2xl font-bold text-[#141110]">
              Saved Consultations & Profiles ({consultations.length})
            </h2>
            <Link
              to="/consultation"
              className="text-xs font-archivo uppercase tracking-wider text-[#ef4a23] font-bold hover:underline"
            >
              Start New Calibration →
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
            <div className="p-10 rounded-2xl bg-white border border-[#141110]/10 text-center space-y-3">
              <p className="font-playfair text-lg text-[#141110]/70 italic">No consultations saved yet.</p>
              <Link
                to="/consultation"
                className="inline-block px-6 py-2.5 rounded-full bg-[#ef4a23] text-white font-archivo uppercase text-xs tracking-widest font-bold"
              >
                Begin Your First Session
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultations.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-2xl p-6 border border-[#141110]/10 shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#141110]/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {session.date}
                      </span>
                      <span className="text-[#ef4a23] font-bold uppercase">{session.occasion}</span>
                    </div>

                    <h3 className="font-archivo uppercase text-xl font-bold text-[#141110]">
                      For {session.recipientName}
                    </h3>

                    <p className="text-xs font-playfair text-[#141110]/70 italic">
                      Bond: <strong className="text-[#141110] capitalize">{session.relationship}</strong> • Emotion: <strong className="text-[#ef4a23] capitalize">{session.desiredEmotion}</strong>
                    </p>

                    <div className="text-xs font-mono text-[#141110]/60 pt-2 border-t border-[#141110]/10">
                      Budget: {session.budgetFormatted}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Link
                      to="/recommendations"
                      state={{ consultationId: session.id, profile: session }}
                      className="inline-flex items-center gap-1 text-xs font-archivo uppercase tracking-wider font-bold text-[#ef4a23] hover:underline"
                    >
                      <span>View Curations</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to="/gift-studio"
                      className="p-2 rounded-full border border-[#141110]/10 hover:bg-[#141110]/5 text-[#141110]"
                      title="Write Stationery Card"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Items */}
        <div className="space-y-6">
          <div className="border-b border-[#141110]/10 pb-3">
            <h2 className="font-archivo uppercase text-2xl font-bold text-[#141110]">
              Bookmarked Keepsakes & Heirlooms ({wishlistedProducts.length})
            </h2>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-[#141110]/10 text-center space-y-2">
              <p className="font-playfair text-base text-[#141110]/70 italic">No bookmarked items yet.</p>
              <Link to="/gift-studio" className="text-xs font-archivo uppercase text-[#ef4a23] font-bold underline">
                Browse 100 Curated Gifts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistedProducts.map((prod) => (
                <div key={prod.id || prod._id || prod.slug} className="bg-white rounded-2xl border border-[#141110]/10 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-archivo uppercase text-sm font-bold text-[#141110] line-clamp-1">{prod.name}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-archivo font-bold text-[#141110]">₹{prod.price.toLocaleString('en-IN')}</span>
                      <Link to="/gift-studio" className="text-[#ef4a23] font-bold text-[11px] font-archivo uppercase">
                        View in Studio
                      </Link>
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

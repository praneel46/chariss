import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { CURATED_PRODUCTS } from '../data/mockData';
import { Sparkles, Calendar, Heart, ArrowUpRight, LogOut, ShieldCheck, PenTool, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, logout, savedSessions } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="bg-[#FAF9F6] py-20 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#292820]">Session Required</h2>
        <p className="text-sm text-[#292820]/70 mt-2">Please sign in to access your saved consultations.</p>
        <Link
          to="/login"
          className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider shadow-brutal"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const wishlistedProducts = CURATED_PRODUCTS.filter(p => wishlist.includes(p.id));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-[#FAF9F6] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* User Sanctuary Profile Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#292820]/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#151419] text-[#D4A359] font-serif text-2xl font-bold flex items-center justify-center border-2 border-[#D4A359]">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Member Session</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820]">
                {user.name}
              </h1>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                {user.email} • Active Consultations: {savedSessions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/consultation"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider shadow-brutal hover:bg-[#292820]"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>New Consultation</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-[#EDE5DA]/60 hover:bg-[#EDE5DA] text-xs font-mono uppercase tracking-wider text-[#292820] font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Saved Consultations Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#292820]/10 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#292820]">
                Saved AI Consultations ({savedSessions.length})
              </h2>
              <p className="text-xs text-[#292820]/60 mt-0.5">
                Every consultation records recipient quirks, desired emotion, and calibrated gift matches.
              </p>
            </div>
            <Link
              to="/consultation"
              className="text-xs font-mono uppercase tracking-wider text-[#B69A78] hover:text-[#292820] font-bold flex items-center gap-1"
            >
              <span>Launch Engine</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {savedSessions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[#292820]/10 p-6">
              <p className="font-serif text-lg font-bold text-[#292820]">No consultations saved yet</p>
              <p className="text-xs text-[#292820]/60 mt-1 max-w-sm mx-auto">
                Take our 2-minute guided consultation to generate explainable recommendations for someone special.
              </p>
              <Link
                to="/consultation"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider shadow-brutal"
              >
                Start First Consultation
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-xl border border-[#292820]/10 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {session.date}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#EDE5DA] text-[#292820] font-bold uppercase text-[10px]">
                        {session.occasion}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#292820]">
                        For {session.recipientName} ({session.relationship})
                      </h3>
                      <p className="text-xs text-[#B69A78] font-mono mt-0.5">
                        Target Emotion: <strong className="text-[#292820]">{session.desiredEmotion}</strong> • Budget: {session.budgetFormatted}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {session.interests.map((int, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#FAF9F6] border border-[#292820]/10 text-[10px] font-mono text-stone-600 rounded-sm">
                          {int}
                        </span>
                      ))}
                    </div>

                    {session.chosenGiftName && (
                      <div className="p-3 bg-[#EDE5DA]/40 rounded-lg border border-[#EDE5DA] text-xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#B69A78] font-bold block">
                            Chosen Match
                          </span>
                          <strong className="text-[#292820] font-serif">{session.chosenGiftName}</strong>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                          Verified
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#292820]/10 mt-6 flex items-center justify-between">
                    <Link
                      to="/recommendations"
                      className="text-xs font-mono uppercase tracking-wider text-[#151419] font-bold hover:text-[#B69A78] flex items-center gap-1"
                    >
                      <span>View Results</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to="/gift-studio"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#151419] text-[#FAF9F6] text-[11px] font-mono uppercase tracking-wider shadow-xs"
                    >
                      <PenTool className="w-3 h-3 text-[#D4A359]" />
                      <span>Card Studio</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Bookmarks */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-[#292820]/10 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#292820]">
                Saved Keepsakes & Wishlist ({wishlistedProducts.length})
              </h2>
              <p className="text-xs text-[#292820]/60 mt-0.5">
                Bookmarked pieces across smart wearables, fine timepieces, and novelties.
              </p>
            </div>
            <Link
              to="/discover"
              className="text-xs font-mono uppercase tracking-wider text-[#B69A78] hover:text-[#292820] font-bold"
            >
              Explore Full Collection ↗
            </Link>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-[#292820]/10 p-6">
              <Heart className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="font-serif text-base font-bold text-[#292820]">Your wishlist is currently empty</p>
              <p className="text-xs text-[#292820]/60 mt-1">Tap the heart icon on any curated gift to bookmark it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistedProducts.map((prod) => (
                <div key={prod.id} className="bg-white rounded-xl border border-[#292820]/10 p-4 flex flex-col justify-between">
                  <div className="aspect-square rounded-lg overflow-hidden bg-[#EDE5DA] mb-3">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#B69A78] font-bold">{prod.categoryName}</span>
                    <h4 className="font-serif text-sm font-bold text-[#292820] line-clamp-1">{prod.name}</h4>
                    <p className="font-mono text-xs font-bold text-[#292820] mt-1">₹{prod.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Safeguards Info Box */}
        <div className="p-6 bg-[#EDE5DA]/40 rounded-2xl border border-[#292820]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
            <div>
              <h4 className="font-serif text-sm font-bold text-[#292820]">Confidential Personal Session</h4>
              <p className="text-xs text-[#292820]/70">Your relationship memories and consultation answers are sandboxed and never sold to ad networks.</p>
            </div>
          </div>
          <span className="text-xs font-mono uppercase text-[#B69A78] font-bold">CHARIS Privacy Guarantee</span>
        </div>

      </div>
    </div>
  );
};

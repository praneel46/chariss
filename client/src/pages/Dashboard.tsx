import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { CURATED_PRODUCTS } from '../data/mockData';
import { Sparkles, Calendar, ArrowUpRight, LogOut, PenTool, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, logout, savedSessions } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

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

  const wishlistedProducts = CURATED_PRODUCTS.filter(p => wishlist.includes(p.id));

  const handleLogout = () => {
    logout();
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
              <div className="flex items-center gap-2 text-xs font-archivo uppercase tracking-widest text-[#ef4a23] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Member Session</span>
              </div>
              <h1
                className="font-archivo uppercase text-2xl sm:text-4xl font-bold tracking-tight text-[#141110] leading-none"
                style={{ fontStretch: '72%' }}
              >
                {user.name}
              </h1>
              <p className="text-xs text-[#141110]/60 font-mono">
                {user.email} • {savedSessions.length} Active Consultations
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
              Saved Consultations & Profiles ({savedSessions.length})
            </h2>
            <Link
              to="/consultation"
              className="text-xs font-archivo uppercase tracking-wider text-[#ef4a23] font-bold hover:underline"
            >
              Start New Calibration →
            </Link>
          </div>

          {savedSessions.length === 0 ? (
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
              {savedSessions.map((session) => (
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
                <div key={prod.id} className="bg-white rounded-2xl border border-[#141110]/10 overflow-hidden shadow-xs flex flex-col justify-between">
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

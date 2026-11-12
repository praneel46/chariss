import React from 'react';
import { X, Sparkles, ShieldCheck, HeartHandshake, HelpCircle, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export type ModalType = 'ateliers' | 'how-it-works' | 'pricing-trust' | 'faq' | 'privacy' | null;

interface AtelierAndFooterModalsProps {
  activeModal: ModalType;
  onClose: () => void;
}

export const AtelierAndFooterModals: React.FC<AtelierAndFooterModalsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#141110]/80 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#faf3e4] text-[#141110] rounded-2xl shadow-2xl border border-[#ef4a23]/20 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#ef4a23] via-[#ffd46e] to-[#8fc6e8]" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/80 hover:bg-[#ef4a23] text-[#141110] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL 1: WHAT ARE ATELIERS */}
        {activeModal === 'ateliers' && (
          <div className="p-8 sm:p-12 space-y-6">
            <div className="flex items-center gap-2 text-xs font-archivo uppercase tracking-widest text-[#ef4a23] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Independent Craftsmanship</span>
            </div>

            <div>
              <h2 className="font-archivo uppercase text-3xl sm:text-4xl font-bold tracking-tight text-[#141110] leading-none">
                What are <span className="font-playfair italic lowercase text-[#ef4a23]">charis.</span> Ateliers?
              </h2>
              <p className="font-playfair text-lg text-[#141110]/80 mt-3 leading-relaxed">
                We believe genuine emotion cannot be manufactured on an assembly line. CHARIS Ateliers are our verified global collective of independent master workshops, horology houses, niche perfumers, and heirloom leather crafters.
              </p>
            </div>

            {/* Atelier Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-xl bg-white/60 border border-[#141110]/10 space-y-2">
                <span className="text-2xl">⌚</span>
                <h3 className="font-archivo uppercase text-sm font-bold tracking-wide">
                  Geneva & Kyoto Watchmakers
                </h3>
                <p className="text-xs font-playfair text-[#141110]/75 leading-relaxed">
                  Mechanical movements assembled by hand, regulated across 5 positions, and certified with heirloom provenance.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/60 border border-[#141110]/10 space-y-2">
                <span className="text-2xl">🌹</span>
                <h3 className="font-archivo uppercase text-sm font-bold tracking-wide">
                  Grasse Botanical Perfumeries
                </h3>
                <p className="text-xs font-playfair text-[#141110]/75 leading-relaxed">
                  Single-harvest extraits de parfum aged in French glass demijohns with zero synthetic fillers.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/60 border border-[#141110]/10 space-y-2">
                <span className="text-2xl">👜</span>
                <h3 className="font-archivo uppercase text-sm font-bold tracking-wide">
                  Tuscan Leather Guilds
                </h3>
                <p className="text-xs font-playfair text-[#141110]/75 leading-relaxed">
                  Vegetable-tanned full-grain leather hand-saddle-stitched with waxed linen thread in Florence.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/60 border border-[#141110]/10 space-y-2">
                <span className="text-2xl">💍</span>
                <h3 className="font-archivo uppercase text-sm font-bold tracking-wide">
                  Biometric Precision Labs
                </h3>
                <p className="text-xs font-playfair text-[#141110]/75 leading-relaxed">
                  Titanium smart rings and ambient connected artifacts that calibrate seamlessly with personal health indices.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#141110]/10">
              <span className="text-xs font-mono text-[#141110]/60">
                100% Guaranteed Provenance & Hand-Packaged
              </span>
              <Link
                to="/consultation"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-[#faf3e4] font-archivo uppercase text-xs tracking-widest font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Curate with an Atelier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* MODAL 2: HOW CHARIS WORKS */}
        {activeModal === 'how-it-works' && (
          <div className="p-8 sm:p-12 space-y-6">
            <div className="flex items-center gap-2 text-xs font-archivo uppercase tracking-widest text-[#ef4a23] font-bold">
              <Layers className="w-4 h-4" />
              <span>Curation Engine</span>
            </div>

            <div>
              <h2 className="font-archivo uppercase text-3xl sm:text-4xl font-bold tracking-tight text-[#141110] leading-none">
                How <span className="font-playfair italic lowercase text-[#ef4a23]">charis.</span> Works
              </h2>
              <p className="font-playfair text-lg text-[#141110]/80 mt-3 leading-relaxed">
                All feelings, zero guesswork. We replaced generic retail lists with a 3-step sentiment calibration process that pairs human intent with world-class craft.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 p-4 rounded-xl bg-white/70 border border-[#141110]/10">
                <div className="w-10 h-10 rounded-full bg-[#ef4a23] text-white flex items-center justify-center font-archivo font-bold text-sm shrink-0">
                  01
                </div>
                <div>
                  <h3 className="font-archivo uppercase text-sm font-bold tracking-wide">
                    Sentiment & Relationship Calibration
                  </h3>
                  <p className="text-xs font-playfair text-[#141110]/75 mt-1 leading-relaxed">
                    Tell us who you are honoring, the shared history, and the exact emotional nuance you want them to feel (deep devotion, quiet solace, milestone triumph, or spontaneous warmth).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-white/70 border border-[#141110]/10">
                <div className="w-10 h-10 rounded-full bg-[#ffd46e] text-[#141110] flex items-center justify-center font-archivo font-bold text-sm shrink-0">
                  02
                </div>
                <div>
                  <h3 className="font-archivo uppercase text-sm font-bold tracking-wide">
                    Atelier Matching & Personalization
                  </h3>
                  <p className="text-xs font-playfair text-[#141110]/75 mt-1 leading-relaxed">
                    Our AI cross-references your sentiment index with 100+ master atelier creations — filtering out generic clutter and selecting pieces with bespoke engraving and coordinates.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-white/70 border border-[#141110]/10">
                <div className="w-10 h-10 rounded-full bg-[#8fc6e8] text-[#141110] flex items-center justify-center font-archivo font-bold text-sm shrink-0">
                  03
                </div>
                <div>
                  <h3 className="font-archivo uppercase text-sm font-bold tracking-wide">
                    Hand-Packaged with Archival Card
                  </h3>
                  <p className="text-xs font-playfair text-[#141110]/75 mt-1 leading-relaxed">
                    Every piece is packaged in a tactile linen gift box with wax-sealed custom stationery and discrete unbranded exterior delivery.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <Link
                to="/consultation"
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-[#faf3e4] font-archivo uppercase text-xs tracking-widest font-bold flex items-center gap-2 transition-colors"
              >
                <span>Start Curation (Takes 2 mins)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* MODAL 3: VERIFIED PRICING & TRUST */}
        {activeModal === 'pricing-trust' && (
          <div className="p-8 sm:p-12 space-y-6">
            <div className="flex items-center gap-2 text-xs font-archivo uppercase tracking-widest text-[#ef4a23] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Dark Patterns</span>
            </div>

            <div>
              <h2 className="font-archivo uppercase text-3xl sm:text-4xl font-bold tracking-tight text-[#141110] leading-none">
                Verified Pricing & Trust
              </h2>
              <p className="font-playfair text-lg text-[#141110]/80 mt-3 leading-relaxed">
                Gift-giving is built on sincerity. We eliminate middlemen, fake countdown timers, and hidden retail surcharges.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-white/70 border border-[#141110]/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#ef4a23] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-archivo uppercase text-xs font-bold tracking-wide">Direct Atelier Provenance</h4>
                  <p className="text-xs font-playfair text-[#141110]/75 mt-0.5">
                    Prices reflect direct workshop costs. You pay what the master artisan values their time and materials for.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-[#141110]/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#ef4a23] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-archivo uppercase text-xs font-bold tracking-wide">Included Personalization & Engraving</h4>
                  <p className="text-xs font-playfair text-[#141110]/75 mt-0.5">
                    Laser coordinate etching, monogram stamping, and custom stationery printing are included transparently with no surprise checkout fees.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-[#141110]/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#ef4a23] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-archivo uppercase text-xs font-bold tracking-wide">100% Sentiment Guarantee</h4>
                  <p className="text-xs font-playfair text-[#141110]/75 mt-0.5">
                    If the recipient is not genuinely touched by the curation, we will exchange or adjust the piece with zero questions asked within 30 days.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#141110] hover:bg-[#ef4a23] text-white font-archivo uppercase text-xs tracking-widest font-bold transition-colors cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        )}

        {/* MODAL 4: FREQUENT QUESTIONS */}
        {activeModal === 'faq' && (
          <div className="p-8 sm:p-12 space-y-6">
            <div className="flex items-center gap-2 text-xs font-archivo uppercase tracking-widest text-[#ef4a23] font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>Concierge Answers</span>
            </div>

            <div>
              <h2 className="font-archivo uppercase text-3xl sm:text-4xl font-bold tracking-tight text-[#141110] leading-none">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3 pt-2 max-h-[50vh] overflow-y-auto pr-2">
              <div className="p-4 rounded-xl bg-white/80 border border-[#141110]/10">
                <h4 className="font-archivo uppercase text-xs font-bold tracking-wide text-[#141110]">
                  How long does personalized engraving and delivery take?
                </h4>
                <p className="text-xs font-playfair text-[#141110]/75 mt-1 leading-relaxed">
                  Most personalized keepsakes and watches are engraved within 24–48 hours and arrive in 3–5 business days with expedited temperature-controlled courier shipping.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 border border-[#141110]/10">
                <h4 className="font-archivo uppercase text-xs font-bold tracking-wide text-[#141110]">
                  Will the recipient see the price on the box or invoice?
                </h4>
                <p className="text-xs font-playfair text-[#141110]/75 mt-1 leading-relaxed">
                  Never. All CHARIS orders ship as discreet presentation gifts. Digital receipts and authenticity certificates are delivered strictly to your personal email or dashboard.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 border border-[#141110]/10">
                <h4 className="font-archivo uppercase text-xs font-bold tracking-wide text-[#141110]">
                  Can I review and edit the card message before it is sealed?
                </h4>
                <p className="text-xs font-playfair text-[#141110]/75 mt-1 leading-relaxed">
                  Yes! In the Gift Studio, you can preview the typography, rewrite the copy, or let our AI generate heartfelt, humorous, or poetic messages tailored to your tone.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 border border-[#141110]/10">
                <h4 className="font-archivo uppercase text-xs font-bold tracking-wide text-[#141110]">
                  Do you ship internationally?
                </h4>
                <p className="text-xs font-playfair text-[#141110]/75 mt-1 leading-relaxed">
                  We ship directly to over 45 countries with pre-paid import duties so your recipient never experiences customs delays or unexpected fees.
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#141110] hover:bg-[#ef4a23] text-white font-archivo uppercase text-xs tracking-widest font-bold transition-colors cursor-pointer"
              >
                Close FAQ
              </button>
            </div>
          </div>
        )}

        {/* MODAL 5: PRIVACY SAFEGUARDS */}
        {activeModal === 'privacy' && (
          <div className="p-8 sm:p-12 space-y-6">
            <div className="flex items-center gap-2 text-xs font-archivo uppercase tracking-widest text-[#ef4a23] font-bold">
              <HeartHandshake className="w-4 h-4" />
              <span>Discretion & Security</span>
            </div>

            <div>
              <h2 className="font-archivo uppercase text-3xl sm:text-4xl font-bold tracking-tight text-[#141110] leading-none">
                Privacy Safeguards
              </h2>
              <p className="font-playfair text-lg text-[#141110]/80 mt-3 leading-relaxed">
                Personal relationships and sentimental memories require sacred confidentiality. Here is our pledge to you:
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-white/70 border border-[#141110]/10">
                <h4 className="font-archivo uppercase text-xs font-bold tracking-wide text-[#ef4a23]">
                  1. Zero Data Brokerage
                </h4>
                <p className="text-xs font-playfair text-[#141110]/75 mt-1">
                  We never sell, rent, or monetize your consultation responses, recipient preferences, or milestone dates with third-party advertising networks.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-[#141110]/10">
                <h4 className="font-archivo uppercase text-xs font-bold tracking-wide text-[#ef4a23]">
                  2. Discrete Plain Exterior Packaging
                </h4>
                <p className="text-xs font-playfair text-[#141110]/75 mt-1">
                  Outer shipping cartons have zero promotional branding or giveaway spoilers. The luxury linen presentation box is safely protected inside.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-[#141110]/10">
                <h4 className="font-archivo uppercase text-xs font-bold tracking-wide text-[#ef4a23]">
                  3. Encrypted Consultation History
                </h4>
                <p className="text-xs font-playfair text-[#141110]/75 mt-1">
                  Session data is tied to your encrypted account or cleared immediately if browsing as a guest. You can purge your consultation memory anytime with one click.
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#141110] hover:bg-[#ef4a23] text-white font-archivo uppercase text-xs tracking-widest font-bold transition-colors cursor-pointer"
              >
                I Agree
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Trash2, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#FAF9F6] rounded-2xl border border-[#292820]/15 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#EDE5DA] text-[#292820] flex items-center justify-center hover:bg-[#DCCFC1] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Charis Data Integrity Covenant</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292820]">
          Privacy Safeguards
        </h2>
        <p className="text-xs sm:text-sm text-[#292820]/70 mt-1 leading-relaxed">
          Gifting is deeply personal. CHARIS was architected around radical privacy standards to ensure your emotional sentiments never become advertising fodder.
        </p>

        {/* Safeguards Grid */}
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-xl bg-white border border-[#292820]/10 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#EDE5DA] flex items-center justify-center shrink-0 mt-0.5">
              <EyeOff className="w-4 h-4 text-[#292820]" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#292820]">
                Zero Ad Trackers or Third-Party Brokers
              </h3>
              <p className="text-xs text-[#292820]/75 mt-1 leading-relaxed">
                We do not sell, license, or syndicate recipient profiles, anniversary dates, or relationship histories to any data aggregators or ad networks.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#292820]/10 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#EDE5DA] flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4 text-[#292820]" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#292820]">
                Encrypted Session Storage
              </h3>
              <p className="text-xs text-[#292820]/75 mt-1 leading-relaxed">
                Your consultation inputs, card messages, and chosen curations are preserved locally within your private session environment, accessible exclusively by you.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#292820]/10 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#EDE5DA] flex items-center justify-center shrink-0 mt-0.5">
              <Trash2 className="w-4 h-4 text-[#292820]" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#292820]">
                Immediate 1-Click Erasure
              </h3>
              <p className="text-xs text-[#292820]/75 mt-1 leading-relaxed">
                You retain complete sovereign ownership of your data. Clear consultation histories, remove card drafts, or purge your account at any moment from your Sanctuary Dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Check */}
        <div className="mt-6 pt-4 border-t border-[#292820]/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Audited for Phase 1 Deployment</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider hover:bg-[#292820] transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { X, Sparkles, Download, Printer, Copy, Check, RefreshCw, PenLine, Shield, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface FramedGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftName: string;
  giftPrice?: number;
  giftCategory?: string;
  initialRecipientName?: string;
  initialEmotion?: string;
  onAttachToGift?: (cardData: {
    recipientName: string;
    message: string;
    senderName: string;
    frameStyle: string;
    sealColor: string;
  }) => void;
}

type FrameStyle = 'gold-foil' | 'atelier-tomato' | 'midnight-obsidian' | 'botanical-sage';
type SealColor = 'tomato' | 'gold' | 'sage' | 'obsidian';

export const FramedGiftCardModal: React.FC<FramedGiftCardModalProps> = ({
  isOpen,
  onClose,
  giftName,
  giftCategory,
  initialRecipientName = 'Eleanor',
  initialEmotion = 'romance',
  onAttachToGift
}) => {
  const { user, saveSession } = useAuth();
  const cardPreviewRef = useRef<HTMLDivElement>(null);

  const [recipient, setRecipient] = useState(initialRecipientName || 'Eleanor');
  const [sender, setSender] = useState(user?.name || 'With all my heart, Dev');
  const [selectedEmotion, setSelectedEmotion] = useState<string>(initialEmotion || 'romance');
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('gold-foil');
  const [sealColor, setSealColor] = useState<SealColor>('tomato');
  const [dateStr] = useState<string>(
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  );

  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [variationIndex, setVariationIndex] = useState(0);

  // Synchronize initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialRecipientName) setRecipient(initialRecipientName);
      if (initialEmotion) setSelectedEmotion(initialEmotion);
    }
  }, [isOpen, initialRecipientName, initialEmotion]);

  // AI-generated message database tailored to gift & emotion archetypes
  const emotionPresets: Record<string, string[]> = {
    romance: [
      `For the quiet mornings, the honest laughter, and every thoughtful moment you bring into my world. Like this ${giftName}, chosen just for you, may this year hold as much grace and wonder as you give away each day.`,
      `On the night the universe quietly shifted to introduce you into my life, everything became luminous. This ${giftName} carries a small echo of my devotion: steadfast, patient, and endlessly grateful for you.`,
      `Some people make love feel like an arrival—a coming home. With this ${giftName}, I celebrate every shared breath, every secret smile, and the beautiful journey we are crafting together.`
    ],
    gratitude: [
      `Some people make the world feel larger, warmer, and kinder simply by being in it. You are one of them. Thank you for your unwavering grace and for being my steady anchor through every season.`,
      `In a world that moves too fast, your kindness is a rare sanctuary. This ${giftName} is a quiet token of my deepest respect and heartfelt thanks for everything you do so selflessly.`,
      `Words rarely capture the depth of real gratitude. May this ${giftName} remind you every day that your patience, wisdom, and warm spirit are treasured beyond measure.`
    ],
    celebration: [
      `Another chapter conquered, another milestone illuminated! Here is to laughing through every twist, celebrating your tireless brilliance, and welcoming the extraordinary adventures still ahead.`,
      `May this celebration mark not just what you have achieved, but the incredible soul you continue to become. Unbox this ${giftName} with pure joy—you deserve every ounce of celebration!`,
      `To breakthroughs, boundless horizons, and the joy of seeing your dreams take flight! Toasting to your triumph today with all my pride and celebration.`
    ],
    comfort: [
      `A gentle reminder that you are loved beyond words. In the quiet moments between breaths, may this ${giftName} bring you restorative peace, softness, and the comforting warmth of home.`,
      `May your days ahead feel lighter, your evenings calmer, and your heart cradled in stillness. Take all the time you need—you are held in deep, abiding care.`,
      `Sending you a sanctuary of warmth and tranquility. Whenever you look upon this ${giftName}, remember that someone is wishing you comfort and peace from afar.`
    ],
    poetic: [
      `Like golden amber holding sunlight from season to season, may your days be sweet, slow, and luminous. May this keepsake linger in your life as a timeless testament to beauty.`,
      `Where the horizon meets the morning tide, beauty takes its gentle root. May this ${giftName} whisper memories of light and grace whenever your eyes rest upon it.`,
      `Crafted not merely of material, but of sentiment and silence. May its presence in your space bring harmony, timeless delight, and enduring inspiration.`
    ],
    playful: [
      `Another year wiser, yet somehow still laughing at the exact same terrible inside jokes! May this ${giftName} bring a massive smile to your face today.`,
      `Consider this official proof that I actually listen to the hints you drop! Enjoy your new ${giftName}—you truly deserve the best (and yes, I take full credit)!`,
      `Guaranteed 100% emotional satisfaction and zero awkward re-gifting! Wishing you endless laughs and unforgettable memories with this gift.`
    ]
  };

  const currentVariations = emotionPresets[selectedEmotion] || emotionPresets.romance;
  const [customMessage, setCustomMessage] = useState(currentVariations[0]);

  // Update message when emotion or variation index changes
  const handleRegenerate = () => {
    const nextIdx = (variationIndex + 1) % currentVariations.length;
    setVariationIndex(nextIdx);
    setCustomMessage(currentVariations[nextIdx]);
  };

  const handleSelectEmotion = (emotionKey: string) => {
    setSelectedEmotion(emotionKey);
    const vars = emotionPresets[emotionKey] || emotionPresets.romance;
    setVariationIndex(0);
    setCustomMessage(vars[0]);
  };

  // Export high-res PDF with framed borders, ornaments, custom message & seal
  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5' // Standard luxury gift card dimensions (148 x 210 mm)
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Background color
      if (frameStyle === 'midnight-obsidian') {
        doc.setFillColor(26, 24, 23);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
      } else if (frameStyle === 'botanical-sage') {
        doc.setFillColor(245, 248, 245);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
      } else {
        doc.setFillColor(250, 243, 228); // #faf3e4 warm cream
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
      }

      // Outer & Inner Borders
      let primaryColor = [212, 175, 55]; // Gold
      let textColor = [20, 17, 16]; // Dark

      if (frameStyle === 'atelier-tomato') {
        primaryColor = [239, 74, 35]; // Tomato
      } else if (frameStyle === 'midnight-obsidian') {
        primaryColor = [218, 165, 32]; // Golden amber
        textColor = [250, 243, 228];
      } else if (frameStyle === 'botanical-sage') {
        primaryColor = [90, 120, 99]; // Sage
      }

      // Outer Border
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(1.2);
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

      // Inner Inset Bevel
      doc.setLineWidth(0.4);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

      // Corner Ornaments
      const drawCorner = (x: number, y: number) => {
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.circle(x, y, 1, 'F');
      };
      drawCorner(15, 15);
      drawCorner(pageWidth - 15, 15);
      drawCorner(15, pageHeight - 15);
      drawCorner(pageWidth - 15, pageHeight - 15);

      // Top Monogram Header
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('times', 'italic');
      doc.setFontSize(28);
      doc.text('charis.', pageWidth / 2, 32, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('ATELIER SENTIMENT ARCHIVE • CERTIFIED PROVENANCE', pageWidth / 2, 38, { align: 'center' });

      // Subtle Divider
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.3);
      doc.line(35, 43, pageWidth - 35, 43);

      // Recipient Salutation
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('times', 'bold');
      doc.setFontSize(16);
      doc.text(`Dearest ${recipient},`, 24, 56);

      // Message Body
      doc.setFont('times', 'italic');
      doc.setFontSize(12.5);
      const splitLines = doc.splitTextToSize(customMessage, pageWidth - 48);
      doc.text(splitLines, 24, 68, { lineHeightFactor: 1.5 });

      // Selected Gift Mention
      const messageEndY = 68 + splitLines.length * 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`Keepsake Accompaniment: ${giftName}`, 24, messageEndY + 10);

      // Sign-off & Sender Signature
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('times', 'italic');
      doc.setFontSize(14);
      doc.text(sender, 24, messageEndY + 22);

      // Footer Date & Seal
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(dateStr, 24, pageHeight - 22);

      // Monogram Wax Seal Stamp on PDF
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.circle(pageWidth - 28, pageHeight - 26, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('times', 'bolditalic');
      doc.setFontSize(9);
      doc.text('C', pageWidth - 28, pageHeight - 23.5, { align: 'center' });

      // Save PDF
      doc.save(`charis-card-${recipient.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Browser Print View
  const handlePrint = () => {
    window.print();
  };

  // Copy message text
  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Dearest ${recipient},\n\n${customMessage}\n\n${sender}\n\nAccompanying: ${giftName} • ${dateStr}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Save card and consultation session info to user profile
  const handleSaveToProfile = () => {
    saveSession({
      recipientName: recipient,
      relationship: 'Recipient',
      occasion: 'Milestone',
      desiredEmotion: selectedEmotion,
      budgetFormatted: 'Custom Framed Card',
      interests: [giftCategory || 'Bespoke Keepsakes'],
      chosenGiftName: giftName
    });

    if (onAttachToGift) {
      onAttachToGift({
        recipientName: recipient,
        message: customMessage,
        senderName: sender,
        frameStyle,
        sealColor
      });
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#141110]/85 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#faf3e4] text-[#141110] rounded-3xl shadow-2xl border border-[#ef4a23]/30 my-4 flex flex-col lg:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          aria-label="Close card modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-[#ef4a23] hover:text-white text-[#141110] flex items-center justify-center shadow-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Controls, AI Calibrator & Editor */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-[#141110]/10 overflow-y-auto">
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141110]/5 text-[10px] font-archivo uppercase tracking-widest text-[#ef4a23] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Sentiment Stationery Studio</span>
            </div>
            <h2
              className="font-archivo uppercase text-2xl sm:text-3xl font-bold tracking-tight text-[#141110] leading-none"
              style={{ fontStretch: '72%' }}
            >
              FRAMED GIFT CARD <span className="font-playfair italic lowercase text-[#ef4a23]">studio.</span>
            </h2>
            <p className="font-playfair text-xs sm:text-sm text-[#141110]/75 leading-relaxed italic">
              Accompaniment for: <strong className="text-[#141110] not-italic font-bold">{giftName}</strong>
            </p>
          </div>

          {/* Emotion Archetype Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80">
                1. Emotional Tone Calibrator
              </label>
              <button
                type="button"
                onClick={handleRegenerate}
                className="text-[11px] font-archivo uppercase tracking-wider font-bold text-[#ef4a23] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Next AI Variation</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'romance', label: 'Devoted Romance', emoji: '🌹' },
                { id: 'gratitude', label: 'Deep Gratitude', emoji: '💫' },
                { id: 'celebration', label: 'Celebration', emoji: '🥂' },
                { id: 'comfort', label: 'Quiet Solace', emoji: '🌿' },
                { id: 'poetic', label: 'Poetic Devotion', emoji: '✨' },
                { id: 'playful', label: 'Warm & Playful', emoji: '😄' }
              ].map((em) => (
                <button
                  key={em.id}
                  type="button"
                  onClick={() => handleSelectEmotion(em.id)}
                  className={`p-2 rounded-xl text-left text-xs font-archivo uppercase font-bold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedEmotion === em.id
                      ? 'bg-[#141110] text-[#faf3e4] shadow-sm scale-[1.02]'
                      : 'bg-white hover:bg-white/80 border border-[#141110]/10 text-[#141110]/80'
                  }`}
                >
                  <span>{em.emoji}</span>
                  <span className="truncate">{em.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient & Sign-off Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Eleanor"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#141110]/15 text-sm font-archivo focus:outline-none focus:border-[#ef4a23]"
              />
            </div>
            <div>
              <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 mb-1">
                Sign-off / Your Name
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="With all my heart, Dev"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#141110]/15 text-sm font-archivo focus:outline-none focus:border-[#ef4a23]"
              />
            </div>
          </div>

          {/* Editable AI Message Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 flex items-center gap-1.5">
                <PenLine className="w-3.5 h-3.5 text-[#ef4a23]" />
                <span>2. Calibrated Sentiment Prose (Freely Editable)</span>
              </label>
              <span className="text-[10px] font-mono text-[#141110]/50">
                {customMessage.length} characters
              </span>
            </div>
            <textarea
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full p-4 bg-white rounded-xl border border-[#141110]/15 text-sm font-playfair italic leading-relaxed text-[#141110] focus:outline-none focus:border-[#ef4a23] shadow-inner"
            />
          </div>

          {/* Frame Style & Wax Seal Selectors */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 mb-1.5">
                Frame Aesthetic
              </label>
              <select
                value={frameStyle}
                onChange={(e: any) => setFrameStyle(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#141110]/15 text-xs font-archivo uppercase tracking-wider font-bold text-[#141110] cursor-pointer"
              >
                <option value="gold-foil">✨ Gold Foil Embossed</option>
                <option value="atelier-tomato">🔥 CHARIS Atelier Terracotta</option>
                <option value="midnight-obsidian">🌙 Midnight Obsidian & Gold</option>
                <option value="botanical-sage">🌿 Botanical Sage & Deckle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 mb-1.5">
                Wax Seal Stamp
              </label>
              <div className="flex items-center gap-2 pt-1">
                {[
                  { id: 'tomato', color: '#ef4a23', label: 'Crimson' },
                  { id: 'gold', color: '#d4af37', label: 'Gold' },
                  { id: 'sage', color: '#5a7863', label: 'Sage' },
                  { id: 'obsidian', color: '#1a1817', label: 'Obsidian' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSealColor(s.id as SealColor)}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative shadow-xs ${
                      sealColor === s.id ? 'scale-125 ring-2 ring-[#141110]' : 'hover:scale-110 opacity-80'
                    }`}
                    style={{ backgroundColor: s.color }}
                    title={s.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#141110]/10 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white text-xs font-archivo uppercase tracking-wider font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF Card'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-full border border-[#141110]/20 hover:bg-white text-xs font-archivo uppercase tracking-wider text-[#141110] font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Print Framed Stationery Card"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2.5 rounded-full border border-[#141110]/20 hover:bg-white text-xs font-archivo uppercase tracking-wider text-[#141110] font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToProfile}
              className="px-3.5 py-2.5 rounded-full bg-[#141110] hover:bg-[#ef4a23] text-white text-xs font-archivo uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#ffd46e]" />
              <span>{isSaved ? 'Saved to Sanctuary!' : 'Attach & Save'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Framed Card Preview ("keep a nice frame for it") */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col items-center justify-center bg-[#faf3e4]/60">
          <div className="text-center mb-4">
            <span className="text-[10px] font-archivo uppercase tracking-widest text-[#141110]/60 font-bold">
              Live Stationery Framing Preview
            </span>
          </div>

          {/* Bespoke Physical-Style Framed Card */}
          <div
            ref={cardPreviewRef}
            className={`w-full max-w-sm rounded-xl p-6 sm:p-8 transition-all duration-300 relative select-none shadow-[0_20px_60px_rgba(20,17,16,0.18)] ${
              frameStyle === 'midnight-obsidian'
                ? 'bg-[#1a1817] text-[#faf3e4]'
                : frameStyle === 'botanical-sage'
                ? 'bg-[#f4f7f4] text-[#1e2a22]'
                : frameStyle === 'atelier-tomato'
                ? 'bg-[#fcf8f0] text-[#141110]'
                : 'bg-[#faf3e4] text-[#141110]'
            }`}
            style={{
              minHeight: '440px',
              border:
                frameStyle === 'gold-foil'
                  ? '3px double #d4af37'
                  : frameStyle === 'atelier-tomato'
                  ? '3px double #ef4a23'
                  : frameStyle === 'midnight-obsidian'
                  ? '2px solid #d4af37'
                  : '2px dashed #8fa89b'
            }}
          >
            {/* Inner Inset Decorative Border */}
            <div
              className="absolute inset-3 rounded-lg pointer-events-none"
              style={{
                border:
                  frameStyle === 'gold-foil'
                    ? '1px solid rgba(212, 175, 55, 0.4)'
                    : frameStyle === 'atelier-tomato'
                    ? '1px solid rgba(239, 74, 35, 0.3)'
                    : frameStyle === 'midnight-obsidian'
                    ? '1px solid rgba(212, 175, 55, 0.25)'
                    : '1px solid rgba(143, 168, 155, 0.4)'
              }}
            />

            {/* Corner Ornaments */}
            <div className="absolute top-2 left-2 text-[10px] leading-none opacity-60">✦</div>
            <div className="absolute top-2 right-2 text-[10px] leading-none opacity-60">✦</div>
            <div className="absolute bottom-2 left-2 text-[10px] leading-none opacity-60">✦</div>
            <div className="absolute bottom-2 right-2 text-[10px] leading-none opacity-60">✦</div>

            {/* Card Content Container */}
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              {/* Header Monogram & Subtitle */}
              <div className="text-center space-y-1">
                <span className="font-yellowtail text-2xl sm:text-3xl text-[#ef4a23] inline-block -rotate-6">
                  charis.
                </span>
                <p className="font-archivo text-[9px] uppercase tracking-widest opacity-60">
                  ATELIER ARCHIVE • BESPOKE STATIONERY
                </p>
                <div
                  className="w-16 h-px mx-auto mt-2"
                  style={{
                    backgroundColor:
                      frameStyle === 'atelier-tomato'
                        ? '#ef4a23'
                        : frameStyle === 'midnight-obsidian'
                        ? '#d4af37'
                        : '#d4af37'
                  }}
                />
              </div>

              {/* Salutation & Calibrated Prose */}
              <div className="space-y-3">
                <h3 className="font-playfair font-bold text-lg text-inherit">
                  Dearest {recipient || 'Someone Special'},
                </h3>
                <p className="font-playfair text-xs sm:text-sm leading-relaxed italic opacity-90">
                  "{customMessage}"
                </p>
              </div>

              {/* Accompanying Keepsake & Sign-off */}
              <div className="pt-3 border-t border-current/15 space-y-2">
                <div className="text-[10px] font-mono opacity-70">
                  <span>Keepsake: <strong>{giftName}</strong></span>
                </div>
                <div className="font-playfair italic text-sm font-semibold text-inherit">
                  {sender}
                </div>
              </div>

              {/* Card Footer: Date & Embossed Wax Seal */}
              <div className="flex items-end justify-between pt-2">
                <span className="text-[10px] font-mono opacity-50">
                  {dateStr}
                </span>

                {/* 3D Wax Seal Badge */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-yellowtail text-base shadow-[0_4px_12px_rgba(0,0,0,0.25)] relative"
                  style={{
                    backgroundColor:
                      sealColor === 'tomato'
                        ? '#ef4a23'
                        : sealColor === 'gold'
                        ? '#d4af37'
                        : sealColor === 'sage'
                        ? '#5a7863'
                        : '#1a1817',
                    border: '2px solid rgba(255,255,255,0.3)',
                    transform: 'rotate(-5deg)'
                  }}
                  title="Official CHARIS Wax Seal"
                >
                  <span className="drop-shadow-xs">c.</span>
                  <div className="absolute inset-0 rounded-full border border-black/20 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Subtitle */}
          <div className="flex items-center gap-2 mt-4 text-[11px] font-mono text-[#141110]/60">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>High-Res Export ready for printable 5×7 luxury cardstock</span>
          </div>
        </div>
      </div>
    </div>
  );
};

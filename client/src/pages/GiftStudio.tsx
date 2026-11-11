import React, { useState } from 'react';
import { CARD_TEMPLATES } from '../data/mockData';
import type { GiftCardState, CardTemplate } from '../types';
import { Sparkles, Download, Copy, Check, RefreshCw } from 'lucide-react';

export const GiftStudio: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(CARD_TEMPLATES[0]);
  const [cardState, setCardState] = useState<GiftCardState>({
    recipientName: 'Eleanor',
    senderName: 'Julian',
    occasion: 'Birthday',
    templateId: CARD_TEMPLATES[0].id,
    tone: 'heartfelt',
    fontSize: 'md',
    alignment: 'center',
    message: 'For the quiet mornings, the honest laughter, and every thoughtful moment you bring into my world. May this year hold as much grace as you give away.'
  });

  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const sampleMessages: Record<string, string[]> = {
    heartfelt: [
      'For the quiet mornings, the honest laughter, and every thoughtful moment you bring into my world. May this year hold as much grace as you give away.',
      'Some friendships feel like coming home after a long journey. Thank you for your unwavering grace and presence in my life.'
    ],
    playful: [
      'Another year wiser, yet somehow still laughing at the exact same terrible jokes. Never change!',
      'Proof that wonderful things happen when the world gives us another year of your chaotic, brilliant energy.'
    ],
    romantic: [
      'Every day with you is my favourite gift. Thank you for filling ordinary hours with extraordinary love and tenderness.',
      'In a crowded world, you are my sanctuary. Today and every day, I choose you.'
    ],
    poetic: [
      'Like golden amber honey holding sunlight from spring to winter, may your days be sweet, slow, and luminous.',
      'A quiet candle in the dusk, a warm conversation across the table — here is to the beauty of simple presence.'
    ],
    formal: [
      'With sincere appreciation for your guidance, partnership, and steadfast dedication. Wishing you continuous joy and accomplishment.',
      'Sending warmest regards and heartfelt congratulations on this remarkable milestone.'
    ],
    short: [
      'With all my love, always and across every season.',
      'Thinking of you warmly today. Enjoy every moment.'
    ]
  };

  const handleToneChange = (tone: any) => {
    setCardState(prev => ({
      ...prev,
      tone,
      message: sampleMessages[tone]?.[0] || prev.message
    }));
  };

  const generateAIMessage = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const options = sampleMessages[cardState.tone] || sampleMessages.heartfelt;
      const nextMsg = options[Math.floor(Math.random() * options.length)];
      setCardState(prev => ({ ...prev, message: nextMsg }));
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cardState.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF9F6] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-[#292820]/10 pb-8 mb-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CHARIS Create Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#292820] mt-1">
            AI Gift Card Studio
          </h1>
          <p className="text-sm sm:text-base text-[#292820]/75 mt-2 max-w-2xl leading-relaxed">
            Craft an authentic message in seconds, style your stationery, and preview the tactile card that accompanies your gift.
          </p>
        </div>

        {/* Studio Workspace: Split Controls & Live Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Controls & AI Message Generator (5 cols) */}
          <div className="lg:col-span-5 space-y-8 bg-white p-6 sm:p-8 rounded-xl border border-[#292820]/10 shadow-sm">
            
            {/* Step 1: Template Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold mb-3">
                1. Select Card Template
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CARD_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl)}
                    className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                      selectedTemplate.id === tmpl.id
                        ? 'border-[#292820] bg-[#FAF9F6] ring-1 ring-[#292820]'
                        : 'border-[#292820]/15 hover:border-[#292820]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{tmpl.stampIcon}</span>
                      {selectedTemplate.id === tmpl.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359]" />
                      )}
                    </div>
                    <p className="font-serif text-xs font-bold text-[#292820] mt-1.5 line-clamp-1">
                      {tmpl.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Names & Occasion */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#292820]/70 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={cardState.recipientName}
                  onChange={(e) => setCardState(prev => ({ ...prev, recipientName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md bg-[#FAF9F6] border border-[#292820]/15 text-xs text-[#292820] focus:outline-none focus:border-[#B69A78]"
                  placeholder="Eleanor"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#292820]/70 mb-1">
                  Sender Signature
                </label>
                <input
                  type="text"
                  value={cardState.senderName}
                  onChange={(e) => setCardState(prev => ({ ...prev, senderName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md bg-[#FAF9F6] border border-[#292820]/15 text-xs text-[#292820] focus:outline-none focus:border-[#B69A78]"
                  placeholder="Julian"
                />
              </div>
            </div>

            {/* Step 3: Emotional Tone Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  2. Dial Emotional Tone
                </label>
                <button
                  onClick={generateAIMessage}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-[#D4A359] hover:text-[#292820] font-bold cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>AI Regenerate</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['heartfelt', 'playful', 'romantic', 'poetic', 'formal', 'short'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleToneChange(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono capitalize transition-all cursor-pointer ${
                      cardState.tone === t
                        ? 'bg-[#151419] text-[#FAF9F6]'
                        : 'bg-[#EDE5DA]/50 text-[#292820]/75 hover:bg-[#EDE5DA]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Editable Message Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#292820]/70">
                  Card Message (Editable)
                </label>
                <span className="text-[10px] text-stone-400 font-mono">
                  {cardState.message.length} characters
                </span>
              </div>
              <textarea
                rows={4}
                value={cardState.message}
                onChange={(e) => setCardState(prev => ({ ...prev, message: e.target.value }))}
                className="w-full p-3 rounded-md bg-[#FAF9F6] border border-[#292820]/15 text-xs text-[#292820] focus:outline-none focus:border-[#B69A78] leading-relaxed resize-none"
              />
            </div>

            {/* Typography & Alignment Controls */}
            <div className="pt-2 border-t border-[#292820]/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-stone-500 text-[11px]">Align:</span>
                {(['left', 'center', 'right'] as const).map(align => (
                  <button
                    key={align}
                    onClick={() => setCardState(prev => ({ ...prev, alignment: align }))}
                    className={`px-2 py-1 rounded-sm text-xs font-mono uppercase ${
                      cardState.alignment === align
                        ? 'bg-[#151419] text-white'
                        : 'bg-[#EDE5DA]/50 text-stone-700'
                    }`}
                  >
                    {align[0]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-stone-500 text-[11px]">Size:</span>
                {(['sm', 'md', 'lg'] as const).map(sz => (
                  <button
                    key={sz}
                    onClick={() => setCardState(prev => ({ ...prev, fontSize: sz }))}
                    className={`px-2 py-1 rounded-sm text-xs font-mono uppercase ${
                      cardState.fontSize === sz
                        ? 'bg-[#151419] text-white'
                        : 'bg-[#EDE5DA]/50 text-stone-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Card Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Live Card Surface */}
            <div
              id="gift-card-canvas"
              className={`w-full max-w-xl aspect-[1.4/1] rounded-2xl p-8 sm:p-12 shadow-2xl relative flex flex-col justify-between transition-all duration-300 border-2 ${selectedTemplate.bgClass}`}
              style={{
                borderColor: selectedTemplate.borderColor
              }}
            >
              {/* Corner Stamp Accents */}
              <div className="flex items-center justify-between border-b border-current/15 pb-4">
                <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold opacity-75">
                  CHARIS Bespoke Letterpress
                </span>
                <span className="text-xl">{selectedTemplate.stampIcon}</span>
              </div>

              {/* Message Body */}
              <div
                className={`my-auto py-6 ${
                  cardState.alignment === 'center'
                    ? 'text-center'
                    : cardState.alignment === 'right'
                    ? 'text-right'
                    : 'text-left'
                }`}
              >
                {cardState.recipientName && (
                  <p className="font-serif text-sm tracking-wider uppercase opacity-70 mb-3">
                    Dear {cardState.recipientName},
                  </p>
                )}

                <p
                  className={`leading-relaxed ${
                    selectedTemplate.fontFamily === 'serif'
                      ? 'font-serif'
                      : selectedTemplate.fontFamily === 'handwriting'
                      ? 'font-handwriting text-2xl sm:text-3xl font-bold'
                      : 'font-sans'
                  } ${
                    cardState.fontSize === 'sm'
                      ? 'text-sm'
                      : cardState.fontSize === 'lg'
                      ? 'text-lg sm:text-xl'
                      : 'text-base sm:text-lg'
                  }`}
                >
                  "{cardState.message}"
                </p>

                {cardState.senderName && (
                  <p className="font-handwriting text-2xl sm:text-3xl font-bold mt-4 opacity-90">
                    With love, {cardState.senderName}
                  </p>
                )}
              </div>

              {/* Card Footer Stamp */}
              <div className="pt-4 border-t border-current/15 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest opacity-60">
                <span>Hand-Lettered by CHARIS</span>
                <span>Bengaluru Studio • Edition 2026</span>
              </div>
            </div>

            {/* Canvas Actions Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider shadow-brutal hover:bg-[#292820] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#D4A359]" />
                <span>Export High-Res Card</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white border border-[#292820]/15 text-[#292820] text-xs font-mono uppercase tracking-wider hover:bg-[#EDE5DA] transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Message'}</span>
              </button>
            </div>

            <p className="text-[11px] font-mono text-[#292820]/60 mt-4 text-center">
              Your customized card will be printed on 300gsm textured cotton cardstock and placed inside the gift box.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

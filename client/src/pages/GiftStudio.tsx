import React, { useState, useMemo } from 'react';
import { Sparkles, Search, SlidersHorizontal, ShoppingBag, Check, Heart, ExternalLink, PenTool } from 'lucide-react';
import { ALL_100_CURATED_GIFTS, type CuratedGiftItem } from '../data/curatedGifts100';
import { useBag } from '../context/BagContext';
import { useWishlist } from '../context/WishlistContext';

export const GiftStudio: React.FC = () => {
  const { addToBag, setIsBagOpen } = useBag();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [activeTab, setActiveTab] = useState<'collection' | 'card-writer'>('collection');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceSort, setPriceSort] = useState<'default' | 'low-high' | 'high-low'>('default');
  const [selectedGiftDetail, setSelectedGiftDetail] = useState<CuratedGiftItem | null>(null);
  const [addedItemIds, setAddedItemIds] = useState<number[]>([]);

  // AI Card writer state
  const [cardTone, setCardTone] = useState<'heartfelt' | 'poetic' | 'playful' | 'deep'>('heartfelt');
  const [recipientName, setRecipientName] = useState('Eleanor');
  const [customMessage, setCustomMessage] = useState(
    'For the quiet mornings, the honest laughter, and every thoughtful moment you bring into my world. May this year hold as much grace as you give away.'
  );

  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(ALL_100_CURATED_GIFTS.map(g => g.category)))];
    return cats;
  }, []);

  const filteredGifts = useMemo(() => {
    let result = [...ALL_100_CURATED_GIFTS];

    if (selectedCategory !== 'All') {
      result = result.filter(g => g.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        g =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.sentiment.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.tag.toLowerCase().includes(q)
      );
    }

    if (priceSort === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, searchQuery, priceSort]);

  const handleAddToBag = (gift: CuratedGiftItem) => {
    addToBag({
      id: `gift-${gift.id}`,
      name: gift.name,
      slug: `gift-${gift.id}`,
      tagline: gift.tag,
      description: gift.description,
      categoryId: gift.category.toLowerCase().replace(/\s+/g, '-'),
      categoryName: gift.category,
      price: gift.price,
      originalPrice: gift.price,
      currency: 'INR',
      imageUrl: gift.image,
      retailer: {
        id: 'charis-atelier',
        name: 'CHARIS Master Atelier',
        website: 'https://charis.atelier',
        verified: true
      },
      productUrl: '#',
      tags: [gift.tag, gift.sentiment],
      interests: [gift.category],
      occasions: ['anniversary', 'birthday', 'just_because'],
      relationships: ['partner', 'friend', 'family'],
      personalities: ['refined', 'discerning'],
      source: 'internal',
      availability: 'in_stock',
      lastVerifiedAt: '2026-11-12',
      rating: gift.rating,
      reviewCount: 48,
      badge: gift.tag,
      serialNumber: String(gift.id).padStart(2, '0')
    });

    setAddedItemIds(prev => [...prev, gift.id]);
    setTimeout(() => {
      setAddedItemIds(prev => prev.filter(id => id !== gift.id));
    }, 1800);
  };

  const sampleCardMessages = {
    heartfelt: 'For the quiet mornings, the honest laughter, and every thoughtful moment you bring into my world.',
    poetic: 'Like golden amber holding sunlight from season to season, may your days be sweet, slow, and luminous.',
    playful: 'Another year wiser, yet somehow still laughing at the exact same terrible inside jokes!',
    deep: 'Some people make the world feel larger, warmer, and kinder simply by being in it. You are one of them.'
  };

  return (
    <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[7rem] pb-[5rem] px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Studio Header (Continuous Landing Page Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#141110]/10 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-archivo uppercase tracking-widest text-[#ef4a23] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>CHARIS Studio Collective</span>
            </div>
            <h1
              className="font-archivo uppercase text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#141110] leading-none select-none"
              style={{ fontStretch: '72%' }}
            >
              100 CURATED <span className="font-playfair italic font-normal text-[#ef4a23] lowercase">sentiments.</span>
            </h1>
            <p className="font-playfair text-lg sm:text-xl text-[#141110]/75 max-w-2xl leading-relaxed italic">
              From bespoke star maps and hand-engraved titanium to Tuscan leather and ambient heirlooms. Filtered for emotional resonance.
            </p>
          </div>

          {/* Mode Switcher Pill */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-white border border-[#141110]/10 shadow-sm shrink-0">
            <button
              onClick={() => setActiveTab('collection')}
              className={`px-5 py-2 rounded-full font-archivo uppercase text-xs tracking-wider font-bold transition-all ${
                activeTab === 'collection'
                  ? 'bg-[#141110] text-[#faf3e4]'
                  : 'text-[#141110]/70 hover:text-[#141110]'
              }`}
            >
              100 Gifts ({filteredGifts.length})
            </button>
            <button
              onClick={() => setActiveTab('card-writer')}
              className={`px-5 py-2 rounded-full font-archivo uppercase text-xs tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'card-writer'
                  ? 'bg-[#ef4a23] text-white'
                  : 'text-[#141110]/70 hover:text-[#141110]'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Card Studio</span>
            </button>
          </div>
        </div>

        {activeTab === 'collection' ? (
          <>
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141110]/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, sentiment, material (e.g. leather, brass, star map)..."
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-full border border-[#141110]/15 text-sm font-sans placeholder:text-[#141110]/40 focus:outline-none focus:border-[#ef4a23] shadow-xs"
                />
              </div>

              {/* Price Sort & Count */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-[#141110]/15 text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#ef4a23]" />
                  <span>Sort:</span>
                  <select
                    value={priceSort}
                    onChange={(e: any) => setPriceSort(e.target.value)}
                    className="bg-transparent focus:outline-none text-[#141110] font-semibold cursor-pointer"
                  >
                    <option value="default">Featured Order</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-archivo uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#ef4a23] text-white shadow-sm'
                        : 'bg-white/80 hover:bg-white text-[#141110]/80 border border-[#141110]/10'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Gifts Grid (Continuous High Aesthetic) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
              {filteredGifts.map((gift) => {
                const isAdded = addedItemIds.includes(gift.id);
                const wishlisted = isWishlisted(String(gift.id));

                return (
                  <div
                    key={gift.id}
                    className="group bg-white rounded-2xl border border-[#141110]/10 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e9dcc6]">
                      <img
                        src={gift.image}
                        alt={gift.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Tag Badge */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#141110]/80 backdrop-blur-xs text-[#faf3e4] text-[10px] font-archivo uppercase tracking-wider font-bold">
                        {gift.tag}
                      </span>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(String(gift.id))}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#141110] flex items-center justify-center hover:bg-[#ef4a23] hover:text-white transition-colors cursor-pointer shadow-xs"
                      >
                        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#ef4a23] text-[#ef4a23]' : ''}`} />
                      </button>

                      {/* Sentiment Overlay Ribbon */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#141110]/70 to-transparent p-3 pt-6 flex items-end justify-between">
                        <span className="text-[11px] font-playfair italic text-[#faf3e4]">
                          "{gift.sentiment}"
                        </span>
                        <span className="text-[11px] font-mono text-[#ffd46e] font-bold">
                          ★ {gift.rating}
                        </span>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#141110]/60 uppercase tracking-widest">
                          <span>#{String(gift.id).padStart(3, '0')}</span>
                          <span>{gift.category}</span>
                        </div>
                        <h3 className="font-archivo uppercase text-base font-bold text-[#141110] leading-snug tracking-tight group-hover:text-[#ef4a23] transition-colors">
                          {gift.name}
                        </h3>
                        <p className="text-xs font-playfair text-[#141110]/75 line-clamp-2 leading-relaxed">
                          {gift.description}
                        </p>
                      </div>

                      {/* Price & Action Row */}
                      <div className="pt-3 border-t border-[#141110]/10 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-xs text-[#141110]/50 block leading-none">Curated Price</span>
                          <span className="font-archivo text-lg font-bold text-[#141110]">
                            ₹{gift.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedGiftDetail(gift)}
                            className="p-2 rounded-full border border-[#141110]/15 hover:bg-[#141110]/5 text-[#141110] transition-colors cursor-pointer"
                            title="View Full Provenance"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleAddToBag(gift)}
                            className={`px-3.5 py-2 rounded-full font-archivo uppercase text-[11px] tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#141110] hover:bg-[#ef4a23] text-[#faf3e4]'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>In Bag</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Bag</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* CARD WRITER ATELIER TAB */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#141110]/10 shadow-sm space-y-6">
              <div>
                <h3 className="font-archivo uppercase text-xl font-bold tracking-tight text-[#141110]">
                  Handwritten Card Studio
                </h3>
                <p className="font-playfair text-sm text-[#141110]/70 mt-1">
                  Craft an authentic note to be calligraphed and wax-sealed inside your gift presentation.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#141110]/15 text-sm font-sans focus:outline-none focus:border-[#ef4a23]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 mb-1">
                    Sentiment Tone
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['heartfelt', 'poetic', 'playful', 'deep'] as const).map((tone) => (
                      <button
                        key={tone}
                        onClick={() => {
                          setCardTone(tone);
                          setCustomMessage(sampleCardMessages[tone]);
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-archivo uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                          cardTone === tone
                            ? 'bg-[#ef4a23] text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-[#141110]'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 mb-1">
                    Your Personal Message
                  </label>
                  <textarea
                    rows={5}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full p-4 rounded-xl border border-[#141110]/15 text-sm font-playfair focus:outline-none focus:border-[#ef4a23]"
                  />
                </div>
              </div>
            </div>

            {/* Live Stationery Preview */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full max-w-lg aspect-[1.4] bg-[#faf6ed] rounded-xl p-8 sm:p-12 shadow-xl border-4 border-[#e5d8be] relative flex flex-col justify-between">
                <div className="flex justify-between items-start border-b border-[#141110]/10 pb-4">
                  <span className="font-yellowtail text-2xl text-[#ef4a23]">charis.</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#141110]/40">
                    Hand-Pressed Archival Cotton
                  </span>
                </div>

                <div className="space-y-3 py-4 text-center">
                  <h4 className="font-playfair text-xl italic text-[#141110]/90">
                    Dearest {recipientName},
                  </h4>
                  <p className="font-playfair text-base sm:text-lg text-[#141110] leading-relaxed max-w-md mx-auto italic">
                    "{customMessage}"
                  </p>
                </div>

                <div className="flex justify-between items-end border-t border-[#141110]/10 pt-4 text-xs font-mono text-[#141110]/50">
                  <span>With deep devotion,</span>
                  <div className="w-8 h-8 rounded-full bg-[#ef4a23] text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                    SEAL
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Details Modal for Gift */}
        {selectedGiftDetail && (
          <div
            className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#141110]/80 backdrop-blur-sm"
            onClick={() => setSelectedGiftDetail(null)}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#faf3e4] rounded-2xl p-5 sm:p-8 border border-[#ef4a23]/30 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#ef4a23] font-bold">
                    #{String(selectedGiftDetail.id).padStart(3, '0')} • {selectedGiftDetail.category}
                  </span>
                  <h2 className="font-archivo uppercase text-2xl sm:text-3xl font-bold text-[#141110] mt-1">
                    {selectedGiftDetail.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedGiftDetail(null)}
                  className="w-8 h-8 rounded-full bg-stone-200 text-[#141110] flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/5">
                <img
                  src={selectedGiftDetail.image}
                  alt={selectedGiftDetail.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <h4 className="font-archivo uppercase text-xs tracking-wider text-[#141110]/70 font-bold">
                  Curator's Intent & Provenance:
                </h4>
                <p className="font-playfair text-base sm:text-lg text-[#141110] leading-relaxed">
                  {selectedGiftDetail.description}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-[#141110]/60 pt-2 border-t border-[#141110]/10">
                  <span>Sentiment: <strong className="text-[#ef4a23]">{selectedGiftDetail.sentiment}</strong></span>
                  <span>Artisan Seal: <strong>{selectedGiftDetail.tag}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#141110]/10">
                <div className="font-archivo text-2xl font-bold text-[#141110]">
                  ₹{selectedGiftDetail.price.toLocaleString('en-IN')}
                </div>
                <button
                  onClick={() => {
                    handleAddToBag(selectedGiftDetail);
                    setSelectedGiftDetail(null);
                    setIsBagOpen(true);
                  }}
                  className="px-6 py-3 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white font-archivo uppercase text-xs tracking-widest font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag & View</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GiftStudio;

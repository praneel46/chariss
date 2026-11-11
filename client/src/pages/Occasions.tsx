import React, { useState } from 'react';
import { OCCASIONS_DATA, CURATED_PRODUCTS } from '../data/mockData';
import { Sparkles, Heart, Plus, Check } from 'lucide-react';
import { useBag } from '../context/BagContext';
import { useWishlist } from '../context/WishlistContext';

export const Occasions: React.FC = () => {
  const [selectedOccasion, setSelectedOccasion] = useState<string>(OCCASIONS_DATA[0].slug);
  const { addToBag } = useBag();
  const { wishlist, toggleWishlist } = useWishlist();
  const [addedId, setAddedId] = useState<string | null>(null);

  const currentOccasion = OCCASIONS_DATA.find(o => o.slug === selectedOccasion) || OCCASIONS_DATA[0];

  const occasionProducts = CURATED_PRODUCTS.filter(p =>
    p.occasions.includes(selectedOccasion) || selectedOccasion === 'birthday'
  );

  const handleAdd = (product: any) => {
    addToBag(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="bg-[#FAF9F6] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-[#292820]/10 pb-8 mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Celebrations</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#292820] mt-1">
            Gifting by Occasion
          </h1>
          <p className="text-sm sm:text-base text-[#292820]/75 mt-2 max-w-2xl leading-relaxed">
            Every occasion carries its own nuance. Discover items designed to honor the exact feeling of the celebration.
          </p>
        </div>

        {/* Occasion Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {OCCASIONS_DATA.map((occ) => (
            <button
              key={occ.id}
              onClick={() => setSelectedOccasion(occ.slug)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedOccasion === occ.slug
                  ? 'bg-[#151419] text-[#FAF9F6] shadow-xs'
                  : 'bg-white border border-[#292820]/15 text-[#292820]/75 hover:bg-[#EDE5DA]'
              }`}
            >
              {occ.title}
            </button>
          ))}
        </div>

        {/* Occasion Banner Spotlight */}
        <div className="rounded-xl overflow-hidden border border-[#292820]/15 mb-16 bg-white grid grid-cols-1 md:grid-cols-12 shadow-sm">
          <div className="md:col-span-5 aspect-[4/3] md:aspect-auto overflow-hidden bg-[#EDE5DA]">
            <img
              src={currentOccasion.imageUrl}
              alt={currentOccasion.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                {currentOccasion.subtitle}
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#292820] mt-1">
                {currentOccasion.title}
              </h2>
              <p className="text-sm text-[#292820]/80 mt-3 leading-relaxed">
                {currentOccasion.description}
              </p>
            </div>

            <div className="pt-6 border-t border-[#292820]/10 mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500 mr-2">
                Popular Categories:
              </span>
              {currentOccasion.popularCategories.map((cat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-sm bg-[#EDE5DA]/60 text-[#292820] font-mono text-xs"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tailored Gifts for Occasion */}
        <div className="mb-6">
          <h3 className="font-serif text-2xl font-bold text-[#292820]">
            Recommended for {currentOccasion.title}
          </h3>
          <p className="text-xs text-[#292820]/60 mt-1">
            Curated from our verified artisan partners
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {occasionProducts.map((product) => {
            const isWish = wishlist.includes(product.id);
            const isAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-lg overflow-hidden border border-[#292820]/10 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="aspect-square relative overflow-hidden bg-[#EDE5DA]">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#292820] hover:text-red-600 transition-colors z-10"
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#B69A78] mb-1">
                      <span>{product.categoryName}</span>
                      <span>{product.serialNumber}</span>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#292820]">
                      {product.name}
                    </h4>
                    <p className="text-xs text-[#292820]/70 mt-1 line-clamp-1">
                      {product.tagline}
                    </p>
                    <p className="text-base font-bold text-[#292820] font-mono mt-3">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#292820]/10">
                    <button
                      onClick={() => handleAdd(product)}
                      className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-widest font-bold text-[#292820] hover:text-[#B69A78] py-1 transition-colors"
                    >
                      <span>{isAdded ? 'Added to Bag' : 'Add to Bag'}</span>
                      {isAdded ? <Check className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

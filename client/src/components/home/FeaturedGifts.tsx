import React, { useState } from 'react';
import { CURATED_PRODUCTS } from '../../data/mockData';
import { useBag } from '../../context/BagContext';
import { useWishlist } from '../../context/WishlistContext';
import { Plus, Check, Heart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';

export const FeaturedGifts: React.FC = () => {
  const { addToBag } = useBag();
  const { wishlist, toggleWishlist } = useWishlist();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToBag(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section className="py-24 bg-[#FAF9F6] border-b border-[#292820]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
              <span>04</span>
              <span>/</span>
              <span>Internal Catalogue Selection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#292820] mt-1">
              Featured Curated Gifts
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#292820]/60 font-mono">
              Showing 6 of 50+ Curated Products
            </span>
            <Link
              to="/discover"
              className="text-xs font-mono uppercase tracking-widest text-[#292820] hover:text-[#B69A78] font-bold border-b border-[#292820] hover:border-[#B69A78] pb-0.5 transition-colors"
            >
              View Full Catalogue ↗
            </Link>
          </div>
        </div>

        {/* 3-Column Catalogue Grid (Forensic match to video sec 04 & 06) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CURATED_PRODUCTS.slice(0, 6).map((product) => {
            const isWish = wishlist.includes(product.id);
            const isJustAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group bg-white rounded-lg overflow-hidden border border-[#292820]/10 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image Container with Hover Zoom & Floating Action */}
                <div className="aspect-square relative overflow-hidden bg-[#EDE5DA]">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Corner Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.badge && (
                      <span className="px-2.5 py-1 rounded-sm bg-[#D4A359] text-[#151419] font-mono text-[10px] font-bold tracking-wider">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    aria-label="Add to wishlist"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#292820] hover:text-red-600 transition-colors z-10 shadow-xs"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWish ? 'fill-red-500 text-red-500' : 'text-[#292820]'
                      }`}
                    />
                  </button>

                  {/* Bottom-right circle arrow on hover (Observed in reference video) */}
                  <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#292820] opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <ArrowUpRight className="w-4 h-4 text-[#292820]" />
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Serial Index Row (Observed in video) */}
                    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#B69A78] mb-1.5">
                      <span>{product.categoryName}</span>
                      <span className="text-stone-400 font-bold">{product.serialNumber}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#292820] group-hover:text-[#B69A78] transition-colors leading-snug">
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#292820]/70 mt-1 line-clamp-1">
                      {product.tagline}
                    </p>

                    {/* Price Row */}
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-base font-bold text-[#292820] font-mono">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through font-mono">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Bag Action Row (Observed divider with ADD TO BAG +) */}
                  <div className="mt-5 pt-3 border-t border-[#292820]/10 flex items-center justify-between">
                    <button
                      onClick={(e) => handleAdd(e, product)}
                      className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-widest font-bold text-[#292820] hover:text-[#B69A78] py-1 transition-colors"
                    >
                      <span>{isJustAdded ? 'Added to Bag' : 'Add to Bag'}</span>
                      {isJustAdded ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick View Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-[#151419]/70 backdrop-blur-xs"
            />
            <div className="relative bg-[#FAF9F6] rounded-xl max-w-2xl w-full p-6 sm:p-8 overflow-hidden shadow-2xl border border-[#292820]/15 z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="aspect-square rounded-lg overflow-hidden bg-[#EDE5DA]">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#B69A78]">
                      <span>{selectedProduct.categoryName}</span>
                      <span>#{selectedProduct.serialNumber}</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#292820] mt-1">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-xs text-[#292820]/60 mt-0.5">
                      Verified merchant: <strong className="text-[#292820]">{selectedProduct.retailer.name}</strong>
                    </p>
                    <p className="text-sm text-[#292820]/80 mt-3 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#292820] font-mono">
                        ₹{selectedProduct.price.toLocaleString('en-IN')}
                      </span>
                      {selectedProduct.originalPrice && (
                        <span className="text-sm text-stone-400 line-through font-mono">
                          ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#292820]/10 flex flex-col gap-2.5">
                    <button
                      onClick={(e) => {
                        handleAdd(e, selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full py-3 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider shadow-brutal hover:bg-[#292820]"
                    >
                      Add to Bag • ₹{selectedProduct.price.toLocaleString('en-IN')}
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="text-xs text-stone-500 hover:text-stone-800 text-center py-1"
                    >
                      Close preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

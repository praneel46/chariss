import React from 'react';
import { X, Plus, Minus, Trash2, ArrowUpRight, Gift, ShoppingBag } from 'lucide-react';
import { useBag } from '../../context/BagContext';

export const BagDrawer: React.FC = () => {
  const { items, isBagOpen, setIsBagOpen, updateQuantity, removeFromBag, totalAmount, totalCount, clearBag } = useBag();

  if (!isBagOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        onClick={() => setIsBagOpen(false)}
        className="absolute inset-0 bg-[#151419]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] text-[#292820] shadow-2xl flex flex-col border-l border-[#292820]/15 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-[#292820]/10 flex items-center justify-between bg-[#EDE5DA]/40">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#B69A78] font-bold">
                Your Curated Selection
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#292820]">The Gift Bag.</h2>
            </div>
            <button
              onClick={() => setIsBagOpen(false)}
              className="p-2 rounded-full hover:bg-[#EDE5DA] text-[#292820] transition-colors"
              aria-label="Close bag drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bag Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EDE5DA] flex items-center justify-center text-[#B69A78]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-[#292820]">
                    A quiet moment. Just a little empty.
                  </h3>
                  <p className="text-sm text-[#292820]/70 max-w-xs">
                    Meaningful tokens and hand-crafted wonders are waiting in our curated catalog.
                  </p>
                </div>
                <button
                  onClick={() => setIsBagOpen(false)}
                  className="mt-4 px-5 py-2.5 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider shadow-brutal hover:bg-[#292820]"
                >
                  Explore Curated Gifts
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-3 bg-white rounded-lg border border-[#292820]/10 shadow-xs relative group"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md bg-[#EDE5DA]"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-sm font-bold text-[#292820] leading-snug line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromBag(product.id)}
                            className="text-stone-400 hover:text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#B69A78] uppercase tracking-wider font-mono">
                          {product.categoryName}
                        </p>
                        <p className="text-xs font-bold text-[#292820] mt-1">
                          ₹{product.price.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Stepper controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-[#292820]/20 rounded-md bg-[#FAF9F6]">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 hover:bg-[#EDE5DA] text-[#292820] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-mono font-bold">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 hover:bg-[#EDE5DA] text-[#292820] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[11px] text-stone-500 font-mono">
                          = ₹{(product.price * quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Free gift / packaging reminder (observed in video) */}
                <div className="p-3 bg-[#DDE7DD]/40 rounded-lg border border-[#DDE7DD] flex items-center gap-3 text-xs text-[#292820]">
                  <Gift className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>
                    <strong>Complimentary Gift Wrapping:</strong> Every order includes bespoke tissue & studio seal.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#292820]/10 bg-white space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#292820]/70">
                  <span>Selected Gifts ({totalCount})</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#292820]/70">
                  <span>Keepsake Gift Packaging</span>
                  <span className="text-emerald-700 font-medium">On us (Free)</span>
                </div>
                <div className="flex justify-between font-serif text-lg font-bold text-[#292820] pt-2 border-t border-[#292820]/10">
                  <span>Total Estimated</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={items[0]?.product.productUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider shadow-brutal hover:bg-[#292820] transition-all"
                >
                  <span>Direct Artisan Checkout</span>
                  <ArrowUpRight className="w-4 h-4 text-[#D4A359]" />
                </a>
                <p className="text-[10px] text-center text-[#292820]/60">
                  Direct checkout from verified artisans. CHARIS takes zero customer fees.
                </p>
              </div>

              <button
                onClick={clearBag}
                className="w-full text-center text-[11px] text-stone-500 hover:text-stone-800 underline"
              >
                Clear all bag items
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

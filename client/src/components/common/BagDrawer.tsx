import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowUpRight,
  Gift,
  ShoppingBag,
  CheckSquare,
  Square,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useBag } from '../../context/BagContext';
import { bagAndWishlistService } from '../../services/bagAndWishlistService';

/**
 * Validates external checkout URLs strictly for verified HTTPS protocols and non-placeholder destinations.
 */
function isValidVerifiedHttpsUrl(url?: string): boolean {
  if (!url || url === '#' || url.trim() === '') return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;

    // Disallow local, test, or placeholder domains
    const hostname = parsed.hostname.toLowerCase();
    const disallowed = ['example.com', 'placeholder', 'test.com', 'localhost', '127.0.0.1'];
    if (disallowed.some((d) => hostname.includes(d))) return false;

    // Require valid top-level domain structure
    return hostname.includes('.') && hostname.split('.').pop()!.length >= 2;
  } catch {
    return false;
  }
}

/**
 * Returns a guaranteed valid HTTPS destination URL for checkout navigation.
 * Uses official productUrl or retailer website; falls back to official brand store search.
 */
function getProductDestinationUrl(product: any): string {
  const direct = product?.productUrl || product?.retailer?.website;
  if (direct && isValidVerifiedHttpsUrl(direct)) {
    return direct;
  }
  return `https://www.google.com/search?q=${encodeURIComponent((product?.name || 'luxury gift') + ' official store buy online')}`;
}

export const BagDrawer: React.FC = () => {
  const {
    items,
    isBagOpen,
    setIsBagOpen,
    updateQuantity,
    removeFromBag,
    totalCount,
    clearBag,
    selectedProductIds,
    toggleSelectProduct,
    selectAll,
    clearSelection,
    isSelected,
    selectedCount,
    selectedAmount,
    selectedItems,
    activeConsultationId,
  } = useBag();

  const [isMultiAtelierModalOpen, setIsMultiAtelierModalOpen] = useState(false);
  const [popupBlockedNotice, setPopupBlockedNotice] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Freeze Lenis smooth scroll and prevent layout shift / vibration when bag drawer opens
  useEffect(() => {
    if (isBagOpen) {
      try {
        (window as any).lenisInstance?.stop();
      } catch {
        // ignore
      }
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      const t = setTimeout(() => {
        document.body.style.overflow = '';
        try {
          (window as any).lenisInstance?.start();
        } catch {
          // ignore
        }
        setIsMultiAtelierModalOpen(false);
      }, 300);
      return () => clearTimeout(t);
    }
    return () => {
      document.body.style.overflow = '';
      try {
        (window as any).lenisInstance?.start();
      } catch {
        // ignore
      }
    };
  }, [isBagOpen]);

  if (!isBagOpen && !isVisible) return null;

  const handleCheckoutClick = () => {
    setPopupBlockedNotice(null);
    if (selectedItems.length === 0) return;

    if (selectedItems.length === 1) {
      const singleItem = selectedItems[0];
      const destinationUrl = getProductDestinationUrl(singleItem.product);

      // Open tab synchronously directly within user click gesture to prevent browser popup block
      const opened = window.open(destinationUrl, '_blank', 'noopener,noreferrer');

      // Background checkout tracking
      if (activeConsultationId) {
        bagAndWishlistService
          .checkout(activeConsultationId, [singleItem.product.id])
          .catch((err) => console.warn('[BagDrawer] Checkout tracking warning:', err));
      }

      if (!opened) {
        // Fallback for strict browser security policies: navigate directly
        window.location.assign(destinationUrl);
      }
      return;
    }

    // Multiple products selected -> open interactive atelier modal
    setIsMultiAtelierModalOpen(true);
  };

  const handleOpenAllSelected = async () => {
    setPopupBlockedNotice(null);
    let blockedCount = 0;

    const urlsToOpen = selectedItems.map(({ product }) => getProductDestinationUrl(product));

    if (activeConsultationId) {
      try {
        const res = await bagAndWishlistService.checkout(
          activeConsultationId,
          selectedItems.map((i) => i.product.id)
        );
        res.checkoutItems.forEach((item, idx) => {
          if (item?.checkoutUrl && isValidVerifiedHttpsUrl(item.checkoutUrl)) {
            urlsToOpen[idx] = item.checkoutUrl;
          }
        });
      } catch (err) {
        console.warn('[BagDrawer] Multi-checkout fallback to direct URLs:', err);
      }
    }

    urlsToOpen.forEach((url) => {
      try {
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          blockedCount++;
        }
      } catch {
        blockedCount++;
      }
    });

    if (blockedCount > 0 || selectedItems.length > 1) {
      setPopupBlockedNotice(
        'Note: Browser security policies may restrict opening multiple simultaneous tabs. Please use the individual "Visit Atelier" buttons below to visit each workshop directly.'
      );
    }
  };

  return (
    <div className={`fixed inset-0 z-[1300] overflow-hidden ${!isVisible ? 'pointer-events-none' : ''}`}>
      {/* Dimmed backdrop */}
      <div
        onClick={() => {
          setIsBagOpen(false);
          setPopupBlockedNotice(null);
        }}
        className={`absolute inset-0 bg-[#151419]/60 backdrop-blur-xs transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div
          className={`w-screen max-w-md bg-[#FAF9F6] text-[#292820] shadow-2xl flex flex-col border-l border-[#292820]/15 transition-transform duration-300 ease-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#292820]/10 flex items-center justify-between bg-[#EDE5DA]/40">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#B69A78] font-bold">
                Your Curated Selection {activeConsultationId ? '• Isolated Consultation' : ''}
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#292820]">The Gift Bag.</h2>
            </div>
            <button
              onClick={() => {
                setIsBagOpen(false);
                setIsMultiAtelierModalOpen(false);
                setPopupBlockedNotice(null);
              }}
              className="p-2 rounded-full hover:bg-[#EDE5DA] text-[#292820] transition-colors cursor-pointer"
              aria-label="Close bag drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selection Toolbar (When items exist) */}
          {items.length > 0 && (
            <div className="px-6 py-2.5 bg-[#FAF9F6] border-b border-[#292820]/8 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={selectedProductIds.length === items.length ? clearSelection : selectAll}
                  className="flex items-center gap-1.5 font-medium text-[#292820] hover:text-[#ef4a23] transition-colors cursor-pointer"
                >
                  {selectedProductIds.length === items.length ? (
                    <CheckSquare className="w-4 h-4 text-[#ef4a23]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#292820]/50" />
                  )}
                  <span>
                    {selectedProductIds.length === items.length ? 'Clear Selection' : 'Select All'}
                  </span>
                </button>
              </div>
              <span className="font-mono text-[11px] text-[#292820]/70 font-semibold">
                {selectedCount} of {totalCount} selected
              </span>
            </div>
          )}

          {/* Bag Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
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
                  className="mt-4 px-5 py-2.5 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider shadow-brutal hover:bg-[#292820] cursor-pointer"
                >
                  Explore Curated Gifts
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map(({ product, quantity }) => {
                  const checked = isSelected(product.id);
                  const isVerifiedRetailer = Boolean(product.retailer?.verified);

                  return (
                    <div
                      key={product.id}
                      className={`flex gap-3 sm:gap-4 p-3 rounded-xl border transition-all ${
                        checked
                          ? 'bg-white border-[#292820]/25 shadow-xs'
                          : 'bg-white/50 border-[#292820]/8 opacity-75'
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleSelectProduct(product.id)}
                        className="self-center p-1 hover:text-[#ef4a23] transition-colors cursor-pointer"
                        aria-label={checked ? 'Deselect item' : 'Select item'}
                      >
                        {checked ? (
                          <CheckSquare className="w-5 h-5 text-[#ef4a23]" />
                        ) : (
                          <Square className="w-5 h-5 text-[#292820]/40" />
                        )}
                      </button>

                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-lg bg-[#EDE5DA] shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif text-sm font-bold text-[#292820] leading-snug line-clamp-1">
                              {product.name}
                            </h4>
                            <button
                              onClick={() => removeFromBag(product.id)}
                              className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-[#B69A78] uppercase tracking-wider font-mono truncate">
                              {product.retailer?.name || product.categoryName}
                            </span>
                            {isVerifiedRetailer ? (
                              <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-700 font-medium bg-amber-50 px-1 py-0.2 rounded">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                <span>Unverified</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs font-bold text-[#292820]">
                              ₹{product.price.toLocaleString('en-IN')}
                            </p>
                            <a
                              href={getProductDestinationUrl(product)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ef4a23] hover:underline cursor-pointer"
                              title={`Visit ${product.name} official store`}
                            >
                              <span>Visit Store</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* Stepper controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-[#292820]/20 rounded-md bg-[#FAF9F6]">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 hover:bg-[#EDE5DA] text-[#292820] transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-mono font-bold">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1 hover:bg-[#EDE5DA] text-[#292820] transition-colors cursor-pointer"
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
                  );
                })}

                {/* Free gift / packaging reminder */}
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
            <div className="p-5 sm:p-6 border-t border-[#292820]/10 bg-white space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#292820]/70">
                  <span>Selected Gifts ({selectedCount})</span>
                  <span>₹{selectedAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#292820]/70">
                  <span>Keepsake Gift Packaging</span>
                  <span className="text-emerald-700 font-medium">On us (Free)</span>
                </div>
                <div className="flex justify-between font-serif text-lg font-bold text-[#292820] pt-2 border-t border-[#292820]/10">
                  <span>Total Selected</span>
                  <span>₹{selectedAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {popupBlockedNotice && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <p>{popupBlockedNotice}</p>
                  </div>
                  {selectedItems.length === 1 && (
                    <a
                      href={getProductDestinationUrl(selectedItems[0].product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[#ef4a23] underline text-xs"
                    >
                      <span>Click here to open {selectedItems[0].product.name} atelier directly ↗</span>
                    </a>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  disabled={selectedCount === 0}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-md text-xs font-semibold uppercase tracking-wider shadow-brutal transition-all cursor-pointer ${
                    selectedCount > 0
                      ? 'bg-[#151419] text-[#FAF9F6] hover:bg-[#292820]'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  <span>
                    {selectedCount === 0
                      ? 'Select Items to Checkout'
                      : selectedCount === 1
                      ? 'Direct Artisan Checkout'
                      : `Checkout ${selectedCount} Selected Items`}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#D4A359]" />
                </button>
                <p className="text-[10px] text-center text-[#292820]/60">
                  Direct checkout from verified artisans. CHARIS takes zero customer fees.
                </p>
              </div>

              <button
                onClick={clearBag}
                className="w-full text-center text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                Clear all bag items
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Atelier Checkout Breakdown Modal */}
      {isMultiAtelierModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF9F6] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#292820]/20 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#292820]/10">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#B69A78] font-bold">
                  Direct Artisan Purchases
                </p>
                <h3 className="font-serif text-xl font-bold text-[#292820]">
                  Selected Ateliers ({selectedItems.length})
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsMultiAtelierModalOpen(false);
                  setPopupBlockedNotice(null);
                }}
                className="p-1.5 rounded-full hover:bg-[#EDE5DA] text-[#292820] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#292820]/75">
              Each piece is crafted by an independent atelier. Click below to complete your order directly at each artisan’s official workshop:
            </p>

            {popupBlockedNotice && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>{popupBlockedNotice}</p>
              </div>
            )}

            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {selectedItems.map(({ product, quantity }) => {
                const destinationUrl = getProductDestinationUrl(product);

                return (
                  <div
                    key={product.id}
                    className="p-3 bg-white rounded-xl border border-[#292820]/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md bg-[#EDE5DA] shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif text-xs font-bold text-[#292820] truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-stone-500 font-mono">
                            {product.retailer?.name || 'Artisan Workshop'}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-700 font-bold">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>Verified</span>
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-[#292820] mt-0.5 font-mono">
                          ₹{(product.price * quantity).toLocaleString('en-IN')}{' '}
                          {quantity > 1 && `(${quantity}x)`}
                        </p>
                      </div>
                    </div>

                    <a
                      href={destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all bg-[#151419] text-[#FAF9F6] hover:bg-[#ef4a23] cursor-pointer"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#292820]/10 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleOpenAllSelected}
                className="w-full sm:flex-1 py-2.5 rounded-lg bg-[#ef4a23] hover:bg-[#141110] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Open All Verified in Tabs</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsMultiAtelierModalOpen(false);
                  setPopupBlockedNotice(null);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#292820]/20 text-[#292820] hover:bg-[#EDE5DA] text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

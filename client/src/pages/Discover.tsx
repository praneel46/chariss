import React, { useState, useMemo } from 'react';
import { CURATED_PRODUCTS } from '../data/mockData';
import { useBag } from '../context/BagContext';
import { useWishlist } from '../context/WishlistContext';
import { Search, SlidersHorizontal, Heart, Plus, Check, Sparkles } from 'lucide-react';
import type { Product } from '../types';

export const Discover: React.FC = () => {
  const { addToBag } = useBag();
  const { wishlist, toggleWishlist } = useWishlist();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Curations' },
    { id: 'wearables_eyewear', label: 'Smart Wearables & Eyewear' },
    { id: 'smart_home', label: 'Intelligent Home & Living' },
    { id: 'content_creation', label: 'Content Creation Tech' },
    { id: 'wellness_health', label: 'AI Wellness & Health' },
    { id: 'curated_boxes', label: 'Luxury Bags & Keepsakes' },
  ];

  const filteredProducts = useMemo(() => {
    return CURATED_PRODUCTS.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'all' || p.categoryId === selectedCategory;

      return matchesSearch && matchesCat;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [searchQuery, selectedCategory, sortBy]);

  const handleAdd = (product: Product) => {
    addToBag(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="bg-[#FAF9F6] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-[#292820]/10 pb-8 mb-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catalogue Directory</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#292820] mt-1">
            Explore Curated Gifts
          </h1>
          <p className="text-sm sm:text-base text-[#292820]/75 mt-2 max-w-2xl leading-relaxed">
            Every item in our collection is independently reviewed, priced accurately, and accompanied by provenance details.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search smart glasses, rings, watches, bags, lifestyle..."
              className="w-full pl-10 pr-4 py-2.5 rounded-md bg-white border border-[#292820]/15 text-xs text-[#292820] placeholder:text-stone-400 focus:outline-none focus:border-[#B69A78]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-[#B69A78]" />
            <span className="text-xs font-mono uppercase text-[#292820]/70">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-md bg-white border border-[#292820]/15 text-xs text-[#292820] focus:outline-none focus:border-[#B69A78] cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#151419] text-[#FAF9F6] shadow-xs'
                  : 'bg-white border border-[#292820]/10 text-[#292820]/70 hover:bg-[#EDE5DA]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-[#292820]/10">
            <p className="font-serif text-xl font-bold text-[#292820]">No matching gifts found</p>
            <p className="text-xs text-[#292820]/60 mt-1">Try tweaking your search keywords or choosing another category.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 px-4 py-2 rounded-md bg-[#EDE5DA] text-xs font-mono uppercase tracking-wider text-[#292820] font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
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

                    {product.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#D4A359] text-[#151419] font-mono text-[10px] font-bold tracking-wider z-10">
                        {product.badge}
                      </span>
                    )}

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#292820] hover:text-red-600 transition-colors z-10 shadow-xs cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#B69A78] mb-1.5">
                        <span>{product.categoryName}</span>
                        <span className="text-stone-400 font-bold">{product.serialNumber}</span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#292820] group-hover:text-[#B69A78] transition-colors leading-snug">
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#292820]/70 mt-1 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-base font-bold text-[#292820] font-mono">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through font-mono">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-[11px] text-[#B69A78] ml-auto font-mono">
                          ★ {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#292820]/10 flex items-center justify-between">
                      <button
                        onClick={() => handleAdd(product)}
                        className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-widest font-bold text-[#292820] hover:text-[#B69A78] py-1 transition-colors cursor-pointer"
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
        )}

      </div>
    </div>
  );
};

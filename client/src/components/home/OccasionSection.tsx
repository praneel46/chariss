import React from 'react';
import { OCCASIONS_DATA } from '../../data/mockData';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OccasionSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#EDE5DA]/30 border-b border-[#292820]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
              <span>02</span>
              <span>/</span>
              <span>Moments That Matter</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#292820] mt-1">
              Curated by Occasion
            </h2>
          </div>
          <p className="text-sm text-[#292820]/75 max-w-md">
            Whether honoring a lifelong milestone or sending an unprompted token of affection, discover gifts calibrated to the emotional tone of the day.
          </p>
        </div>

        {/* Occasions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {OCCASIONS_DATA.map((occ) => (
            <Link
              key={occ.id}
              to={`/discover?occasion=${occ.slug}`}
              className="group bg-white rounded-lg overflow-hidden border border-[#292820]/10 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden relative bg-[#EDE5DA]">
                <img
                  src={occ.imageUrl}
                  alt={occ.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-mono uppercase tracking-wider text-[#292820] font-bold">
                  {occ.tag}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#292820] group-hover:text-[#B69A78] transition-colors">
                    {occ.title}
                  </h3>
                  <p className="text-xs text-[#292820]/60 mt-1 line-clamp-2">
                    {occ.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#292820]/8 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#B69A78] font-semibold">
                  <span>Browse gifts</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

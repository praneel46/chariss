import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQS } from '../../data/mockData';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#FAF9F6] border-b border-[#292820]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric 2-column layout matching reference video */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
              <span>05</span>
              <span>/</span>
              <span>A Little Clarity</span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-[#292820] tracking-tight leading-tight">
              FREQUENT QUESTIONS.
              <br />
              <span className="text-[#D4A359]">STRAIGHTFORWARD ANSWERS.</span>
            </h2>

            <p className="text-sm text-[#292820]/75 leading-relaxed pt-2">
              Have questions about how CHARIS pairs AI consultation with genuine artisan products? Here is how we preserve transparency, privacy, and quality.
            </p>
          </div>

          {/* Right Column: Accordion list */}
          <div className="lg:col-span-7 divide-y divide-[#292820]/10 border-y border-[#292820]/10">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="py-5">
                  <button
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                  >
                    <span className="font-serif text-base sm:text-lg font-bold text-[#292820] group-hover:text-[#B69A78] transition-colors">
                      {faq.question}
                    </span>
                    <span className="p-1 rounded-full text-[#292820] group-hover:bg-[#EDE5DA] transition-colors shrink-0">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-sm text-[#292820]/75 leading-relaxed pr-8 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

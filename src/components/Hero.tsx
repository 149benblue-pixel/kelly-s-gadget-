/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from './StoreContext';
import { ArrowRight, Sparkles, Shield, Truck, CreditCard, RotateCcw } from 'lucide-react';

const bannerSlides = [
  {
    title: "iPhone 15 Pro Max Titanium",
    tagline: "Aero Titanium Chassis • Supercharged Apple A17 Pro CPU",
    description: "Experience the next frontier of mobile power with absolute multi-zoom studio cameras, all-day gaming capacity, and Dynamic Island navigation.",
    badge: "Hot Deal of the Week",
    badgeColor: "bg-amber-100 text-amber-800",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    slug: "smartphones",
    cta: "Shop Smartphones"
  },
  {
    title: "The Ultimate M3 MacBook Pro 16\"",
    tagline: "Pure Liquid Retina XDR screen • Up to 22 hrs power",
    description: "Designed strictly for software engineers, high-end animators, and heavy workloads. Tackle any task with breathtaking speed.",
    badge: "High Performance Tech",
    badgeColor: "bg-blue-100 text-blue-800",
    image: "https://images.unsplash.com/photo-1496181130204-755241524eab?w=800&auto=format&fit=crop&q=80",
    slug: "laptops",
    cta: "Shop Laptops"
  },
  {
    title: "Rethink Ergonomic Coding Gear",
    tagline: "Tactile Scroll Control • Adaptive ANC Sound Systems",
    description: "Maximize your mental bandwidth with MX Master controllers and ambient ANC personal studio systems. Comfort that inspires.",
    badge: "Elite Creator Setups",
    badgeColor: "bg-emerald-100 text-emerald-800",
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800&auto=format&fit=crop&q=80",
    slug: "accessories",
    cta: "Shop Accessories"
  }
];

export default function Hero() {
  const { setView, fetchProducts } = useStore();
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % bannerSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleCtaClick = (slug: string) => {
    fetchProducts({ category: slug });
    setView('shop');
  };

  const active = bannerSlides[slideIndex];

  return (
    <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white relative overflow-hidden" id="hero-banner-section">
      {/* Absolute floating vector elements for tech aesthetics */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-15 -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500 rounded-full filter blur-3xl opacity-10 -ml-20 -mb-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[460px]">
          
          {/* Slide Text Columns */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left" id="hero-slide-captions">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3.5 py-1 rounded-full text-xs font-bold font-sans tracking-wide uppercase ${active.badgeColor} animate-pulse`}>
                {active.badge}
              </span>
              <span className="text-blue-300 text-xs flex items-center gap-1 font-mono">
                <Sparkles className="w-3.5 h-3.5" /> STOCKS GUARANTEED
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-sans tracking-tight leading-tight mb-4 text-white drop-shadow-xs transition-all duration-500">
              {active.title}
            </h2>

            <p className="text-lg sm:text-xl font-medium text-cyan-300 mb-4 transition-all duration-300 font-sans">
              {active.tagline}
            </p>

            <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-xl leading-relaxed font-sans">
              {active.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => handleCtaClick(active.slug)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>{active.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => { fetchProducts({ tab: 'offers' }); setView('shop'); }}
                className="bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-all text-sm cursor-pointer"
              >
                Get Special Offers
              </button>
            </div>

            {/* Slide Controller indicator dots */}
            <div className="flex gap-2.5 mt-10">
              {bannerSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlideIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${slideIndex === idx ? 'w-8 bg-blue-500' : 'w-2.5 bg-white/40'}`}
                  title={`Show slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Slide Images Columns */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end" id="hero-slide-illustration">
            <div className="relative w-full max-w-md aspect-square bg-slate-800/10 rounded-2xl border border-white/10 p-4 shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
              <img 
                src={active.image} 
                alt={active.title}
                referrerPolicy="no-referrer"
                className="max-h-[380px] w-full object-contain rounded-xl hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Feature Highlights Trust Indicators footer strip */}
      <div className="bg-white/5 border-t border-white/10" id="hero-benefits-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
              <div className="bg-blue-500/10 p-2.5 rounded-lg text-blue-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold font-sans">Nationwide Courier</h4>
                <p className="text-[11px] text-gray-400">Free delivery on orders above $500</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
              <div className="bg-blue-500/10 p-2.5 rounded-lg text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold font-sans">Full Store Warranty</h4>
                <p className="text-[11px] text-gray-400">Up to 2 Years official coverage</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
              <div className="bg-blue-500/10 p-2.5 rounded-lg text-blue-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold font-sans">Secure M-Pesa & Cards</h4>
                <p className="text-[11px] text-gray-400">Fully encrypted online portals</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
              <div className="bg-blue-500/10 p-2.5 rounded-lg text-blue-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold font-sans">7-Day Hassle Returns</h4>
                <p className="text-[11px] text-gray-400">No question asked policy</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

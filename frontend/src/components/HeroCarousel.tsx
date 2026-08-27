import React, { useState, useEffect } from 'react';
import { ShieldAlert, Sparkles, ChevronRight, Zap } from 'lucide-react';

interface HeroCarouselProps {
  onShopNow: () => void;
}

const slides = [
  {
    title: 'NVIDIA RTX 4090 OC 24GB',
    subtitle: 'UNLEASH BEYOND FAST PERFORMANCE',
    description: 'Dominate 4K ray tracing with DLSS 3 frame generation and Ada Lovelace architecture.',
    badge: 'NEW RESTOCK ARRIVED',
    price: '$1,599.99',
    oldPrice: '$1,699.99',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200',
    color: 'from-cyan-500/30 via-slate-900 to-[#0a0d14]',
  },
  {
    title: 'ROG Strix Scar 18 OLED',
    subtitle: 'THE ULTIMATE PORTABLE BATTLESTATION',
    description: 'Intel i9-14900HX, RTX 4090, 64GB DDR5 RAM, and 240Hz QHD+ ultra-vibrant OLED panel.',
    badge: 'FLASH DEAL - $200 OFF',
    price: '$3,299.99',
    oldPrice: '$3,499.99',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200',
    color: 'from-purple-600/30 via-slate-900 to-[#0a0d14]',
  },
  {
    title: 'PlayStation 5 Pro Digital',
    subtitle: 'NEXT-GEN SPECTRAL RESOLUTION',
    description: 'Built-in 2TB SSD, 60FPS fidelity mode ray tracing, and PSSR AI upscaling.',
    badge: 'HOT SELLER',
    price: '$679.99',
    oldPrice: '$699.99',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200',
    color: 'from-pink-600/30 via-slate-900 to-[#0a0d14]',
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onShopNow }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900 shadow-2xl mb-12">
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} z-10 opacity-90`} />

      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-[450px] object-cover object-center opacity-40 mix-blend-luminosity transition-all duration-700 transform scale-105"
      />

      <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 max-w-3xl">
        <div className="inline-flex items-center space-x-2 bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold w-max mb-4 shadow-neon">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{slide.badge}</span>
        </div>

        <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-1">
          {slide.subtitle}
        </h3>

        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
          {slide.title}
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-xl">
          {slide.description}
        </p>

        <div className="flex items-center space-x-6">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-cyan-400">{slide.price}</span>
            <span className="text-sm font-semibold text-slate-500 line-through">{slide.oldPrice}</span>
          </div>

          <button
            onClick={onShopNow}
            className="group flex items-center space-x-2 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-black font-extrabold text-xs px-6 py-3 rounded-full hover:opacity-90 transition shadow-neon"
          >
            <Zap className="w-4 h-4 text-black fill-current" />
            <span>CLAIM DEAL NOW</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 right-8 z-30 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentSlide ? 'bg-cyan-400 w-8' : 'bg-slate-700 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

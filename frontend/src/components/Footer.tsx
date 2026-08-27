import React from 'react';
import { Gamepad2, ShieldCheck, Zap, Truck, Headphones, Github, Twitter, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07090e] border-t border-slate-800/80 text-slate-400 mt-20">
      {/* Value Proposition Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-800/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="p-3 bg-cyan-950/50 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">Express Cyber Delivery</h4>
            <p className="text-xs text-slate-500">Free shipping on all orders over $150</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="p-3 bg-purple-950/50 border border-purple-500/30 rounded-xl text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">2-Year Armor Warranty</h4>
            <p className="text-xs text-slate-500">Direct replacement guarantee on components</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="p-3 bg-pink-950/50 border border-pink-500/30 rounded-xl text-pink-400">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">Verified Benchmarks</h4>
            <p className="text-xs text-slate-500">Every rig stress-tested at maximum load</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Headphones className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">24/7 Gamer Support</h4>
            <p className="text-xs text-slate-500">Live technical support on Discord & chat</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-500 text-black">
              <Gamepad2 className="w-5 h-5 font-black" />
            </div>
            <span className="text-lg font-black text-white">Nexus<span className="text-cyan-400">Gaming</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The next-generation marketplace forged for competitive gamers, hardware enthusiasts, and digital creators.
          </p>
          <div className="flex space-x-3 pt-2">
            <a href="#" className="p-2 bg-slate-900 hover:bg-cyan-950 hover:text-cyan-400 border border-slate-800 rounded-lg text-slate-400 transition"><MessageCircle className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-slate-900 hover:bg-cyan-950 hover:text-cyan-400 border border-slate-800 rounded-lg text-slate-400 transition"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-slate-900 hover:bg-cyan-950 hover:text-cyan-400 border border-slate-800 rounded-lg text-slate-400 transition"><Github className="w-4 h-4" /></a>
          </div>
        </div>

        <div>
          <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Categories</h5>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-cyan-400 transition">Graphics Cards (RTX 4090 / RX 7900)</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Gaming Laptops (240Hz OLED)</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Mechanical Keyboards & Mice</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Consoles & 4K VR Headsets</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Digital Game Expansion Passes</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Customer Care</h5>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-cyan-400 transition">Track Order Status</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Returns & Warranty Replacement</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Shipping Rates & Policies</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Payment Methods & Security</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Privacy Policy & Terms</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Join Loot Newsletter</h5>
          <p className="text-xs text-slate-400 mb-3">Get exclusive restock alerts, coupon codes, and flash sale notifications.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="gamer@domain.com"
              className="bg-[#121824] border border-slate-700 rounded-l-lg px-3 py-2 text-xs text-slate-200 w-full focus:outline-none focus:border-cyan-500"
            />
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-black text-xs font-bold px-4 py-2 rounded-r-lg hover:opacity-90 transition">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} NexusGaming Inc. All rights reserved. Built for Autonomous Full-Stack Engineering.
      </div>
    </footer>
  );
};

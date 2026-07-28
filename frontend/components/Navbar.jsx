"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Menu, X, Shield, Zap } from "lucide-react";

export default function Navbar() {
  const { cart, totalPrice } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-red-500/20 shadow-2xl shadow-red-500/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo - Responsive Sizing for Mobile */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 max-w-[65%] sm:max-w-none">
            <img
              src="/images/logo.png"
              alt="Mulla Jee Foods Logo"
              className="h-9 sm:h-12 w-auto object-contain shrink-0 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="min-w-0">
              <span className="text-base sm:text-2xl font-black tracking-tight sm:tracking-wider bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent uppercase block truncate">
                Mulla Jee <span className="text-white">Foods</span>
              </span>
              <span className="hidden sm:block text-[10px] font-bold text-red-500/90 tracking-widest uppercase truncate">
                Delicious Fast Food Express
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-bold text-neutral-300 text-sm">
            <Link href="/" className="hover:text-red-500 transition-colors">
              Home
            </Link>
            <Link href="/menu" className="hover:text-red-500 transition-colors">
              Full Menu
            </Link>
            <Link href="/menu?featured=true" className="hover:text-red-400 transition-colors flex items-center gap-1.5 text-red-500 font-extrabold uppercase tracking-wide">
              <Zap className="w-4 h-4 fill-red-500" /> Hot Deals
            </Link>
            <Link href="/track" className="hover:text-red-500 transition-colors">
              Track Order
            </Link>
          </nav>

          {/* Cart & Admin Quick Access */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/admin/login"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white px-3 py-2 rounded-xl border border-neutral-800 hover:border-red-500/40 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" /> Admin
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                {totalItems > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-white text-neutral-950 text-[9px] sm:text-[10px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-red-600 shadow-md">
                    {totalItems}
                  </span>
                )}
              </div>
              <span>Rs. {totalPrice}</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900/95 border-b border-neutral-800 px-6 py-6 space-y-4">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-neutral-200 hover:text-red-500"
          >
            Home
          </Link>
          <Link
            href="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-neutral-200 hover:text-red-500"
          >
            Full Menu
          </Link>
          <Link
            href="/menu?featured=true"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-red-500 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 fill-red-500" /> Hot Deals
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-neutral-200 hover:text-red-500"
          >
            Track Order
          </Link>
          <div className="pt-4 border-t border-neutral-800">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-red-500"
            >
              <Shield className="w-4 h-4" /> Admin Management Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

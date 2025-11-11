"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavigationProps {
  currentPage?: "home" | "premade" | "figurefinder" | "about" | "cart";
}

export function Navigation({ currentPage = "home" }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          setCartCount(cart.length);
        } catch (error) {
          console.error("Error reading cart:", error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    // Initial load
    updateCartCount();

    // Listen for storage changes (when cart is updated)
    window.addEventListener("storage", updateCartCount);
    
    // Custom event for same-page cart updates
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const navItems = [
    { href: "/", label: "Home", page: "home" },
    { href: "/premade", label: "Premade", page: "premade" },
    { href: "/figurefinder", label: "Figure Finder", page: "figurefinder" },
    { href: "/about", label: "About", page: "about" },
  ] as const;

  return (
    <nav className="sticky top-0 w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-blue-500/5 z-50">
      <div className="relative flex justify-between items-center h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="cursor-pointer flex items-center gap-3 flex-shrink-0 transition-all duration-100 hover:scale-105 active:scale-95 active:opacity-80 z-10"
        >
          <Image
            src="/moxlogosimple.png"
            alt="Website Logo"
            width={120}
            height={120}
            className="h-14 w-auto object-contain sm:h-16"
            priority
          />
          <span className="hidden sm:block text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Mox Minis
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          {navItems.map((item) => (
            <Link
              key={item.page}
              href={item.href}
              className={`cursor-pointer relative px-4 py-2 text-base font-medium transition-all duration-200 rounded-lg group active:scale-95 active:bg-blue-500/10 ${
                currentPage === item.page
                  ? "text-blue-400"
                  : "text-gray-300 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-200 ${
                  currentPage === item.page
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Cart Button */}
        <Link 
          href="/cart"
          className="cursor-pointer relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-95 active:from-blue-700 active:to-blue-600 text-white px-3 sm:px-5 py-2.5 rounded-lg font-semibold transition-all duration-100 flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 z-10"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 sm:static sm:top-auto sm:right-auto bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="cursor-pointer md:hidden text-white p-2 ml-2 rounded-lg transition-all duration-200 active:scale-90 active:bg-slate-800 hover:bg-slate-800/50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu options */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-blue-500/20">
          <div className="flex flex-col py-4 px-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.page}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`cursor-pointer px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg active:scale-95 active:bg-blue-500/30 ${
                  currentPage === item.page
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

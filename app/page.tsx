import React from "react";
import Link from "next/link";
import { Navigation } from "@/components/ui/navigation";

export default function Home() {
  return (
    <>
      <Navigation currentPage="home" />

      <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 text-white">
        {/* Hero Section */}
        <div 
          className="min-h-[85vh] flex flex-col items-center justify-end px-6 py-20 sm:py-32 lg:py-40 text-center relative overflow-hidden"
        >
          {/* background image, moved it down some with background position */}
          <div 
            className="absolute inset-0 bg-[url('/Hero%20Background.jpeg')] bg-center bg-cover"
            style={{
              backgroundPosition: 'center 10%',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center mb-12 sm:mb-16 lg:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight max-w-6xl">
              Epic Miniatures for Legendary Adventures
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 sm:mb-16 max-w-4xl mx-auto px-3 leading-relaxed tabindex={0}">
              Professionally painted miniatures that transform your D&D campaigns into unforgettable stories
            </p>
            <div className="flex gap-6 justify-center flex-wrap px-3">
              <Link href="/premade">
                <button className="cursor-pointer text-lg sm:text-xl md:text-2xl px-8 sm:px-12 md:px-14 py-4 sm:py-5 font-bold bg-transparent border-2 border-white hover:bg-white hover:text-blue-950 active:scale-95 active:bg-gray-200 text-white rounded-full transition-all duration-100 hover:scale-105 shadow-lg">
                  Shop Prepainted Favorites
                </button>
              </Link>
              <Link href="/figurefinder">
                <button className="cursor-pointer text-lg sm:text-xl md:text-2xl px-8 sm:px-12 md:px-14 py-4 sm:py-5 font-bold bg-blue-500 hover:bg-blue-600 active:scale-95 active:bg-blue-700 text-white rounded-full transition-all duration-100 hover:scale-105 shadow-lg shadow-blue-500/50">
                  Create Your Own
                </button>
              </Link>
            </div>
          </div>
        </div>

        

      </main>
    </>
  );
}

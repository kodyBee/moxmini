"use client";

import React from 'react';
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";

function About() {
  return (
    <>
      <style>{`html,body { height: 100%; margin: 0; }`}</style>
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 w-full bg-black/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex justify-between items-center z-50">
        {/* Logo/Brand */}
        <Link href="/" className="text-xl sm:text-2xl font-bold text-white">
          Mox Mini's
        </Link>

        {/* Navigation Menu */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          <NavigationMenu>
            <NavigationMenuList className="gap-2 sm:gap-4 lg:gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/" className="text-white hover:text-blue-500 transition-colors px-2 sm:px-3 lg:px-4 py-2 text-sm sm:text-base">
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/salepage" className="text-white hover:text-blue-500 transition-colors px-2 sm:px-3 lg:px-4 py-2 text-sm sm:text-base">
                    Sale
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className="text-blue-500 font-bold px-2 sm:px-3 lg:px-4 py-2 text-sm sm:text-base">
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Cart Button */}
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 lg:px-5 py-2 rounded-full font-medium transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            🛒 <span className="hidden sm:inline">Cart (0)</span><span className="sm:hidden">(0)</span>
          </button>
        </div>
      </nav>

      <main
        style={{
          minHeight: "100vh",
          margin: 0,
          background: "linear-gradient(85deg, #000000 10%, #001220 40%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px",
          color: "white",
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "40px", width: "100%", maxWidth: "1200px", padding: "0 15px" }} className="sm:mb-16">
          <Separator className="mb-6 sm:mb-8 bg-white/20" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl" style={{ marginBottom: "10px", fontWeight: "bold" }}>
            About Mox Brinkman
          </h1>
          <p className="text-base sm:text-lg md:text-xl" style={{ color: "#cccccc", marginBottom: "20px" }}>
            Master Miniature Artist
          </p>
          <Separator className="mt-8 bg-white/20" />
        </div>

        {/* About Content */}
        <div style={{ maxWidth: "1200px", width: "100%", padding: "0 15px" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              marginBottom: "30px",
            }}
            className="sm:p-8 md:p-10 sm:mb-10"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl" style={{ fontWeight: "bold", marginBottom: "20px", color: "#4488ff" }}>
              About the Artist
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg sm:mb-8" style={{ lineHeight: "1.8", color: "#cccccc", marginBottom: "20px" }}>
              Mox Brinkman is a hardworking and talented artist dedicated to creating 
              world-class miniatures for Dungeons & Dragons. With meticulous attention 
              to detail and an unwavering passion for the craft, Mox brings fantasy 
              worlds to life one miniature at a time.
            </p>

            <h3 className="text-lg sm:text-xl md:text-2xl" style={{ fontWeight: "600", marginBottom: "15px", color: "#4488ff" }}>
              Craftsmanship & Vision
            </h3>
            <p className="text-sm sm:text-base md:text-lg sm:mb-8" style={{ lineHeight: "1.8", color: "#cccccc", marginBottom: "20px" }}>
              Every piece created by Mox combines technical expertise with artistic 
              vision. From heroic adventurers to fearsome monsters, each miniature 
              is crafted with precision and care, designed to enhance your tabletop 
              gaming experience.
            </p>

            <h3 className="text-lg sm:text-xl md:text-2xl" style={{ fontWeight: "600", marginBottom: "15px", color: "#4488ff" }}>
              Dedication to Excellence
            </h3>
            <p className="text-sm sm:text-base md:text-lg sm:mb-8" style={{ lineHeight: "1.8", color: "#cccccc", marginBottom: "20px" }}>
              Through countless hours of sculpting, painting, and perfecting techniques, 
              Mox has developed a reputation for producing miniatures that stand among 
              the finest in the industry. Each creation reflects a commitment to quality 
              and a deep understanding of what makes tabletop gaming truly immersive.
            </p>

            <div className="sm:mt-10 sm:pt-8" style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.2)" }}>
              <p className="text-sm sm:text-base md:text-lg" style={{ fontStyle: "italic", textAlign: "center", color: "#aaaaaa" }}>
                "Bringing imagination to the tabletop, one miniature at a time."
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }} className="sm:gap-5">
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                textAlign: "center",
              }}
              className="sm:p-8"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl" style={{ fontWeight: "600", marginBottom: "10px", color: "#4488ff" }}>
                Sculpting
              </h3>
              <p className="text-sm sm:text-base" style={{ color: "#aaaaaa" }}>Expert-level miniature sculpting and design</p>
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                textAlign: "center",
              }}
              className="sm:p-8"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl" style={{ fontWeight: "600", marginBottom: "10px", color: "#4488ff" }}>
                Painting
              </h3>
              <p className="text-sm sm:text-base" style={{ color: "#aaaaaa" }}>Professional miniature painting techniques</p>
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                textAlign: "center",
              }}
              className="sm:p-8"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl" style={{ fontWeight: "600", marginBottom: "10px", color: "#4488ff" }}>
                D&D Expertise
              </h3>
              <p className="text-sm sm:text-base" style={{ color: "#aaaaaa" }}>Deep knowledge of fantasy gaming aesthetics</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default About;
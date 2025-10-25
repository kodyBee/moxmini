"use client";

import React from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "Dragon Miniature",
      category: "Monsters",
      price: 89.99,
      image: "https://via.placeholder.com/400x400",
    },
    {
      id: 2,
      name: "Warrior Hero",
      category: "Heroes",
      price: 45.99,
      image: "https://via.placeholder.com/400x400",
    },
    {
      id: 3,
      name: "Dungeon Set",
      category: "Terrain",
      price: 129.99,
      image: "https://via.placeholder.com/400x400",
    },
  ];

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
                  <Link href="/" className="text-blue-500 font-bold px-2 sm:px-3 lg:px-4 py-2 text-sm sm:text-base">
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
                  <Link href="/about" className="text-white hover:text-blue-500 transition-colors px-2 sm:px-3 lg:px-4 py-2 text-sm sm:text-base">
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
          color: "white",
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,18,32,0) 100%)",
          }}
          className="sm:py-20 lg:py-24"
        >
          <h1 style={{ fontWeight: "bold", marginBottom: "20px", lineHeight: "1.2" }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            World-Class D&D Miniatures
          </h1>
          <p style={{ color: "#cccccc", marginBottom: "40px", maxWidth: "800px", margin: "0 auto 40px", padding: "0 10px" }} className="text-base sm:text-lg md:text-xl lg:text-2xl">
            Hand-crafted miniatures that bring your tabletop adventures to life
          </p>
          <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap", padding: "0 10px" }}>
            <Link href="/salepage">
              <button
                className="text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4"
                style={{
                  fontWeight: "bold",
                  backgroundColor: "#4488ff",
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#6699ff";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#4488ff";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Shop Now
              </button>
            </Link>
            <Link href="/about">
              <button
                className="text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4"
                style={{
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                  color: "white",
                  border: "2px solid white",
                  borderRadius: "50px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* Featured Products Section */}
        <div style={{ padding: "40px 15px", maxWidth: "1200px", margin: "0 auto" }} className="sm:px-5 md:px-8 lg:px-5">
          <div style={{ textAlign: "center", marginBottom: "30px" }} className="sm:mb-12">
            <Separator className="mb-6 sm:mb-8 bg-white/20 max-w-4xl mx-auto" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl" style={{ fontWeight: "bold", marginBottom: "10px" }}>
              Featured Products
            </h2>
            <p className="text-base sm:text-lg md:text-xl" style={{ color: "#cccccc" }}>
              Discover our most popular miniatures
            </p>
            <Separator className="mt-8 bg-white/20 max-w-4xl mx-auto" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(68, 136, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "250px",
                    backgroundColor: "#333",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <p style={{ fontSize: "0.9rem", color: "#4488ff", marginBottom: "8px", fontWeight: "600" }}>
                  {product.category}
                </p>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", fontWeight: "bold" }}>
                  {product.name}
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#4488ff" }}>
                    ${product.price}
                  </span>
                  <button
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#4488ff",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#6699ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#4488ff";
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div style={{ padding: "40px 15px", background: "rgba(0, 0, 0, 0.3)" }} className="sm:px-5 md:px-8 lg:px-5 sm:py-20">
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl sm:mb-12" style={{ fontWeight: "bold", textAlign: "center", marginBottom: "30px" }}>
              Why Choose Mox Mini's?
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px" }} className="sm:gap-10">
              <div style={{ textAlign: "center" }}>
                <div className="text-4xl sm:text-5xl" style={{ marginBottom: "15px" }}>🎨</div>
                <h3 className="text-lg sm:text-xl md:text-2xl" style={{ fontWeight: "bold", marginBottom: "10px", color: "#4488ff" }}>
                  Expert Craftsmanship
                </h3>
                <p className="text-sm sm:text-base" style={{ color: "#cccccc", lineHeight: "1.6" }}>
                  Each miniature is meticulously crafted with attention to every detail
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="text-4xl sm:text-5xl" style={{ marginBottom: "15px" }}>⚔️</div>
                <h3 className="text-lg sm:text-xl md:text-2xl" style={{ fontWeight: "bold", marginBottom: "10px", color: "#4488ff" }}>
                  D&D Authentic
                </h3>
                <p className="text-sm sm:text-base" style={{ color: "#cccccc", lineHeight: "1.6" }}>
                  Designed with deep knowledge of fantasy gaming aesthetics
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="text-4xl sm:text-5xl" style={{ marginBottom: "15px" }}>✨</div>
                <h3 className="text-lg sm:text-xl md:text-2xl" style={{ fontWeight: "bold", marginBottom: "10px", color: "#4488ff" }}>
                  Premium Quality
                </h3>
                <p className="text-sm sm:text-base" style={{ color: "#cccccc", lineHeight: "1.6" }}>
                  World-class materials and painting techniques for lasting beauty
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ padding: "40px 15px", textAlign: "center" }} className="sm:px-5 md:px-8 sm:py-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl" style={{ fontWeight: "bold", marginBottom: "20px" }}>
            Ready to Start Your Collection?
          </h2>
          <p className="text-base sm:text-lg md:text-xl sm:mb-10" style={{ color: "#cccccc", marginBottom: "30px", padding: "0 10px" }}>
            Browse our full catalog and find the perfect miniatures for your campaign
          </p>
          <Link href="/salepage">
            <button
              className="text-base sm:text-lg md:text-xl px-8 sm:px-10 md:px-12 py-3 sm:py-4"
              style={{
                fontWeight: "bold",
                backgroundColor: "#4488ff",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#6699ff";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#4488ff";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              View All Products
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}

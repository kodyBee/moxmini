"use client";

import React from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

export default function Page() {
    const products = [
        {
            id: 1,
            name: "Custom Painted Miniature",
            price: 60,
            originalPrice: 150,
            image: "https://via.placeholder.com/300x300",
            description: "High-quality product with amazing features"
        },
        {
            id: 2,
            name: "Premium Product 2",
            price: 79.99,
            originalPrice: 120,
            image: "https://via.placeholder.com/300x300",
            description: "Best seller with excellent reviews"
        },
        {
            id: 3,
            name: "Premium Product 3",
            price: 130,
            originalPrice: 200,
            image: "https://via.placeholder.com/300x300",
            description: "Limited edition exclusive item"
        },
        {
            id: 4,
            name: "Premium Product 4",
            price: 59.99,
            originalPrice: 89.99,
            image: "https://via.placeholder.com/300x300",
            description: "Great value for money"
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
                                    <Link href="/" className="text-white hover:text-blue-500 transition-colors px-2 sm:px-3 lg:px-4 py-2 text-sm sm:text-base">
                                        Home
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/salepage" className="text-blue-500 font-bold px-2 sm:px-3 lg:px-4 py-2 text-sm sm:text-base">
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
                         Special Sale
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl" style={{ color: "#cccccc", marginBottom: "20px" }}>
                        Limited time offers - Don't miss out!
                    </p>
                    <Separator className="mt-8 bg-white/20" />
                </div>

                {/* Product Carousel */}
                <div style={{ maxWidth: "1200px", width: "100%", padding: "0 15px" }}>
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {products.map((product) => (
                                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                                    <div
                                        style={{
                                            background: "rgba(255, 255, 255, 0.05)",
                                            borderRadius: "12px",
                                            padding: "20px",
                                            border: "1px solid rgba(255, 255, 255, 0.1)",
                                            transition: "transform 0.3s, box-shadow 0.3s",
                                            cursor: "pointer",
                                            height: "100%",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(+5px)";
                                            e.currentTarget.style.boxShadow = "0 10px 30px rgba(255, 255, 255, 0.1)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        {/* Product Image */}
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "200px",
                                                backgroundColor: "#333",
                                                borderRadius: "8px",
                                                marginBottom: "15px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <h3 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                                            {product.name}
                                        </h3>
                                        <p style={{ color: "#aaaaaa", marginBottom: "15px", fontSize: "0.9rem" }}>
                                            {product.description}
                                        </p>

                                        {/* Price Section */}
                                        <div style={{ marginBottom: "15px" }}>
                                            <span style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#4488ff" }}>
                                                ${product.price}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: "1.2rem",
                                                    color: "#888",
                                                    textDecoration: "line-through",
                                                    marginLeft: "10px",
                                                }}
                                            >
                                                ${product.originalPrice}
                                            </span>
                                            <div style={{ color: "#00ff00", fontSize: "0.9rem", marginTop: "5px" }}>
                                                Save ${(product.originalPrice - product.price).toFixed(2)} (
                                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}
                                                % OFF)
                                            </div>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                backgroundColor: "#4488ff",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "8px",
                                                fontSize: "1rem",
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
                                            Get Started!
                                        </button>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="text-black border-black/20 hover:bg-black/10" />
                        <CarouselNext className="text-black border-black/20 hover:bg-black/10" />
                    </Carousel>
                </div>
            </main>
        </>
    );
}
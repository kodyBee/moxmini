"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const products = [
    {
      id: 1,
      name: "Human Fighter",
      price: 30,
      originalPrice: 50,
      image: "/fighterfront.jpeg",
      description: "High-quality product with amazing features",
      sku: "PREMADE-001",
    },
    {
      id: 2,
      name: "Premium Product 2",
      price: 79.99,
      originalPrice: 120,
      image: "https://via.placeholder.com/300x300",
      description: "Best seller with excellent reviews",
      sku: "PREMADE-002",
    },
    {
      id: 3,
      name: "Premium Product 3",
      price: 130,
      originalPrice: 200,
      image: "https://via.placeholder.com/300x300",
      description: "Limited edition exclusive item",
      sku: "PREMADE-003",
    },
    {
      id: 4,
      name: "Premium Product 4",
      price: 59.99,
      originalPrice: 89.99,
      image: "https://via.placeholder.com/300x300",
      description: "Great value for money",
      sku: "PREMADE-004",
    },
  ];

  const addToCart = (product: typeof products[0]) => {
    // Create cart item for premade product (no painting options needed)
    const cartItem = {
      product: {
        sku: product.sku,
        name: product.name,
        price: product.price.toString(),
        images: [{ URL: product.image }],
        material: "prepainted",
      },
      paintingOptions: {
        hairColor: "",
        skinColor: "",
        accessoryColor: "",
        fabricColor: "",
        specificDetails: "Prepainted miniature - no customization",
      },
      id: `${product.sku}-${Date.now()}`,
    };

    // Get existing cart from localStorage
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Add new item to cart
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"));

    // Show success message
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <>
      <style>{`html,body { height: 100%; margin: 0; }`}</style>

      {/* Navigation Bar */}
      <Navigation currentPage="premade" />

      <main
        style={{
          minHeight: "100vh",
          margin: 0,
          background: "linear-gradient(85deg, #000000 10%, #001220 40%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
        }}
        className="pt-4 px-5 sm:pt-10 sm:px-5"
      >
        {/* Header Section */}
        <div
          style={{
            textAlign: "center",
            width: "100%",
            maxWidth: "1200px",
            padding: "0 15px",
          }}
          className="mb-4 sm:mb-16"
        >
          <Separator className="mb-3 sm:mb-8 bg-white/20" />
          <h1
            className="text-2xl sm:text-4xl md:text-5xl mb-2"
            style={{ fontWeight: "bold" }}
          >
            Prepainted Miniature Favorites
          </h1>
          <p
            className="text-sm sm:text-lg md:text-xl mb-3 sm:mb-5"
            style={{ color: "#cccccc" }}
          >
            Swipe right or left to see more!
          </p>
          <Separator className="mt-3 sm:mt-8 bg-white/20" />
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
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
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
                      e.currentTarget.style.boxShadow =
                        "0 10px 30px rgba(255, 255, 255, 0.1)";
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <h3 className="text-xl sm:text-2xl mb-2 break-words">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm sm:text-base line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price Section */}
                    <div className="mb-4">
                      <span className="text-2xl sm:text-3xl font-bold text-blue-500">
                        ${product.price}
                      </span>
                      <span className="text-lg sm:text-xl text-gray-500 line-through ml-2 sm:ml-3">
                        ${product.originalPrice}
                      </span>
                      <div className="text-green-400 text-xs sm:text-sm mt-1">
                        Save $
                        {(product.originalPrice - product.price).toFixed(2)} (
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF)
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full px-4 py-3 text-sm sm:text-base font-bold text-white border-none rounded-lg cursor-pointer transition-colors"
                      style={{
                        backgroundColor: addedToCart === product.id ? "#00ff00" : "#4488ff",
                      }}
                      onMouseEnter={(e) => {
                        if (addedToCart !== product.id) {
                          e.currentTarget.style.backgroundColor = "#6699ff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (addedToCart !== product.id) {
                          e.currentTarget.style.backgroundColor = "#4488ff";
                        }
                      }}
                    >
                      {addedToCart === product.id ? "✓ Added to Cart!" : "Add to Cart"}
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

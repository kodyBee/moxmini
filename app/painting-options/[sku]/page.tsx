"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Navigation } from "@/components/ui/navigation";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/lib/types/product";

export default function PaintingOptionsPage() {
  const router = useRouter();
  const params = useParams();
  const sku = params.sku as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Painting options state
  const [hairColor, setHairColor] = useState("#8B4513");
  const [skinColor, setSkinColor] = useState("#FFDAB9");
  const [accessoryColor, setAccessoryColor] = useState("#C0C0C0");
  const [fabricColor, setFabricColor] = useState("#4169E1");
  const [specificDetails, setSpecificDetails] = useState("");

  useEffect(() => {
    // Fetch product details
    fetch("https://www.reapermini.com/api/productlist")
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((p: Product) => p.sku === sku);
        setProduct(foundProduct || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [sku]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    // Create cart item with painting options
    const cartItem = {
      product,
      paintingOptions: {
        hairColor,
        skinColor,
        accessoryColor,
        fabricColor,
        specificDetails,
      },
      id: `${sku}-${Date.now()}`, // Unique ID for this specific configuration
    };

    // Get existing cart from localStorage
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Add new item to cart
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"));

    // Navigate to cart page
    router.push("/cart");
  };

  if (loading) {
    return (
      <>
        <Navigation currentPage="figurefinder" />
        <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navigation currentPage="figurefinder" />
        <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black flex items-center justify-center">
          <div className="text-white text-xl">Product not found</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation currentPage="figurefinder" />
      
      <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black text-white py-6 sm:py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <Separator className="mb-4 sm:mb-6 bg-white/20" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Customize Your Miniature</h1>
            <p className="text-sm sm:text-base text-gray-400">Choose painting options for your figure</p>
            <Separator className="mt-4 sm:mt-6 bg-white/20" />
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Product Preview */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Product Details</h2>
              
              <div className="bg-black/40 rounded-lg p-4 mb-4 aspect-square relative overflow-hidden">
                {product.images && product.images[0]?.URL ? (
                  <Image
                    src={product.images[0].URL}
                    alt={product.name || "Product image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "contain" }}
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-2 break-words">{product.name}</h3>
              <div className="space-y-2 text-gray-300 text-sm sm:text-base">
                <p className="break-all">SKU: {product.sku}</p>
                {product.price && (
                  <p className="text-xl sm:text-2xl font-bold text-blue-400">${product.price}</p>
                )}
                {product.material && (
                  <p className="text-xs sm:text-sm">Material: {product.material}</p>
                )}
              </div>
            </div>

            {/* Painting Options Form */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Painting Options</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Hair Color */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hair Color
                  </label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <input
                      type="color"
                      value={hairColor}
                      onChange={(e) => setHairColor(e.target.value)}
                      className="w-16 h-10 sm:w-20 sm:h-12 rounded cursor-pointer border-2 border-white/20 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={hairColor}
                      onChange={(e) => setHairColor(e.target.value)}
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      placeholder="#8B4513"
                    />
                  </div>
                </div>

                {/* Skin Color */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Skin Color
                  </label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <input
                      type="color"
                      value={skinColor}
                      onChange={(e) => setSkinColor(e.target.value)}
                      className="w-16 h-10 sm:w-20 sm:h-12 rounded cursor-pointer border-2 border-white/20 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={skinColor}
                      onChange={(e) => setSkinColor(e.target.value)}
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      placeholder="#FFDAB9"
                    />
                  </div>
                </div>

                {/* Accessory Color */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Accessory Color
                  </label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <input
                      type="color"
                      value={accessoryColor}
                      onChange={(e) => setAccessoryColor(e.target.value)}
                      className="w-16 h-10 sm:w-20 sm:h-12 rounded cursor-pointer border-2 border-white/20 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={accessoryColor}
                      onChange={(e) => setAccessoryColor(e.target.value)}
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      placeholder="special instructions here"
                    />
                  </div>
                </div>

                {/* Fabric Color */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fabric Color
                  </label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <input
                      type="color"
                      value={fabricColor}
                      onChange={(e) => setFabricColor(e.target.value)}
                      className="w-16 h-10 sm:w-20 sm:h-12 rounded cursor-pointer border-2 border-white/20 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={fabricColor}
                      onChange={(e) => setFabricColor(e.target.value)}
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      placeholder="#4169E1"
                    />
                  </div>
                </div>

                {/* Specific Details */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Specific Details for the Artist
                  </label>
                  <textarea
                    value={specificDetails}
                    onChange={(e) => setSpecificDetails(e.target.value)}
                    rows={6}
                    className="w-full px-3 sm:px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 resize-none text-sm sm:text-base"
                    placeholder="Enter any specific instructions or details for the artist (e.g., weathering effects, specific shading style, battle damage, etc.)"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full sm:flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors text-sm sm:text-base"
                  >
                    Submit Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

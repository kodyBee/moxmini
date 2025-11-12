"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
  const [wantsPainting, setWantsPainting] = useState(true);
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
      paintingOptions: wantsPainting ? {
        hairColor,
        skinColor,
        accessoryColor,
        fabricColor,
        specificDetails,
      } : {
        hairColor: "",
        skinColor: "",
        accessoryColor: "",
        fabricColor: "",
        specificDetails: "Unpainted miniature - no custom painting service",
      },
      wantsPainting,
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
        <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black text-white py-6 sm:py-10 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Skeleton */}
            <div className="text-center mb-6 sm:mb-8">
              <Separator className="mb-4 sm:mb-6 bg-white/20" />
              <div className="animate-pulse space-y-3">
                <div className="h-8 bg-white/10 rounded w-64 mx-auto" />
                <div className="h-4 bg-white/10 rounded w-48 mx-auto" />
              </div>
              <Separator className="mt-4 sm:mt-6 bg-white/20" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {/* Product Preview Skeleton */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
                <div className="animate-pulse h-6 bg-white/10 rounded w-40 mb-4" />
                
                <div className="bg-black/40 rounded-lg p-4 mb-4 aspect-square">
                  <div className="animate-pulse h-full bg-white/10 rounded" />
                </div>

                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-32" />
                  <div className="h-8 bg-white/10 rounded w-24" />
                  <div className="h-4 bg-white/10 rounded w-40" />
                </div>
              </div>

              {/* Painting Options Form Skeleton */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
                <div className="animate-pulse h-6 bg-white/10 rounded w-48 mb-4 sm:mb-6" />
                
                <div className="space-y-4 sm:space-y-6">
                  {/* Color Picker Skeletons */}
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="animate-pulse h-4 bg-white/10 rounded w-24" />
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="animate-pulse w-16 h-10 sm:w-20 sm:h-12 bg-white/10 rounded" />
                        <div className="animate-pulse flex-1 h-10 sm:h-12 bg-white/10 rounded-lg" />
                      </div>
                    </div>
                  ))}
                  
                  {/* Textarea Skeleton */}
                  <div className="space-y-2">
                    <div className="animate-pulse h-4 bg-white/10 rounded w-48" />
                    <div className="animate-pulse w-full h-32 bg-white/10 rounded-lg" />
                  </div>

                  {/* Button Skeletons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <div className="animate-pulse w-full sm:flex-1 h-12 bg-white/10 rounded-lg" />
                    <div className="animate-pulse w-full sm:flex-1 h-12 bg-white/10 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              
              <div className="bg-black/40 rounded-lg p-4 mb-4 aspect-square relative overflow-hidden flex items-center justify-center">
                {product.images && product.images[0]?.URL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0].URL}
                    alt={product.name || "Product image"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
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
                {/* Custom Painting Service Option */}
                <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="wantsPainting"
                      checked={wantsPainting}
                      onChange={(e) => setWantsPainting(e.target.checked)}
                      className="mt-1 w-5 h-5 cursor-pointer accent-blue-500 flex-shrink-0"
                    />
                    <label htmlFor="wantsPainting" className="cursor-pointer flex-1">
                      <div className="font-bold text-base sm:text-lg mb-1">
                        Professional Custom Painting Service - $25.00
                      </div>
                      <p className="text-sm text-gray-300">
                        {wantsPainting 
                          ? "Your miniature will be hand-painted by our artist with your custom color choices."
                          : "Uncheck to receive an unpainted miniature (miniature base price only)."}
                      </p>
                    </label>
                  </div>
                </div>
                {wantsPainting && (
                  <>
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
                        <p className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-sm sm:text-base">
                          {hairColor}
                        </p>
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
                        <p className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-sm sm:text-base">
                          {skinColor}
                        </p>
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
                        <p className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-sm sm:text-base">
                          {accessoryColor}
                        </p>
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
                        <p className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-sm sm:text-base">
                          {fabricColor}
                        </p>
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
                  </>
                )}
                
                {!wantsPainting && (
                  <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 text-center">
                    <p className="text-gray-300 text-sm sm:text-base">
                      You will receive an unpainted miniature. You can paint it yourself or leave it as is.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="cursor-pointer w-full sm:flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer w-full sm:flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors text-sm sm:text-base"
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

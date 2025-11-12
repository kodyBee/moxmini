"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/ui/navigation";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/lib/types/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateItemColor = (itemId: string, colorType: string, newColor: string) => {
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          paintingOptions: {
            ...item.paintingOptions,
            [colorType]: newColor,
          },
        };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateItemDetails = (itemId: string, newDetails: string) => {
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          paintingOptions: {
            ...item.paintingOptions,
            specificDetails: newDetails,
          },
        };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.product.price || "0");
      return total + price;
    }, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);

    try {
      // Create checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: cart,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout using the URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to proceed to checkout. Please try again.";
      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  if (!isLoaded) {
    return (
      <>
        <Navigation currentPage="cart" />
        <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black flex items-center justify-center">
          <div className="text-white text-xl">Loading cart...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation currentPage="cart" />
      
      <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Separator className="mb-6 bg-white/20" />
            <h1 className="text-4xl font-bold mb-2">Your Cart</h1>
            <p className="text-gray-400">
              {cart.length === 0 
                ? "Your cart is empty" 
                : `${cart.length} item${cart.length !== 1 ? 's' : ''} in your cart`}
            </p>
            <Separator className="mt-6 bg-white/20" />
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400 mb-6">
                You haven&apos;t added any miniatures to your cart yet.
              </p>
              <Link
                href="/figurefinder"
                className="cursor-pointer inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
              >
                Browse Miniatures
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-full sm:w-32 h-48 sm:h-32 bg-black/40 rounded-lg relative overflow-hidden">
                        {item.product.images && item.product.images[0]?.URL ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.product.images[0].URL}
                            alt={item.product.name || "Product image"}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold mb-1 break-words">
                              {item.product.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 break-all">
                              SKU: {item.product.sku}
                            </p>
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0">
                            <div className="text-xl sm:text-2xl font-bold text-blue-400">
                              ${item.product.price}
                            </div>
                          </div>
                        </div>

                        {/* Painting Options or Description */}
                        {item.product.material === "prepainted" ? (
                          // Show description for prepainted/premade products
                          <div className="bg-black/30 rounded-lg p-3 sm:p-4 mb-4">
                            <h4 className="font-semibold text-xs sm:text-sm text-gray-300 mb-2">
                              Product Description:
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-300 break-words">
                              {item.product.description || "Professionally prepainted miniature ready for your adventures."}
                            </p>
                          </div>
                        ) : (
                          // Show painting options for custom products
                          <div className="bg-black/30 rounded-lg p-3 sm:p-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-semibold text-xs sm:text-sm text-gray-300">
                                Painting Options:
                              </h4>
                              <button
                                onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                                className="cursor-pointer text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                {editingItemId === item.id ? "Done Editing" : "Edit Colors"}
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">Hair:</span>
                                {editingItemId === item.id ? (
                                  <input
                                    type="color"
                                    value={item.paintingOptions.hairColor}
                                    onChange={(e) => updateItemColor(item.id, "hairColor", e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-2 border-white/30 flex-shrink-0"
                                  />
                                ) : (
                                  <div
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded border-2 border-white/30 flex-shrink-0"
                                    style={{ backgroundColor: item.paintingOptions.hairColor }}
                                    title={item.paintingOptions.hairColor}
                                  />
                                )}
                                <span className="text-xs text-gray-500 truncate">
                                  {item.paintingOptions.hairColor}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">Skin:</span>
                                {editingItemId === item.id ? (
                                  <input
                                    type="color"
                                    value={item.paintingOptions.skinColor}
                                    onChange={(e) => updateItemColor(item.id, "skinColor", e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-2 border-white/30 flex-shrink-0"
                                  />
                                ) : (
                                  <div
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded border-2 border-white/30 flex-shrink-0"
                                    style={{ backgroundColor: item.paintingOptions.skinColor }}
                                    title={item.paintingOptions.skinColor}
                                  />
                                )}
                                <span className="text-xs text-gray-500 truncate">
                                  {item.paintingOptions.skinColor}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">Accessory:</span>
                                {editingItemId === item.id ? (
                                  <input
                                    type="color"
                                    value={item.paintingOptions.accessoryColor}
                                    onChange={(e) => updateItemColor(item.id, "accessoryColor", e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-2 border-white/30 flex-shrink-0"
                                  />
                                ) : (
                                  <div
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded border-2 border-white/30 flex-shrink-0"
                                    style={{ backgroundColor: item.paintingOptions.accessoryColor }}
                                    title={item.paintingOptions.accessoryColor}
                                  />
                                )}
                                <span className="text-xs text-gray-500 truncate">
                                  {item.paintingOptions.accessoryColor}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">Fabric:</span>
                                {editingItemId === item.id ? (
                                  <input
                                    type="color"
                                    value={item.paintingOptions.fabricColor}
                                    onChange={(e) => updateItemColor(item.id, "fabricColor", e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-2 border-white/30 flex-shrink-0"
                                  />
                                ) : (
                                  <div
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded border-2 border-white/30 flex-shrink-0"
                                    style={{ backgroundColor: item.paintingOptions.fabricColor }}
                                    title={item.paintingOptions.fabricColor}
                                  />
                                )}
                                <span className="text-xs text-gray-500 truncate">
                                  {item.paintingOptions.fabricColor}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <span className="text-xs sm:text-sm text-gray-400 block mb-1">
                                Special Instructions:
                              </span>
                              {editingItemId === item.id ? (
                                <textarea
                                  value={item.paintingOptions.specificDetails || ""}
                                  onChange={(e) => updateItemDetails(item.id, e.target.value)}
                                  rows={3}
                                  className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 resize-none text-xs sm:text-sm text-gray-300"
                                  placeholder="Enter any specific instructions for the artist..."
                                />
                              ) : (
                                <p className="text-xs sm:text-sm text-gray-300 break-words">
                                  {item.paintingOptions.specificDetails || "No special instructions"}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cursor-pointer w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Remove from Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 sticky top-4">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-300">
                      <span>Painting Service:</span>
                      <span>Included</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping:</span>
                      <span className="text-sm">Calculated at checkout</span>
                    </div>
                    
                    <Separator className="bg-white/20" />
                    
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-blue-400">
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing || cart.length === 0}
                    className="cursor-pointer w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-colors mb-3 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Proceed to Checkout
                      </>
                    )}
                  </button>
                  
                  <Link
                    href="/figurefinder"
                    className="cursor-pointer block text-center py-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Continue Shopping
                  </Link>

                  {cart.length > 0 && (
                    <>
                      <Separator className="my-4 bg-white/20" />
                      <button
                        onClick={clearCart}
                        className="cursor-pointer w-full py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-600/30"
                      >
                        Clear Cart
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

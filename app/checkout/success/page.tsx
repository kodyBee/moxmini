"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navigation } from "@/components/ui/navigation";
import { Separator } from "@/components/ui/separator";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Clear the cart after successful payment
    if (sessionId) {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [sessionId]);

  return (
    <>
      <Navigation currentPage="cart" />
      
      <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black text-white py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Separator className="mb-8 bg-white/20" />
          
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="bg-green-500/20 rounded-full p-4 sm:p-6">
              <svg
                className="w-16 h-16 sm:w-24 sm:h-24 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-6">
            Thank you for your order!
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mb-8">
            <p className="text-sm sm:text-base text-gray-300 mb-2">
              Your order has been confirmed and is being processed.
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              You will receive an email confirmation shortly with your order details.
            </p>
            {sessionId && (
              <p className="text-gray-500 text-xs mt-4">
                Order ID: {sessionId}
              </p>
            )}
          </div>

          <Separator className="mb-8 bg-white/20" />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/figurefinder"
              className="cursor-pointer px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="cursor-pointer px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors border border-white/20"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <>
        <Navigation currentPage="cart" />
        <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black text-white flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </main>
      </>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

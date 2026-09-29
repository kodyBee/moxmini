"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart";

const PROCESSED_KEY = "processedSessions";

/**
 * Empties the cart the first time a given checkout's success page loads.
 * Revisiting the page later (e.g. from history) won't wipe a newer cart.
 */
export function ClearCartOnce({ sessionId }: { sessionId: string }) {
  useEffect(() => {
    try {
      const processed: unknown = JSON.parse(
        localStorage.getItem(PROCESSED_KEY) || "[]"
      );
      const sessions = Array.isArray(processed) ? processed : [];
      if (sessions.includes(sessionId)) return;
      clearCart();
      localStorage.setItem(
        PROCESSED_KEY,
        JSON.stringify([...sessions, sessionId].slice(-20))
      );
    } catch {
      clearCart();
    }
  }, [sessionId]);

  return null;
}

"use client";

import { useSyncExternalStore } from "react";
import { PAINTING_FEE } from "@/lib/pricing";

export interface PaintingOptions {
  hairColor: string;
  skinColor: string;
  accessoryColor: string;
  fabricColor: string;
  specificDetails: string;
}

export interface CartProduct {
  sku: string;
  name: string;
  /** Price in dollars, as a string (the format older carts were saved in) */
  price?: string;
  images?: Array<{ URL?: string }>;
  /** "prepainted" for Mox's premade pieces, otherwise the Reaper material */
  material?: string;
  description?: string;
}

export interface CartItem {
  id: string;
  product: CartProduct;
  paintingOptions: PaintingOptions;
  wantsPainting?: boolean;
}

export type NewCartItem = Omit<CartItem, "id">;

// Same key the site has always used, so existing carts carry over
const STORAGE_KEY = "cart";

export function isPrepainted(item: CartItem) {
  return item.product.material === "prepainted";
}

export function wantsCustomPainting(item: CartItem) {
  return !isPrepainted(item) && item.wantsPainting !== false;
}

export function itemPrice(item: CartItem) {
  const price = Number.parseFloat(item.product.price ?? "");
  return Number.isFinite(price) ? price : 0;
}

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + itemPrice(item), 0);
  const paintedCount = items.filter(wantsCustomPainting).length;
  const painting = paintedCount * PAINTING_FEE;
  return { subtotal, paintedCount, painting, total: subtotal + painting };
}

function parse(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is CartItem =>
        typeof item?.id === "string" && typeof item?.product?.sku === "string"
    );
  } catch {
    return [];
  }
}

// useSyncExternalStore needs a stable snapshot, so re-parse only when the
// stored string actually changes.
let cachedRaw: string | null | undefined;
let cachedItems: CartItem[] = [];

function getSnapshot(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked site data)
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedItems = parse(raw);
  }
  return cachedItems;
}

// The server can't see localStorage; null means "not loaded yet"
function getServerSnapshot(): CartItem[] | null {
  return null;
}

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key === STORAGE_KEY || event.key === null) emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function write(items: CartItem[]) {
  try {
    if (items.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch (error) {
    console.error("Could not save cart:", error);
  }
  emit();
}

export function addToCart(item: NewCartItem) {
  write([
    ...getSnapshot(),
    { ...item, id: `${item.product.sku}-${Date.now()}` },
  ]);
}

export function removeFromCart(id: string) {
  write(getSnapshot().filter((item) => item.id !== id));
}

export function updatePaintingOptions(
  id: string,
  changes: Partial<PaintingOptions>
) {
  write(
    getSnapshot().map((item) =>
      item.id === id
        ? { ...item, paintingOptions: { ...item.paintingOptions, ...changes } }
        : item
    )
  );
}

export function clearCart() {
  write([]);
}

/** The cart's items, or null during server rendering and hydration */
export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

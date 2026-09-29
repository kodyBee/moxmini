"use client";

import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart, useCart } from "@/lib/cart";
import type { PremadeProduct } from "@/lib/db";

export function AddPremadeButton({ product }: { product: PremadeProduct }) {
  const items = useCart();
  const inCart =
    items?.some((item) => item.product.sku === product.sku) ?? false;

  if (inCart) {
    // Each premade piece is unique, so it can only be in the cart once
    return (
      <Button asChild variant="outline" className="w-full">
        <Link href="/cart">
          <Check aria-hidden className="text-success" />
          In your cart
        </Link>
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      disabled={items === null}
      onClick={() =>
        addToCart({
          product: {
            sku: product.sku,
            name: product.name,
            price: product.price.toString(),
            images: [{ URL: product.image }],
            material: "prepainted",
            description: product.description,
          },
          paintingOptions: {
            hairColor: "N/A",
            skinColor: "N/A",
            accessoryColor: "N/A",
            fabricColor: "N/A",
            specificDetails: "Premade - Already Painted",
          },
          wantsPainting: false,
        })
      }
    >
      <ShoppingBag aria-hidden />
      Add to cart
    </Button>
  );
}

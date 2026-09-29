import type { Metadata } from "next";
import { CartView } from "./cart-view";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="container-page pt-14 md:pt-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Your cart
      </h1>
      <CartView />
    </div>
  );
}
